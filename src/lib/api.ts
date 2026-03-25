import { supabase } from './supabase';

export const api = {
  stats: async () => {
    const [
      { count: sitesCount },
      { count: assetsCount },
      { count: devicesCount },
      { count: diagramsCount }
    ] = await Promise.all([
      supabase.from('sites').select('*', { count: 'exact', head: true }),
      supabase.from('assets').select('*', { count: 'exact', head: true }),
      supabase.from('devices').select('*', { count: 'exact', head: true }),
      supabase.from('infrastructure_diagrams').select('*', { count: 'exact', head: true })
    ]);

    return {
      sites: sitesCount || 0,
      assets: assetsCount || 0,
      devices: devicesCount || 0,
      diagrams: diagramsCount || 0
    };
  },

  getAll: async (table: string) => {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getOne: async (table: string, id: string) => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },

  create: async (table: string, record: Record<string, unknown>) => {
    const { data, error } = await supabase.from(table).insert(record).select().single();
    if (error) throw error;
    return data;
  },

  update: async (table: string, id: string, record: Record<string, unknown>) => {
    const { data, error } = await supabase.from(table).update(record).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  },

  users: {
    getAll: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    getOne: async (id: string) => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    },
    update: async (id: string, record: Record<string, unknown>) => {
      const { data, error } = await supabase.from('profiles').update(record).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
    }
  },

  activityLog: {
    getAll: async (filters?: { action?: string; table_name?: string }) => {
      let query = supabase.from('activity_log').select('*').order('created_at', { ascending: false });
      if (filters?.action && filters.action !== 'all') {
        query = query.eq('action', filters.action);
      }
      if (filters?.table_name && filters.table_name !== 'all') {
        query = query.eq('table_name', filters.table_name);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  },

  profile: {
    get: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    update: async (record: { full_name?: string; avatar_url?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('profiles').update(record).eq('id', user.id).select().single();
      if (error) throw error;
      return data;
    }
  },

  sites: {
    getAll: async () => {
      const { data, error } = await supabase.from('sites').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  },

  assets: {
    getAll: async () => {
      const { data, error } = await supabase.from('assets').select('*, category:asset_categories(*)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  },

  locations: {
    getAll: async () => {
      const { data, error } = await supabase.from('locations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  },

  diagrams: {
    getAll: async () => {
      const { data, error } = await supabase.from('infrastructure_diagrams').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    getOne: async (id: string) => {
      const { data, error } = await supabase.from('infrastructure_diagrams').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    },
    create: async (record: Record<string, unknown>) => {
      const { data, error } = await supabase.from('infrastructure_diagrams').insert(record).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, record: Record<string, unknown>) => {
      const { data, error } = await supabase.from('infrastructure_diagrams').update(record).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('infrastructure_diagrams').delete().eq('id', id);
      if (error) throw error;
    }
  }
};

export default api;
