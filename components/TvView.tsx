
import React from 'react';
import { useQueue } from '../hooks/useQueue';

const TvView: React.FC = () => {
  const { queueState } = useQueue();

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white p-8">
       <div className="w-full max-w-5xl text-center">
         <p className="text-5xl md:text-7xl font-light text-gray-300 mb-6">SENHA ATUAL</p>
         <div className="bg-gray-900 border-4 border-gray-700 rounded-3xl py-12 md:py-20 px-8">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-wider text-green-400">
                {queueState.currentTicket || '----'}
            </h1>
         </div>
       </div>
    </div>
  );
};

export default TvView;
