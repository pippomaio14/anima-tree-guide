import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// ✅ LOG PER DEBUG
const bootLog = (message: string) => {
  try {
    const logEl = document.getElementById('boot-log');
    if (logEl) {
      logEl.innerHTML += `\n✅ [LoginPage] ${message}`;
      logEl.scrollTop = logEl.scrollHeight;
    }
    console.log(`[LoginPage] ${message}`);
  } catch (e) {}
};

const LoginPage = () => {
  bootLog('Componente montato');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  bootLog(`user: ${user ? 'presente' : 'null'}`);

  useEffect(() => {
    bootLog('useEffect eseguito');
    if (user) {
      bootLog('Utente loggato, reindirizzo a /');
      navigate('/');
    }
  }, [user, navigate]);

  bootLog('Render JSX');

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      padding: '20px',
      backgroundColor: '#f0fdf4',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#166534', marginBottom: '10px' }}>🌳 Anima Tree Guide</h1>
      <p style={{ color: '#4a5568', marginBottom: '20px' }}>Pagina di login (versione semplice)</p>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '20px' }}>
          {user ? 'Sei già loggato!' : 'Inserisci le tue credenziali'}
        </p>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
            Email
          </label>
          <input 
            type="email" 
            placeholder="nome@email.com"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
            Password
          </label>
          <input 
            type="password" 
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <button 
          onClick={() => {
            bootLog('Tentativo login');
            navigate('/');
          }}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#166534',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Accedi (test)
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#6b7280' }}>
          <button 
            onClick={() => {
              bootLog('Navigazione a register');
              navigate('/register');
            }}
            style={{ color: '#166534', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Registrati
          </button>
        </p>
      </div>
    </div>
  );
};

bootLog('LoginPage esportato');

export default LoginPage;
