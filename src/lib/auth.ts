import { supabase } from './supabase';
import type { Profile } from '../types/database';

export async function getUserSession(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=');
      return [key, val.join('=')];
    }).filter(([key]) => key)
  );
  
  const accessToken = cookies['sb-access-token'];
  if (!accessToken) return null;

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>();

  return { user, profile };
}

export async function requireAuth(request: Request, requiredRole?: string) {
  const session = await getUserSession(request);
  if (!session) throw new Error('UNAUTHORIZED');
  if (requiredRole && session.profile.role !== requiredRole) {
    throw new Error('FORBIDDEN');
  }
  return session;
}