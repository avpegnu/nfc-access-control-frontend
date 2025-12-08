import { useState, useEffect } from 'react';
import { db, usersRef, onValue, set, push, remove, ref, update } from '../services/firebase';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onValue(
      usersRef(),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userList = Object.entries(data).map(([id, user]) => ({
            id,
            ...user,
          }));
          setUsers(userList);
        } else {
          setUsers([]);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addUser = async (userData) => {
    try {
      // 1. Add user to users collection
      const newUserRef = push(usersRef());
      await set(newUserRef, {
        ...userData,
        isActive: true,
        role: userData.role || 'user',
        createdAt: Date.now(),
      });

      // 2. Add to cardIndex for quick lookup
      await set(ref(db, `cardIndex/${userData.cardUid}`), newUserRef.key);

      return newUserRef.key;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      await update(ref(db, `users/${userId}`), {
        ...userData,
        updatedAt: Date.now(),
      });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteUser = async (userId, cardUid) => {
    try {
      // 1. Remove from users
      await remove(ref(db, `users/${userId}`));
      // 2. Remove from cardIndex
      if (cardUid) {
        await remove(ref(db, `cardIndex/${cardUid}`));
      }
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleUserActive = async (userId, currentStatus) => {
    try {
      await set(ref(db, `users/${userId}/isActive`), !currentStatus);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { users, loading, error, addUser, updateUser, deleteUser, toggleUserActive };
}
