
import React from 'react';

interface QrCodeModalProps {
  companyId: string;
  displayName: string;
  onClose: () => void;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({ companyId, displayName, onClose }) => {
  // Constrói a URL para a qual o QR code apontará.
  // Leva para o domínio de produção com o ID da empresa na URL.
  const joinUrl = `https://fluxoagil.vercel.app/${companyId}`;
  
  // Usa uma API pública para gerar a imagem do QR code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(joinUrl)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinUrl).then(() => {
      alert('Link copiado para a área de transferência!');
    }, (err) => {
      console.error('Falha ao copiar o link: ', err);
      alert('Falha ao copiar o link.');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md text-center p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-light"
          aria-label="Fechar modal"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold text-gray-100 mb-2">QR Code da Fila</h2>
        <p className="text-gray-400 mb-6">Mostre este código para seus clientes entrarem na fila de <span className="font-semibold text-sky-400">{displayName}</span>.</p>
        
        <div className="bg-white p-4 rounded-lg inline-block">
          <img src={qrCodeUrl} alt={`QR Code para ${companyId}`} width="250" height="250" />
        </div>
        
        <p className="text-gray-500 text-sm mt-4">
          ID da Empresa: <strong className="text-gray-300">{companyId}</strong>
        </p>

        <div className="mt-6">
            <label htmlFor="join-url" className="sr-only">Link de Acesso</label>
            <div className="relative">
                <input
                    id="join-url"
                    type="text"
                    readOnly
                    value={joinUrl}
                    className="w-full bg-gray-700 text-gray-300 border border-gray-600 rounded-lg pl-3 pr-12 py-2 text-sm"
                />
                <button 
                    onClick={copyToClipboard} 
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-sky-400"
                    title="Copiar link"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default QrCodeModal;
