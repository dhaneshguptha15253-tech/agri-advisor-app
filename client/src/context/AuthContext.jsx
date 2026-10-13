import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'farmer.demo@agriadvisor.ai',
  user_metadata: {
    full_name: 'David Greenfield',
    region: 'Central Plains Agricultural District',
    default_units: 'acres',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for stored demo session
    const storedDemo = localStorage.getItem('agri_demo_session');
    if (storedDemo) {
      setUser(JSON.parse(storedDemo));
      setLoading(false);
      return;
    }

    // 2. Check Supabase session if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      return data;
    } else {
      // Fallback demo account login
      const demoUser = {
        ...DEMO_USER,
        email,
        user_metadata: {
          ...DEMO_USER.user_metadata,
          full_name: email.split('@')[0].replace('.', ' '),
        }
      };
      localStorage.setItem('agri_demo_session', JSON.stringify(demoUser));
      setUser(demoUser);
      return { user: demoUser };
    }
  };

  const register = async (email, password, metadata = {}) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name || 'Farmer Member',
            region: metadata.region || 'Midwest Agricultural District',
            default_units: metadata.default_units || 'acres',
            phone_number: metadata.phone_number || '',
          },
        },
      });
      if (error) throw error;
      setUser(data.user);
      return data;
    } else {
      const newUser = {
        id: `usr-${Date.now()}`,
        email,
        user_metadata: {
          full_name: metadata.full_name || 'Farmer Member',
          region: metadata.region || 'Midwest Agricultural District',
          default_units: metadata.default_units || 'acres',
          phone_number: metadata.phone_number || '',
        }
      };
      localStorage.setItem('agri_demo_session', JSON.stringify(newUser));
      setUser(newUser);
      return { user: newUser };
    }
  };

  const loginDemo = () => {
    localStorage.setItem('agri_demo_session', JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
  };

  const logout = async () => {
    localStorage.removeItem('agri_demo_session');
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  const getToken = () => {
    if (session?.access_token) return session.access_token;
    if (user) return 'demo-token';
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        loginDemo,
        logout,
        getToken,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
