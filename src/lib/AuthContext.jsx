import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { getSubscriptionStatus } from './subscription';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const [isSubscribed, setIsSubscribed] = useState(false);
  useEffect(() => {
    checkAuthState();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoadingAuth(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        // refresh subscription flag
        try { const sub = await getSubscriptionStatus(session.user.id); setIsSubscribed(!!sub); } catch(e){ setIsSubscribed(false); }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsSubscribed(false);
      }
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('Auth state check failed:', error);
      setAuthError({
        type: 'auth_error',
        message: error.message || 'Failed to check authentication'
      });
      setIsLoadingAuth(false);
    }
  };

  const signUp = async (email, password) => {
    try {
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // If Supabase returned a user (some configs auto-login), set state
      if (data?.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // If no user returned, likely requires email confirmation — surface a helpful message
        setAuthError({ type: 'signup_pending', message: 'Confirme seu e-mail: verifique a caixa de entrada para finalizar o cadastro.' });
      }
      // Ensure a profiles row exists for the new user so per-user data (is_subscribed, etc.) can be stored
      try {
        const userId = data?.user?.id;
        if (userId) {
          await supabase.from('profiles').upsert({ id: userId, email }, { returning: 'minimal' });
        }
      } catch (e) {
        console.warn('Failed to create profile row after signUp', e);
      }
      return { data };
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data?.user || null);
      setIsAuthenticated(!!data?.user);
      if (data?.user) {
        try { const sub = await getSubscriptionStatus(data.user.id); setIsSubscribed(!!sub); } catch(e){ setIsSubscribed(false); }
      }
      return { data };
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signInWithMagicLink = async (email) => {
    try {
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      return { data };
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const getUserProfile = async (userId) => {
    try {
      const id = userId || user?.id;
      if (!id) return null;
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAuthenticated(false);
      setIsSubscribed(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setAuthError({
        type: 'logout_error',
        message: error.message || 'Failed to logout'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isSubscribed,
      authError,
      logout,
      checkAuthState,
      // helper to refresh subscription state on demand
      refreshSubscription: async (userId) => {
        try {
          const id = userId || user?.id;
          if (!id) return false;
          const sub = await getSubscriptionStatus(id);
          setIsSubscribed(!!sub);
          return !!sub;
        } catch (e) { return false; }
      },
      signUp,
      signIn,
      signInWithMagicLink,
      getUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
