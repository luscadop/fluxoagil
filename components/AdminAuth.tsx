import React, { useState } from 'react';
import AdminView from './AdminView';

const ADMIN_AUTH_KEY = 'fluxoagil-admin-auth';
const CORRECT_PASSWORD = 'admin';

const AdminAuth: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch (error) {
      return false;
    }
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <AdminView onLogout={handleLogout} />;
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">Acesso Restrito</h1>
        <p className="text-gray-500 mb-6">Por favor, insira a senha de administrador para continuar.</p>
        <form onSubmit={handleLogin} noValidate>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
