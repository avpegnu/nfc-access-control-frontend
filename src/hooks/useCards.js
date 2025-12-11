import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Hook to manage NFC cards
 */
export function useCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCards = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCards(filters);
      if (response.success) {
        setCards(response.data || []);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const assignUser = async (cardId, userId, policy = {}) => {
    try {
      setError(null);
      const response = await api.assignUserToCard(cardId, userId, policy);
      if (response.success) {
        // Update local state
        setCards(prev => prev.map(card =>
          card.card_id === cardId
            ? { ...card, user_id: userId, enroll_mode: false, policy }
            : card
        ));
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateCard = async (cardId, cardData) => {
    try {
      setError(null);
      const response = await api.updateCard(cardId, cardData);
      if (response.success) {
        setCards(prev => prev.map(card =>
          card.card_id === cardId ? { ...card, ...response.data } : card
        ));
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const revokeCard = async (cardId, reason = '') => {
    try {
      setError(null);
      const response = await api.revokeCard(cardId, reason);
      if (response.success) {
        setCards(prev => prev.map(card =>
          card.card_id === cardId ? { ...card, status: 'revoked' } : card
        ));
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCard = async (cardId) => {
    try {
      setError(null);
      await api.deleteCard(cardId);
      setCards(prev => prev.filter(card => card.card_id !== cardId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get cards by status
  const pendingCards = cards.filter(c => c.enroll_mode && !c.user_id);
  const activeCards = cards.filter(c => c.status === 'active' && !c.enroll_mode);
  const revokedCards = cards.filter(c => c.status === 'revoked');

  return {
    cards,
    pendingCards,
    activeCards,
    revokedCards,
    loading,
    error,
    fetchCards,
    assignUser,
    updateCard,
    revokeCard,
    deleteCard,
  };
}

/**
 * Hook to manage devices
 */
export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDevices();
      if (response.success) {
        setDevices(response.data || []);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const updateConfig = async (deviceId, config) => {
    try {
      setError(null);
      const response = await api.updateDeviceConfig(deviceId, config);
      if (response.success) {
        setDevices(prev => prev.map(device =>
          device.device_id === deviceId
            ? { ...device, config: { ...device.config, ...response.data } }
            : device
        ));
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get online/offline devices
  const onlineDevices = devices.filter(d => d.online);
  const offlineDevices = devices.filter(d => !d.online);

  return {
    devices,
    onlineDevices,
    offlineDevices,
    loading,
    error,
    fetchDevices,
    updateConfig,
  };
}
