import { useState, useEffect } from 'react';
import { doorStatusRef, doorCommandRef, onValue, set } from '../services/firebase';

export function useDoorStatus(doorId = 'door_main') {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onValue(
      doorStatusRef(doorId),
      (snapshot) => {
        setStatus(snapshot.val());
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [doorId]);

  const sendCommand = async (action) => {
    try {
      // Gửi command lên Firebase
      await set(doorCommandRef(doorId), {
        action: action,
        timestamp: Date.now(),
        requestedBy: 'web_admin',
        processed: false,
      });

      // GIẢ LẬP: Vì chưa có ESP32, tự cập nhật status luôn
      // Khi có ESP32 thật, có thể xóa đoạn này
      const newIsOpen = action === 'unlock';
      await set(doorStatusRef(doorId), {
        isOpen: newIsOpen,
        isOnline: true,
        lastUpdated: Date.now(),
      });

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const unlockDoor = () => sendCommand('unlock');
  const lockDoor = () => sendCommand('lock');

  return { status, loading, error, unlockDoor, lockDoor };
}
