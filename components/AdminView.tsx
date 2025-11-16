
import React, { useState } from 'react';
import { useQueue } from '../hooks/useQueue';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import EditProfileModal from './EditProfileModal';
import QrCodeModal from './QrCodeModal';
import { CompanyProfile } from '../types';

interface AdminViewProps {
  onLogout: () => void;
}

const ADMIN_COMPANY_ID_KEY = 'fluxoagil-admin-company-id';
const COMPANY_PASSWORDS_KEY = 'fluxoagil-company-passwords';
const PROFILES_KEY = 'fluxoagil-company-profiles';

const AdminView: React.FC<AdminViewProps> = ({ onLogout }) => {
  const [companyId, setCompanyId] = useState<string | null>(() => sessionStorage.getItem(ADMIN_COMPANY_ID_KEY));
  const { queueState, callNextTicket, resetQueue, finishCurrentTicket } = useQueue(companyId);
  const { profile, updateProfile } = useCompanyProfile(companyId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleSaveProfile = (updatedProfile: CompanyProfile) => {
    updateProfile(updatedProfile);
    setIsEditModalOpen(false);
  };

  const handlePasswordChange = (newPassword: string) => {
    if (newPassword && companyId) {
      try {
        const passwordsStr = localStorage.getItem(COMPANY_PASSWORDS_KEY);
        const passwords = passwordsStr ? JSON.parse(passwordsStr) : {};
        passwords[companyId] = newPassword;
        localStorage.setItem(COMPANY_PASSWORDS_KEY, JSON.stringify(passwords));
        alert('Senha alterada com sucesso!');
      } catch (error) {
        console.error("Failed to update password", error);
        alert('Falha ao alterar a senha.');
      }
    }
  };

  const handleCompanyIdChange = (newId: string) => {
    const trimmedNewId = newId.trim().toLowerCase();
    
    if (!companyId || !window.confirm(`Tem certeza que deseja alterar o ID de "${companyId}" para "${trimmedNewId}"? Esta ação é irreversível e irá migrar todos os dados.`)) {
      return;
    }
    
    if (!trimmedNewId || trimmedNewId === companyId) {
      alert("Novo ID inválido.");
      return;
    }
    
    // Check for conflicts
    const passwords = JSON.parse(localStorage.getItem(COMPANY_PASSWORDS_KEY) || '{}');
    if (passwords[trimmedNewId]) {
      alert(`O ID "${trimmedNewId}" já existe. Por favor, escolha outro.`);
      return;
    }
    
    // 1. Migrate Queue
    const oldQueueKey = `fluxoagil-queue-${companyId}`;
    const newQueueKey = `fluxoagil-queue-${trimmedNewId}`;
    const queueStateData = localStorage.getItem(oldQueueKey);
    if (queueStateData) {
      localStorage.setItem(newQueueKey, queueStateData);
      localStorage.removeItem(oldQueueKey);
    }
    
    // 2. Migrate Profile
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}');
    if (profiles[companyId]) {
      profiles[trimmedNewId] = profiles[companyId];
      delete profiles[companyId];
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    }
    
    // 3. Migrate Password
    if (passwords[companyId]) {
      passwords[trimmedNewId] = passwords[companyId];
      delete passwords[companyId];
      localStorage.setItem(COMPANY_PASSWORDS_KEY, JSON.stringify(passwords));
    }
    
    // 4. Update session
    sessionStorage.setItem(ADMIN_COMPANY_ID_KEY, trimmedNewId);
    
    // 5. Update state
    setCompanyId(trimmedNewId);
    
    alert(`ID da empresa alterado para "${trimmedNewId}" com sucesso!`);
    setIsEditModalOpen(false); // Close modal after change
  };
  
  return (
    <div>
      {isEditModalOpen && profile && companyId && (
        <EditProfileModal
          companyId={companyId}
          initialProfile={profile}
          onSave={handleSaveProfile}
          onPasswordChange={handlePasswordChange}
          onCompanyIdChange={handleCompanyIdChange}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isQrModalOpen && companyId && (
        <QrCodeModal
          companyId={companyId}
          displayName={profile?.displayName || companyId}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}

      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            {profile?.logoBase64 && (
            <img 
                src={profile.logoBase64} 
                alt="Logo" 
                className="h-12 w-12 rounded-full object-cover bg-gray-700"
            />
            )}
            <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-200">Painel de Controle</h1>
            <p className="text-md text-gray-400">
                Gerenciando fila para: <span className="font-semibold text-sky-400">{profile?.displayName || companyId}</span>
            </p>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button 
            onClick={() => setIsQrModalOpen(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            aria-label="Exibir QR Code da Fila"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 17h2v2h-2zM19 19h2v2h-2zM15 19h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z" /></svg>
            <span>QR Code da Fila</span>
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors"
            aria-label="Editar perfil da empresa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
            </svg>
            <span>Editar Perfil</span>
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1 flex flex-col space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
            <p className="text-lg text-gray-400">Atendendo Agora</p>
            <h2 className="text-6xl font-bold text-sky-400 my-2">{queueState.currentTicket || 'N/A'}</h2>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={callNextTicket}
              disabled={queueState.queue.length === 0}
              className="w-full bg-blue-600 text-white font-bold text-xl py-4 rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              CHAMAR PRÓXIMO
            </button>
            <button
              onClick={finishCurrentTicket}
              disabled={!queueState.currentTicket}
              className="w-full bg-green-600 text-white font-bold text-lg py-3 rounded-xl shadow-md hover:bg-green-700 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              FINALIZAR ATENDIMENTO
            </button>
          </div>
          
          <div className="pt-4 space-y-4 border-t border-gray-700">
            <button
              onClick={() => { if(window.confirm('Tem certeza que deseja zerar a fila? Esta ação não pode ser desfeita.')) resetQueue() }}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-red-700 transition-all duration-300"
            >
              ZERAR FILA
            </button>
            <button
              onClick={onLogout}
              className="w-full bg-gray-600 text-gray-100 font-semibold py-2 rounded-xl hover:bg-gray-500 transition-all duration-300"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Card de Próximos na Fila */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">
              Próximos na Fila ({queueState.queue.length})
            </h3>
            {queueState.queue.length > 0 ? (
              <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {queueState.queue.map((ticket, index) => (
                  <li key={ticket} className={`flex items-center justify-between p-4 rounded-lg ${index === 0 ? 'bg-sky-900/50 border-l-4 border-sky-500' : 'bg-gray-700'}`}>
                    <span className="text-xl font-semibold text-gray-100">{ticket}</span>
                    {index === 0 && <span className="text-sm font-bold text-sky-400">PRÓXIMO</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-400 py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-lg font-medium">A fila está vazia.</p>
                <p className="text-sm">Aguardando novos clientes.</p>
              </div>
            )}
          </div>

          {/* Card de Histórico */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">
              Histórico de Atendimento ({queueState.history.length})
            </h3>
            {queueState.history && queueState.history.length > 0 ? (
              <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {queueState.history.map((ticket, index) => (
                  <li key={`${ticket}-${index}`} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-lg font-medium text-gray-300">{ticket}</span>
                    <span className="text-sm text-gray-500">Atendido</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-400 py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <p className="text-lg font-medium">Nenhum atendimento no histórico.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminView;
