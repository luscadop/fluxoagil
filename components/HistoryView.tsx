import React, { useState, useEffect } from 'react';
import { useQueue } from '../hooks/useQueue';

const CLIENT_COMPANY_ID_KEY = 'fluxoagil-company-id';
const ADMIN_COMPANY_ID_KEY = 'fluxoagil-admin-company-id';

const HistoryView: React.FC = () => {
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    // Prioriza o ID da empresa do cliente (que é persistente)
    const clientCompanyId = localStorage.getItem(CLIENT_COMPANY_ID_KEY);
    // Usa o ID do admin (da sessão atual) como fallback
    const adminCompanyId = sessionStorage.getItem(ADMIN_COMPANY_ID_KEY);
    setCompanyId(clientCompanyId || adminCompanyId);
  }, []);

  const { queueState } = useQueue(companyId);
  const { history } = queueState;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-100 text-center sm:text-left">Histórico de Atendimento</h1>
      {companyId && <p className="text-center sm:text-left text-gray-400 mb-6">Fila: <span className="font-semibold text-sky-400">{companyId}</span></p>}
      
      {history && history.length > 0 ? (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
          <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {history.map((ticket, index) => (
              <li 
                key={`${ticket}-${index}`} 
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg text-gray-200 text-lg font-medium"
              >
                <span>Senha: <span className="font-bold text-gray-100">{ticket}</span></span>
                <span className="text-sm text-gray-400">Atendida</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center bg-gray-800 rounded-2xl shadow-lg p-10 mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-400">O histórico está vazio.</p>
          {companyId ? (
            <p className="text-sm text-gray-500">Nenhuma senha foi atendida ainda hoje para esta fila.</p>
          ) : (
             <p className="text-sm text-gray-500">Escaneie um QR code para ver o histórico de uma fila.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryView;