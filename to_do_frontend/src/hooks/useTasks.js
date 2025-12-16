/* Tasks state management hook */
import { useCallback, useEffect, useState } from 'react';
import { listTasks, createTask as apiCreate, updateTask as apiUpdate, deleteTask as apiDelete, toggleTaskStatus as apiToggle } from '../api/client';

// PUBLIC_INTERFACE
export default function useTasks() {
  /**
   * Hook to manage tasks with API integration.
   * Exposes tasks, loading, error, and CRUD functions.
   */
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const safeSetError = (e) => {
    const msg = e?.message || 'Unexpected error';
    setError(msg);
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      safeSetError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // PUBLIC_INTERFACE
  const createTask = useCallback(async (task) => {
    setLoading(true);
    setError('');
    try {
      const created = await apiCreate(task);
      setTasks((prev) => [created, ...prev]);
    } catch (e) {
      safeSetError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // PUBLIC_INTERFACE
  const updateTask = useCallback(async (id, updates) => {
    setLoading(true);
    setError('');
    try {
      const updated = await apiUpdate(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      safeSetError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // PUBLIC_INTERFACE
  const deleteTask = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      await apiDelete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      safeSetError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // PUBLIC_INTERFACE
  const toggleStatus = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const current = tasks.find((t) => t.id === id);
      if (!current) throw new Error('Task not found');
      const updated = await apiToggle(id, current.status);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      safeSetError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
    refresh,
  };
}
