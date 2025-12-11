/**
 * API Service - Handles all communication with Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.eventSource = null;
  }

  // ============ Token Management ============

  getToken() {
    return localStorage.getItem('authToken');
  }

  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    localStorage.removeItem('authToken');
  }

  // ============ Base Request ============

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          this.clearToken();
          // Don't redirect here, let the AuthContext handle it
        }
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // ============ Auth APIs ============

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(email, password, displayName) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { email, password, displayName },
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
      this.disconnectSSE();
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // ============ User APIs ============

  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: userData,
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async toggleUserActive(userId) {
    return this.request(`/users/${userId}/toggle`, {
      method: 'PATCH',
    });
  }

  // ============ Card APIs (API v1) ============

  async getCards(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/v1/cards${queryString ? `?${queryString}` : ''}`);
  }

  async getCardById(cardId) {
    return this.request(`/v1/cards/${cardId}`);
  }

  async updateCard(cardId, cardData) {
    return this.request(`/v1/cards/${cardId}`, {
      method: 'PUT',
      body: cardData,
    });
  }

  async assignUserToCard(cardId, userId, policy = {}) {
    return this.request(`/v1/cards/${cardId}/assign`, {
      method: 'POST',
      body: { user_id: userId, policy },
    });
  }

  async revokeCard(cardId, reason = '') {
    return this.request(`/v1/cards/${cardId}/revoke`, {
      method: 'POST',
      body: { reason },
    });
  }

  async deleteCard(cardId) {
    return this.request(`/v1/cards/${cardId}`, {
      method: 'DELETE',
    });
  }

  // ============ Device APIs (API v1) ============

  async getDevices() {
    return this.request('/v1/device/list');
  }

  async getDeviceById(deviceId) {
    return this.request(`/v1/device/${deviceId}`);
  }

  async updateDeviceConfig(deviceId, config) {
    return this.request(`/v1/device/${deviceId}/config`, {
      method: 'PUT',
      body: config,
    });
  }

  // ============ Door APIs ============

  async getDoors() {
    return this.request('/doors');
  }

  async getDoorStatus(doorId = 'door_main') {
    return this.request(`/doors/${doorId}`);
  }

  async sendDoorCommand(doorId, action) {
    return this.request(`/doors/${doorId}/command`, {
      method: 'POST',
      body: { action },
    });
  }

  // ============ Access Log APIs ============

  async getAccessLogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/access/logs${queryString ? `?${queryString}` : ''}`);
  }

  async getAccessStats(period = 'today') {
    return this.request(`/access/stats?period=${period}`);
  }

  async getRecentLogs(limit = 10) {
    return this.request(`/access/recent?limit=${limit}`);
  }

  // ============ Server-Sent Events ============

  connectSSE(onEvent, onError) {
    const token = this.getToken();

    if (!token) {
      console.warn('No token for SSE connection');
      return null;
    }

    // Close existing connection
    this.disconnectSSE();

    const url = `${this.baseUrl}/realtime/events?token=${encodeURIComponent(token)}`;
    this.eventSource = new EventSource(url);

    // Connection opened
    this.eventSource.addEventListener('connected', (e) => {
      console.log('SSE connected:', JSON.parse(e.data));
    });

    // Door status updates
    this.eventSource.addEventListener('door_status', (e) => {
      const data = JSON.parse(e.data);
      onEvent({ type: 'door_status', data });
    });

    // Access log updates
    this.eventSource.addEventListener('access_log', (e) => {
      const data = JSON.parse(e.data);
      onEvent({ type: 'access_log', data });
    });

    // User updates
    this.eventSource.addEventListener('user_update', (e) => {
      const data = JSON.parse(e.data);
      onEvent({ type: 'user_update', data });
    });

    // Heartbeat
    this.eventSource.addEventListener('heartbeat', () => {
      // Connection is alive
    });

    // Error handling
    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      if (onError) onError(error);

      // Auto-reconnect after 5 seconds
      if (this.eventSource?.readyState === EventSource.CLOSED) {
        setTimeout(() => {
          console.log('SSE reconnecting...');
          this.connectSSE(onEvent, onError);
        }, 5000);
      }
    };

    return this.eventSource;
  }

  disconnectSSE() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('SSE disconnected');
    }
  }

  isSSEConnected() {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

// Export singleton instance
const api = new ApiService();
export default api;
