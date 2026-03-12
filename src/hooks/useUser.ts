import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { mockApi } from '../mock/mockApi';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const data = await mockApi.getCurrentUser();
    setUser(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await mockApi.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  return { user, loading, updateProfile, refresh: fetchUser };
};
