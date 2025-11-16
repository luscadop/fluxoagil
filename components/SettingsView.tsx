import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SettingsView: React.FC = () => {
  const navigate = useNavigate();
  const [hasTicket, setHasTicket] = useState(false);

  useEffect(() => {
    // Verifica se há uma senha na sessão quando o componente é montado.
    const ticket = sessionStorage.getItem('fluxoagil-my-ticket');
    setHasTicket(!!ticket);
  }, []);

  const leaveQueue = () => {
    sessionStorage.removeItem('fluxoagil-my-ticket');
    alert('Você saiu da fila. Agora você pode pegar uma nova senha.');
    setHasTicket(false);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-100 text-center sm:text-left">Ajustes e Acessos</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-3 text-gray-200">Gerenciamento de Fila</h2>
          <p className="text-gray-400 mb-4 text-sm">Se você pegou uma senha por engano ou deseja desistir, use o botão abaixo para sair da fila atual. Isso permitirá que você pegue uma nova senha.</p>
          <button 
            onClick={leaveQueue} 
            disabled={!hasTicket}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {hasTicket ? 'Sair da Fila Atual' : 'Você não está em uma fila'}
          </button>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-3 text-gray-200">Acessos Especiais</h2>
          <p className="text-gray-400 mb-4 text-sm">Acesse o painel de gerenciamento. O modo TV deve ser acessado por uma URL específica contendo o ID da empresa (ex: /#/tv/sua-empresa).</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link to="/admin" className="text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Painel do Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
