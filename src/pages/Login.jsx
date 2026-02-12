import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // 🔥 Se já estiver logado, manda para home
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success('Cadastro realizado! Verifique seu e-mail se for o caso.');
      } else {
        await signIn(email, password);
        toast.success('Bem-vindo!');
        navigate("/"); // 🔥 Redireciona após login
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '12px', border: '1px solid #1e293b', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#10b981', textAlign: 'center', fontSize: '24px', marginBottom: '10px' }}>
          {isSignUp ? 'Criar Conta' : 'Trading Journal'}
        </h1>
        <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '14px', marginBottom: '30px' }}>
          {isSignUp ? 'Comece a trackear seus trades' : 'Acesse sua conta'}
        </p>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>E-mail</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: 'white', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Senha</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: 'white', boxSizing: 'border-box' }}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', borderRadius: '6px', backgroundColor: '#059669', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Carregando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '14px' }}
          >
            {isSignUp ? 'Já tem conta? Entre aqui' : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
}