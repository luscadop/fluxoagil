import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SettingsView: React.FC = () => {
  const navigate = useNavigate();

  const forgetTicket = () => {
    sessionStorage.removeItem('fluxoagil-my-ticket');
    alert('Sua senha foi esquecida. Você pode pegar uma nova na tela inicial.');
    navigate('/');
    window.location.reload(); // To force ClientView to re-check sessionStorage
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">Ajustes e Acessos</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Opções do Cliente</h2>
          <p className="text-gray-500 mb-4 text-sm">Se você pegou uma senha por engano ou desistiu do atendimento, pode liberá-la aqui.</p>
          <button 
            onClick={forgetTicket} 
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Esquecer Minha Senha
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Visualizações Especiais</h2>
          <p className="text-gray-500 mb-4 text-sm">Acesse as telas de gerenciamento e de exibição pública.</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link to="/admin" className="text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Painel do Admin
            </Link>
            <Link to="/tv" className="text-center bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Modo TV
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
