import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.getUsers({ limit: 1000 }); // Get all users

      if (response.success) {
        setUsers(response.data.items || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and SSE subscription
  useEffect(() => {
    fetchUsers();

    // Subscribe to SSE for user updates
    const handleSSEEvent = (event) => {
      if (event.type === 'user_update') {
        // Refetch users when there's an update
        fetchUsers();
      }
    };

    api.connectSSE(handleSSEEvent, () => {});

    return () => {
      // Don't disconnect SSE here
    };
  }, [fetchUsers]);

  // Add new user
  const addUser = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await api.createUser(userData);

      if (response.success) {
        // Add to local state immediately
        setUsers(prev => [...prev, response.data]);
        return response.data.id;
      }

      throw new Error('Failed to create user');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (userId, userData) => {
    try {
      setError(null);
      const response = await api.updateUser(userId, userData);

      if (response.success) {
        // Update local state
        setUsers(prev => prev.map(u =>
          u.id === userId ? response.data : u
        ));
        return true;
      }

      throw new Error('Failed to update user');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(async (userId) => {
    try {
      setError(null);
      await api.deleteUser(userId);

      // Remove from local state
      setUsers(prev => prev.filter(u => u.id !== userId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Toggle user active status
  const toggleUserActive = useCallback(async (userId) => {
    try {
      setError(null);
      const response = await api.toggleUserActive(userId);

      if (response.success) {
        // Update local state
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, isActive: response.data.isActive } : u
        ));
        return true;
      }

      throw new Error('Failed to toggle user status');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    toggleUserActive,
    refetch: fetchUsers
  };
}
