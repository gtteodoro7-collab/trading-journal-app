import { supabase } from '@/api/supabaseClient';

/**
 * Returns boolean whether the given user has an active subscription flag.
 * Reads from `profiles.is_subscribed` (boolean).
 */
export const getSubscriptionStatus = async (userId) => {
  if (!userId) return false;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_subscribed')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('getSubscriptionStatus error', error);
      return false;
    }
    return !!data?.is_subscribed;
  } catch (e) {
    console.error('getSubscriptionStatus exception', e);
    return false;
  }
};

/**
 * Set subscription flag on a profile. NOTE: this should be executed server-side
 * with the Supabase service role key to avoid allowing clients to escalate.
 */
export const setSubscriptionStatus = async (userId, status = true) => {
  if (!userId) throw new Error('userId required');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_subscribed: !!status })
      .eq('id', userId)
      .select()
      .single();
    if (error) {
      console.error('setSubscriptionStatus error', error);
      throw error;
    }
    return data;
  } catch (e) {
    console.error('setSubscriptionStatus exception', e);
    throw e;
  }
};

export default {
  getSubscriptionStatus,
  setSubscriptionStatus,
};
