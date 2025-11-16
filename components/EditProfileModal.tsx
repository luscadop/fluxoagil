
import React, { useState } from 'react';
import { CompanyProfile } from '../types';

interface EditProfileModalProps {
  companyId: string;
  initialProfile: CompanyProfile;
  onSave: (profile: CompanyProfile) => void;
  onPasswordChange: (password: string) => void;
  onCompanyIdChange: (newId: string) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ companyId, initialProfile, onSave, onPasswordChange, onCompanyIdChange, onClose }) => {
  const [displayName, setDisplayName] = useState(initialProfile.displayName);
  const [address, setAddress] = useState(initialProfile.address || '');
  const [phone, setPhone] = useState(initialProfile.phone || '');
  const [website, setWebsite] = useState(initialProfile.socials?.website || '');
  const [instagram, setInstagram] = useState(initialProfile.socials?.instagram || '');
  const [facebook, setFacebook] = useState(initialProfile.socials?.facebook || '');

  const [logoPreview, setLogoPreview] = useState(initialProfile.logoBase64);
  const [logoFile, setLogoFile] = useState<string | undefined>(initialProfile.logoBase64);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  const [newCompanyId, setNewCompanyId] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setLogoFile(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: CompanyProfile = {
      displayName,
      logoBase64: logoFile,
      address,
      phone,
      socials: {
        website,
        instagram,
        facebook
      }
    };
    onSave(updatedProfile);
  };

  const handlePasswordUpdate = () => {
    setPasswordMessage({ text: '', type: '' });

    if (!newPassword) {
      setPasswordMessage({ text: 'Por favor, preencha a nova senha.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'As senhas não coincidem.', type: 'error' });
      return;
    }
    if (newPassword.length < 4) {
      setPasswordMessage({ text: 'A senha deve ter no mínimo 4 caracteres.', type: 'error' });
      return;
    }
    
    onPasswordChange(newPassword);
    setPasswordMessage({ text: 'Senha alterada com sucesso!', type: 'success' });
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleIdUpdate = () => {
    if (newCompanyId.trim()) {
      onCompanyIdChange(newCompanyId);
    } else {
      alert('O novo ID não pode estar vazio.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleProfileSave}>
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-100">Editar Perfil da Empresa</h2>
                <p className="text-gray-400">Personalize as informações de <span className="font-semibold text-sky-400">{companyId}</span>.</p>
              </div>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>

            <div className="space-y-6">
              {/* Profile Picture & Display Name */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src={logoPreview || `https://ui-avatars.com/api/?name=${displayName.charAt(0)}&background=0ea5e9&color=fff&size=128`} alt="Logo" className="h-24 w-24 rounded-full object-cover bg-gray-700" />
                  <label htmlFor="logo-upload" className="absolute bottom-0 right-0 bg-gray-600 rounded-full p-2 cursor-pointer hover:bg-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                    <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                <div className="flex-grow">
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">Nome de Exibição</label>
                  <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-3">Informações de Contato</h3>
                <div className="space-y-4">
                   <input type="text" placeholder="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                   <input type="tel" placeholder="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
              </div>

              {/* Socials */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-3">Redes Sociais</h3>
                <div className="space-y-4">
                   <input type="url" placeholder="Website (https://...)" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                   <input type="text" placeholder="Instagram (somente usuário)" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                   <input type="text" placeholder="Facebook (somente usuário)" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
              </div>
              
              {/* Change Password */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-3">Alterar Senha</h3>
                <p className="text-gray-400 text-sm mb-4">Para alterar, preencha os dois campos abaixo e clique no botão "Alterar Senha". A senha não é salva com as outras informações de perfil.</p>
                <div className="space-y-4">
                   <input type="password" placeholder="Nova Senha (deixe em branco para não alterar)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                   <input type="password" placeholder="Confirmar Nova Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                   {passwordMessage.text && (
                      <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-500'}`}>{passwordMessage.text}</p>
                   )}
                   <button 
                     type="button"
                     onClick={handlePasswordUpdate}
                     className="w-full sm:w-auto bg-amber-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-amber-700 transition-colors"
                   >
                     Alterar Senha
                   </button>
                </div>
              </div>

              {/* Danger Zone - Change Company ID */}
              <div className="pt-4 mt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-red-500 border-b border-red-900 pb-2 mb-3">Zona de Perigo</h3>
                <p className="text-gray-400 text-sm mb-4">Alterar o ID da empresa é uma ação permanente e migrará todos os dados da fila. O novo ID deve ser único, sem espaços ou caracteres especiais. Use com cuidado.</p>
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                   <input 
                     type="text" 
                     placeholder="Novo ID da Empresa" 
                     value={newCompanyId} 
                     onChange={(e) => setNewCompanyId(e.target.value)} 
                     className="flex-grow px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                     pattern="[a-z0-9-]+"
                   />
                   <button 
                     type="button"
                     onClick={handleIdUpdate}
                     disabled={!newCompanyId.trim()}
                     className="bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                   >
                     Alterar ID
                   </button>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-gray-900/50 p-4 flex justify-end space-x-3 sticky bottom-0">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">Salvar Alterações de Perfil</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
