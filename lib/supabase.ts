import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Standard Supabase URL and Anon Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * PRODUCTION NOTE:
 * Use the helper functions in @/lib/supabase/server or @/lib/supabase/client 
 * for most operations. This static client should only be used for public-only
 * tasks or simple utility scripts.
 */
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

/**
 * CAUTION: This bypasses all Row Level Security (RLS).
 * Only use for backend administrative tasks that cannot be scoped to a user.
 */
export const getAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  }
  return createSupabaseClient(supabaseUrl, serviceRoleKey);
};

// Deprecated alias for backward compatibility during migration
export const getServiceSupabase = getAdminClient;

