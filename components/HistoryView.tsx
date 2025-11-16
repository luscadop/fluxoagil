import React from 'react';
import { useQueue } from '../hooks/useQueue';

const HistoryView: React.FC = () => {
  const { queueState } = useQueue();
  const { history } = queueState;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">Histórico de Atendimento</h1>
      {history && history.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {history.map((ticket, index) => (
              <li 
                key={`${ticket}-${index}`} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg text-gray-700 text-lg font-medium"
              >
                <span>Senha: <span className="font-bold text-gray-800">{ticket}</span></span>
                <span className="text-sm text-gray-400">Atendida</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center bg-white rounded-2xl shadow-xl p-10 mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-500">O histórico está vazio.</p>
          <p className="text-sm text-gray-400">Nenhuma senha foi atendida ainda hoje.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
