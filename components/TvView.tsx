import React from 'react';
import { useParams } from 'react-router-dom';
import { useQueue } from '../hooks/useQueue';
import { useCompanyProfile } from '../hooks/useCompanyProfile';

const TvView: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { queueState } = useQueue(companyId || null);
  const { profile } = useCompanyProfile(companyId || null);

  if(!companyId) {
    return (
       <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white p-8">
         <div className="w-full max-w-5xl text-center">
            <h1 className="text-5xl md:text-7xl font-light text-gray-300 mb-6">Modo TV</h1>
            <p className="text-xl md:text-2xl text-gray-400">
                É necessário especificar o ID da empresa na URL.
            </p>
            <p className="text-lg text-gray-500 mt-2">Exemplo: /#/tv/nome-da-empresa</p>
         </div>
       </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white p-8">
       <div className="w-full max-w-5xl text-center">
         <p className="text-2xl md:text-4xl font-light text-gray-400 mb-2">Fila de Atendimento</p>
         <p className="text-3xl md:text-5xl font-semibold text-gray-200 mb-8">{profile?.displayName || companyId}</p>
         <p className="text-5xl md:text-7xl font-light text-gray-300 mb-6">SENHA ATUAL</p>
         <div className="bg-gray-900 border-4 border-gray-700 rounded-3xl py-12 md:py-20 px-8">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-wider text-green-400 animate-pulse">
                {queueState.currentTicket || '----'}
            </h1>
         </div>
       </div>
    </div>
  );
};

export default TvView;
