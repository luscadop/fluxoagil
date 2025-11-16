import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SettingsView: React.FC = () => {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('fluxoagil-company-id');
    setCompanyId(id);
  }, []);

  const changeCompany = () => {
    if (window.confirm('Isso irá desconectá-lo(a) da empresa atual e remover sua senha da sessão. Deseja continuar?')) {
        sessionStorage.removeItem('fluxoagil-my-ticket');
        localStorage.removeItem('fluxoagil-company-id');
        setCompanyId(null);
        alert('Você foi desconectado(a). Agora pode escanear um novo QR Code ou inserir um novo código de empresa.');
        navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-100 text-center sm:text-left">Ajustes e Acessos</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-3 text-gray-200">Opções do Cliente</h2>
          <p className="text-gray-400 mb-4">
            Se você desistiu do atendimento ou quer trocar de fila, use o botão abaixo. Sua senha atual será removida.
          </p>
          <button 
            onClick={changeCompany} 
            disabled={!companyId}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Sair da Fila / Mudar Empresa
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