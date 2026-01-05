import { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

export function useDoorStatus(doorId = "door_main") {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commandLoading, setCommandLoading] = useState(false);
  const sseConnectedRef = useRef(false);

  // Fetch initial status
  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const response = await api.getDoorStatus(doorId);

      if (response.success) {
        setStatus(response.data.status);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [doorId]);

  // Initial fetch and SSE subscription
  useEffect(() => {
    fetchStatus();

    // Subscribe to SSE for realtime updates
    const handleSSEEvent = (event) => {
      if (event.type === "door_status" && event.data.doorId === doorId) {
        setStatus(event.data.status);
      }
    };

    const handleSSEError = () => {
      // On SSE error, fall back to polling
      if (!sseConnectedRef.current) {
        const pollInterval = setInterval(fetchStatus, 5000);
        return () => clearInterval(pollInterval);
      }
    };

    // Connect SSE and get unsubscribe function
    const unsubscribe = api.connectSSE(handleSSEEvent, handleSSEError);
    sseConnectedRef.current = true;

    return () => {
      // Unsubscribe this specific handler
      if (unsubscribe) unsubscribe();
      sseConnectedRef.current = false;
    };
  }, [doorId, fetchStatus]);

  // Send command to door
  const sendCommand = useCallback(
    async (action) => {
      try {
        setError(null);
        setCommandLoading(true);

        const response = await api.sendDoorCommand(doorId, action);

        // Do NOT optimistically update - wait for ESP32 to send actual status via SSE
        // This ensures UI reflects real door state, not just the command sent

        return response.success;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setCommandLoading(false);
      }
    },
    [doorId]
  );

  const unlockDoor = useCallback(() => sendCommand("unlock"), [sendCommand]);
  const lockDoor = useCallback(() => sendCommand("lock"), [sendCommand]);

  return {
    status,
    loading,
    error,
    commandLoading,
    unlockDoor,
    lockDoor,
    refetch: fetchStatus,
  };
}
