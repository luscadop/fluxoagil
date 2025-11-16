import React, { useState, useEffect } from 'react';
import AdminView from './AdminView';

const ADMIN_AUTH_KEY = 'fluxoagil-admin-auth';
const ADMIN_COMPANY_ID_KEY = 'fluxoagil-admin-company-id';
const COMPANY_PASSWORDS_KEY = 'fluxoagil-company-passwords';

// Function to get passwords from localStorage
const getCompanyPasswords = (): { [key: string]: string } => {
  try {
    const passwords = localStorage.getItem(COMPANY_PASSWORDS_KEY);
    if (passwords) {
      return JSON.parse(passwords);
    }
  } catch (e) {
    console.error("Failed to parse company passwords", e);
  }
  // Default passwords if none are set
  const defaultPasswords = {
    'admin': 'admin',
    'fluxo': 'fluxo'
  };
  localStorage.setItem(COMPANY_PASSWORDS_KEY, JSON.stringify(defaultPasswords));
  return defaultPasswords;
};


const AdminAuth: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize passwords on component mount to ensure defaults are set
    getCompanyPasswords();
    
    try {
      const auth = sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
      const storedCompanyId = sessionStorage.getItem(ADMIN_COMPANY_ID_KEY);
      if (auth && storedCompanyId) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const passwords = getCompanyPasswords();
    const trimmedCompanyId = companyId.trim();
    const correctPassword = passwords[trimmedCompanyId];

    if (correctPassword && password === correctPassword) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      sessionStorage.setItem(ADMIN_COMPANY_ID_KEY, trimmedCompanyId);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('ID da Empresa ou senha incorretos. Tente novamente.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_COMPANY_ID_KEY);
    setIsAuthenticated(false);
    setCompanyId('');
    setPassword('');
  };

  if (isAuthenticated) {
    return <AdminView onLogout={handleLogout} />;
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg shadow-sky-500/10 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-200">Acesso Restrito do Administrador</h1>
        <p className="text-gray-400 mb-6">Insira o ID da sua empresa e sua senha.</p>
        <form onSubmit={handleLogin} noValidate className="space-y-4">
          <div>
            <input
              type="text"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              placeholder="ID da Empresa (ex: fluxo)"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoFocus
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
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