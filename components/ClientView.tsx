
import React, { useState, useEffect } from 'react';
import { useQueue } from '../hooks/useQueue';

const ClientView: React.FC = () => {
  const { queueState, generateTicket, markCurrentAsAttended } = useQueue();
  const [myTicket, setMyTicket] = useState<string | null>(() => sessionStorage.getItem('fluxoagil-my-ticket'));

  const handleGetTicket = () => {
    const newTicket = generateTicket();
    sessionStorage.setItem('fluxoagil-my-ticket', newTicket);
    setMyTicket(newTicket);
  };

  const handleDismissTurn = () => {
    // Mark the current ticket as attended in the global state
    if (myTicket && queueState.currentTicket === myTicket) {
      markCurrentAsAttended();
    }
    // Clear the ticket from the local session
    sessionStorage.removeItem('fluxoagil-my-ticket');
    setMyTicket(null);
  };

  const isMyTurn = myTicket && queueState.currentTicket === myTicket;

  if (isMyTurn) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-green-500 text-white rounded-2xl shadow-2xl animate-pulse-fast">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">SUA VEZ!</h1>
        <p className="text-3xl md:text-5xl font-semibold bg-white text-green-600 px-6 py-3 rounded-lg">{myTicket}</p>
        <p className="mt-4 text-lg">Por favor, dirija-se ao atendimento.</p>
        <button 
          onClick={handleDismissTurn}
          className="mt-8 bg-white text-green-600 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-50 transition-colors"
        >
          OK, Fui Atendido!
        </button>
      </div>
    );
  }

  if (!myTicket) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-2">Bem-vindo(a) ao FLUXOÁGIL</h1>
        <p className="text-lg text-gray-500 mb-8">Consulte o status da fila e retire sua senha de atendimento.</p>

        <div className="bg-gray-100 rounded-xl p-6 w-full max-w-sm mb-8 shadow-inner">
          <div className="grid grid-cols-2 gap-4 divide-x divide-gray-200">
            <div className="text-center px-2">
              <p className="text-base text-gray-500">Senha Atual</p>
              <p className="text-4xl font-bold text-gray-800 truncate">{queueState.currentTicket || '---'}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-base text-gray-500">Pessoas na Fila</p>
              <p className="text-4xl font-bold text-gray-800">{queueState.queue.length}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleGetTicket}
          className="bg-blue-600 text-white font-bold text-2xl px-12 py-6 rounded-xl shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          PEGAR SENHA
        </button>
      </div>
    );
  }

  const peopleInFront = queueState.queue.indexOf(myTicket);
  const estimatedTime = (peopleInFront + 1) * 5;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <p className="text-xl text-gray-500">Sua Senha</p>
        <h2 className="text-6xl sm:text-8xl font-bold text-blue-600 tracking-tight">{myTicket}</h2>
      </div>
      
      <div className="border-t border-b border-gray-200 py-6 my-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-lg text-gray-500">Senha Atual</p>
          <p className="text-4xl sm:text-5xl font-bold text-gray-800">{queueState.currentTicket || '---'}</p>
        </div>
        <div>
          <p className="text-lg text-gray-500">Tempo Estimado</p>
          <p className="text-4xl sm:text-5xl font-bold text-gray-800">
            {peopleInFront >= 0 ? `~${estimatedTime} min` : 'Atendido'}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Próximos na Fila</h3>
        {queueState.queue.length > 0 ? (
          <ul className="space-y-2">
            {queueState.queue.slice(0, 5).map(ticket => (
              <li 
                key={ticket} 
                className={`py-2 px-4 rounded-lg text-lg font-medium ${ticket === myTicket ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-600'}`}
              >
                {ticket}
              </li>
            ))}
            {queueState.queue.length > 5 && <li className="text-gray-500 pt-2">... e mais {queueState.queue.length - 5}</li>}
          </ul>
        ) : (
          <p className="text-gray-500">
            {peopleInFront >= 0 ? 'Você é o próximo a ser chamado!' : 'A fila está vazia.'}
          </p>
        )}
      </div>

    </div>
  );
};

export default ClientView;