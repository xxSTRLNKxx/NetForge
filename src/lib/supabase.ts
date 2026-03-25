// Legacy Supabase compatibility stub
// This file exists only for backwards compatibility with old code
// New code should use the api module instead

const createQuery = () => ({
  data: [],
  error: null,
  order: () => createQuery(),
  eq: () => createQuery(),
  maybeSingle: () => ({ data: null, error: null }),
});

export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => createQuery(),
    insert: (data: any) => createQuery(),
    update: (data: any) => createQuery(),
    delete: () => createQuery(),
  }),
};
