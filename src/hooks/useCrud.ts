import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

interface UseCrudOptions {
  table: string;
}

export function useCrud<T extends { id: string }>({ table }: UseCrudOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await api.getAll(table);
      setData(rows as T[]);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (payload: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    await api.create(table, payload);
    await load();
  };

  const update = async (id: string, payload: Partial<T>) => {
    await api.update(table, id, payload);
    await load();
  };

  const remove = async (id: string) => {
    await api.delete(table, id);
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  return { data, loading, error, load, create, update, remove };
}
