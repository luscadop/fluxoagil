import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JoinView: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (companyId) {
      // Limpa qualquer senha de sessão existente ao entrar em uma nova fila via URL
      sessionStorage.removeItem('fluxoagil-my-ticket');
      // Define o novo ID da empresa
      localStorage.setItem('fluxoagil-company-id', companyId);
      // Redireciona para a visão principal do cliente
      navigate('/');
    } else {
        // Se nenhum ID de empresa for fornecido, vai para a página inicial
        navigate('/');
    }
  }, [companyId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-4">Conectando à Fila...</h1>
      <p className="text-lg text-gray-400">Você será redirecionado em breve.</p>
      <div className="mt-8">
        <svg className="animate-spin h-10 w-10 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
  );
};

export default JoinView;
