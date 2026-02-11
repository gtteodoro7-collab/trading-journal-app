import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';

const SubcriptionsAdmin = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('id,email,is_subscribed');
    if (!error) setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProfiles(); }, []);

  const toggle = async (id, current) => {
    // This action requires service role key in production; here we allow for dev using anon key
    setLoading(true);
    const { data, error } = await supabase.from('profiles').update({ is_subscribed: !current }).eq('id', id).select().single();
    if (!error) fetchProfiles();
    setLoading(false);
  };

  if (!user) return <div>Autentique-se para ver o painel.</div>;

  return (
    <div>
      <h2>Admin — Subscriptions</h2>
      <p>Lista de perfis e flag `is_subscribed`. Use com cuidado em produção.</p>
      {loading && <div>carregando...</div>}
      <table>
        <thead><tr><th>id</th><th>email</th><th>is_subscribed</th><th>actions</th></tr></thead>
        <tbody>
          {profiles.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.email}</td>
              <td>{String(p.is_subscribed)}</td>
              <td><button onClick={() => toggle(p.id, p.is_subscribed)}>Toggle</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubcriptionsAdmin;
