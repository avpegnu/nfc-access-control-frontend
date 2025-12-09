import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useAccessLogs(limit = 50) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    totalPages: 0
  });

  // Fetch logs
  const fetchLogs = useCallback(async (page = 1) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.getAccessLogs({ page, limit });

      if (response.success) {
        setLogs(response.data.items || []);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Initial fetch and SSE subscription
  useEffect(() => {
    fetchLogs();

    // Subscribe to SSE for new access logs
    const handleSSEEvent = (event) => {
      if (event.type === 'access_log') {
        // Add new log to the top of the list
        setLogs(prev => {
          const newLogs = [event.data, ...prev];
          // Keep only the latest 'limit' logs
          return newLogs.slice(0, limit);
        });
        // Update total count
        setPagination(prev => ({
          ...prev,
          total: prev.total + 1
        }));
      }
    };

    api.connectSSE(handleSSEEvent, () => {});

    return () => {
      // Don't disconnect SSE here
    };
  }, [fetchLogs, limit]);

  // Go to page
  const goToPage = useCallback((page) => {
    fetchLogs(page);
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    pagination,
    goToPage,
    refetch: () => fetchLogs(pagination.page)
  };
}

/**
 * Hook for access statistics (for Dashboard)
 */
export function useAccessStats(period = 'today') {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await api.getAccessStats(period);

      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();

    // Refetch stats when new access log comes in
    const handleSSEEvent = (event) => {
      if (event.type === 'access_log') {
        fetchStats();
      }
    };

    api.connectSSE(handleSSEEvent, () => {});
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

/**
 * Hook for recent logs (for Dashboard widget)
 */
export function useRecentLogs(limit = 10) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setError(null);
      const response = await api.getRecentLogs(limit);

      if (response.success) {
        setLogs(response.data.logs || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLogs();

    // Subscribe to SSE for new access logs
    const handleSSEEvent = (event) => {
      if (event.type === 'access_log') {
        setLogs(prev => {
          const newLogs = [event.data, ...prev];
          return newLogs.slice(0, limit);
        });
      }
    };

    api.connectSSE(handleSSEEvent, () => {});
  }, [fetchLogs, limit]);

  return { logs, loading, error, refetch: fetchLogs };
}
