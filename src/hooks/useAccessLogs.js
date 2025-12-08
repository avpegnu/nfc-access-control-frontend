import { useState, useEffect } from 'react';
import { accessLogsRef, onValue } from '../services/firebase';

export function useAccessLogs(limit = 50) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onValue(
      accessLogsRef(),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const logList = Object.entries(data)
            .map(([id, log]) => ({ id, ...log }))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
          setLogs(logList);
        } else {
          setLogs([]);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limit]);

  return { logs, loading, error };
}
