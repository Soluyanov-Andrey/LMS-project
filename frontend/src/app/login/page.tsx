'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://192.168.1.115:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      alert('Успешный вход!');
    } else {
      alert('Ошибка: ' + data.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Вход</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>

      {token && (
        <div style={{ marginTop: '20px', wordBreak: 'break-all' }}>
          <strong>Твой JWT:</strong> <p>{token}</p>
        </div>
      )}
    </div>
  );
}