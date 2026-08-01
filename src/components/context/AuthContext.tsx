import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase, Profile } from '@/lib/supabase';

interface AuthContextValue {
  user: ReturnType<typeof useUser>['user'];
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      (async () => {
        // Ensure profile row exists
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (!existing) {
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            full_name: user.fullName || (user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Reader'),
            role: 'customer',
            avatar_url: user.imageUrl,
          });
        }
        await fetchProfile(user.id);
      })();
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, [user, isLoaded, fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
