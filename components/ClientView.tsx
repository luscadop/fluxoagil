
import React, { useState, useEffect, useRef } from 'react';
import { useQueue } from '../hooks/useQueue';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import type { CompanyProfile } from '../types';


declare const Html5Qrcode: any;

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.error("Could not play notification sound.", e);
  }
};

const QrScanner: React.FC<{ onScanSuccess: (companyId: string) => void; onScanError: (error: string) => void; }> = ({ onScanSuccess, onScanError }) => {
    const scannerRef = useRef<any>(null);

    useEffect(() => {
        const qrCodeScanner = new Html5Qrcode('qr-reader');
        scannerRef.current = qrCodeScanner;

        const startScanner = async () => {
            try {
                await qrCodeScanner.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText: string) => {
                        onScanSuccess(decodedText);
                    },
                    (errorMessage: string) => {
                        // This error is ignored because it fires when no QR is found.
                    }
                );
            } catch (err: any) {
                onScanError(err.message || "Falha ao iniciar a câmera.");
            }
        };
        startScanner();

        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch((err: any) => console.error("Falha ao parar o scanner de QR.", err));
            }
        };
    }, [onScanSuccess, onScanError]);

    return <div id="qr-reader" className="w-full max-w-sm mx-auto border-2 border-dashed border-gray-600 rounded-2xl p-4"></div>;
};

// SVG icons for the new info card
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
  </svg>
);

const GlobeAltIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0 1 12 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M18.716 15.751A9.004 9.004 0 0 1 12 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m6.716 12.751A9.004 9.004 0 0 0 12 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.2,5.2 0 0,1 16.2,21.4H7.8C4.6,21.4 2,18.8 2,16.2V7.8A5.2,5.2 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
    </svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
    </svg>
);

const CompanyProfileCard: React.FC<{ profile: CompanyProfile | null; containerClassName?: string }> = ({ 
  profile, 
  containerClassName = "bg-gray-800 border border-gray-700 rounded-2xl p-5 text-left shadow-lg" 
}) => {
  if (!profile || (!profile.address && !profile.phone && !profile.socials?.website && !profile.socials?.instagram && !profile.socials?.facebook)) {
    return null;
  }

  return (
    <div className={containerClassName}>
      <div className="space-y-4 text-gray-300">
        {profile?.address && (
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-6 w-6 text-sky-400 flex-shrink-0 mt-1" />
            <span>{profile.address}</span>
          </div>
        )}
        {profile?.phone && (
          <div className="flex items-center gap-3">
            <PhoneIcon className="h-5 w-5 text-sky-400 flex-shrink-0" />
            <span>{profile.phone}</span>
          </div>
        )}
        {(profile?.socials?.website || profile?.socials?.instagram || profile?.socials?.facebook) && (
          <div className="flex items-center gap-4 pt-4 border-t border-gray-700 mt-4">
            {profile.socials.website && (
                <a href={profile.socials.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-400 transition-colors" title="Website">
                    <GlobeAltIcon className="h-7 w-7" />
                </a>
            )}
            {profile.socials.instagram && (
                <a href={`https://instagram.com/${profile.socials.instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-400 transition-colors" title="Instagram">
                    <InstagramIcon className="h-7 w-7" />
                </a>
            )}
            {profile.socials.facebook && (
                <a href={`https://facebook.com/${profile.socials.facebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-400 transition-colors" title="Facebook">
                    <FacebookIcon className="h-7 w-7" />
                </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ClientView: React.FC = () => {
  const [companyId, setCompanyId] = useState<string | null>(() => localStorage.getItem('fluxoagil-company-id'));
  const { queueState, generateTicket } = useQueue(companyId);
  const { profile } = useCompanyProfile(companyId);
  const [myTicket, setMyTicket] = useState<string | null>(() => sessionStorage.getItem('fluxoagil-my-ticket'));
  const [manualCompanyIdInput, setManualCompanyIdInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const prevCurrentTicketRef = useRef(queueState.currentTicket);

  useEffect(() => {
    const isMyTurn = myTicket && queueState.currentTicket === myTicket;
    if (isMyTurn && prevCurrentTicketRef.current !== myTicket) {
      playNotificationSound();
    }
    prevCurrentTicketRef.current = queueState.currentTicket;
  }, [queueState.currentTicket, myTicket]);

  useEffect(() => {
    if (myTicket && companyId) {
      const isTicketInQueue = queueState.queue.includes(myTicket);
      const isTicketCurrent = queueState.currentTicket === myTicket;
      if (!isTicketInQueue && !isTicketCurrent) {
        sessionStorage.removeItem('fluxoagil-my-ticket');
        setMyTicket(null);
      }
    }
  }, [queueState.currentTicket, queueState.queue, myTicket, companyId]);

  const handleGetTicket = () => {
    if (!generateTicket) return;
    const newTicket = generateTicket();
    if (newTicket) {
      sessionStorage.setItem('fluxoagil-my-ticket', newTicket);
      setMyTicket(newTicket);
    }
  };

  const handleDismissTurn = () => {
    sessionStorage.removeItem('fluxoagil-my-ticket');
    setMyTicket(null);
  };

  const handleScanSuccess = (scannedText: string) => {
    let companyIdFromScan = scannedText.trim();
    
    // Tenta interpretar como uma URL
    try {
        const url = new URL(scannedText);
        // Novo formato: https://fluxoagil.vercel.app/some-company-id
        if (url.hostname === 'fluxoagil.vercel.app') {
            const pathname = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
            const parts = pathname.split('/');
            if (parts.length === 1 && parts[0]) {
                companyIdFromScan = parts[0];
            }
        } 
        // Formato antigo com hash: .../#/join/some-company-id
        else if (url.hash.startsWith('#/join/')) {
            companyIdFromScan = url.hash.substring('#/join/'.length);
        }
    } catch (e) {
        // Não é uma URL, assume que o texto é o ID da empresa
    }

    setIsScanning(false);
    setScanError(null);
    localStorage.setItem('fluxoagil-company-id', companyIdFromScan);
    setCompanyId(companyIdFromScan);
  };
  
  const handleScanError = (error: string) => {
     if(!error.includes("NotFoundException")){
        console.error(error);
        setScanError("Não foi possível ler o QR code. Tente novamente.");
     }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = manualCompanyIdInput.trim();
    if (trimmedId) {
      localStorage.setItem('fluxoagil-company-id', trimmedId);
      setCompanyId(trimmedId);
    }
  };


  if (!companyId) {
    if (isScanning) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">Aponte para o QR Code</h1>
                <p className="text-lg text-gray-400 mb-8">Centralize o código na área demarcada.</p>
                <QrScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
                {scanError && <p className="text-red-500 mt-4">{scanError}</p>}
                <button onClick={() => setIsScanning(false)} className="mt-6 bg-gray-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-gray-700 transition-colors">
                    Cancelar Leitura
                </button>
            </div>
        )
    }
    return (
       <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8">
           <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">Bem-vindo(a) ao FLUXOÁGIL</h1>
           <p className="text-lg text-gray-400 mb-8 max-w-md">Digite o código da empresa ou leia o QR Code para entrar na fila.</p>
           
           <div className="w-full max-w-sm">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="company-id-input" className="sr-only">Código da Empresa</label>
                        <input
                            id="company-id-input"
                            type="text"
                            value={manualCompanyIdInput}
                            onChange={(e) => setManualCompanyIdInput(e.target.value)}
                            placeholder="Digite o código da empresa"
                            className="w-full text-center px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
                        disabled={!manualCompanyIdInput.trim()}
                    >
                        Entrar na Fila
                    </button>
                </form>

                <div className="my-6 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-600"></div>
                    <div className="px-3 text-gray-400 font-semibold">OU</div>
                    <div className="w-full border-t border-gray-600"></div>
                </div>

                <button
                    onClick={() => setIsScanning(true)}
                    className="w-full flex items-center justify-center gap-3 bg-gray-600 text-white font-bold text-lg px-6 py-3 rounded-xl shadow-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 17h2v2h-2zM19 19h2v2h-2zM15 19h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z" /></svg>
                    Ler QR Code
                </button>
            </div>
       </div>
    );
  }

  const isMyTurn = myTicket && queueState.currentTicket === myTicket;

  if (isMyTurn) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-green-500 text-white rounded-2xl shadow-2xl animate-pulse-fast">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">SUA VEZ!</h1>
        <p className="text-3xl md:text-5xl font-semibold bg-white text-green-700 px-6 py-3 rounded-lg">{myTicket}</p>
        <p className="mt-4 text-lg">Por favor, dirija-se ao atendimento.</p>
        <button 
          onClick={handleDismissTurn}
          className="mt-8 bg-white text-green-700 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-50 transition-colors"
        >
          OK, Entendi!
        </button>
      </div>
    );
  }

  if (!myTicket) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8">
        <div className="w-full max-w-md text-center">
            <div className="flex justify-center items-center gap-4 mb-2">
                {profile?.logoBase64 && <img src={profile.logoBase64} alt="Logo" className="h-16 w-16 rounded-full object-cover shadow-lg"/>}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-100 text-left">
                    {profile?.displayName || companyId}
                </h1>
            </div>
            <p className="text-lg text-gray-400 mb-6">Verifique o status da fila e retire sua senha.</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mb-8 shadow-inner">
          <div className="grid grid-cols-2 gap-4 divide-x divide-gray-700">
            <div className="text-center px-2">
              <p className="text-base text-gray-400">Senha Atual</p>
              <p className="text-4xl font-bold text-gray-100 truncate">{queueState.currentTicket || '---'}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-base text-gray-400">Pessoas na Fila</p>
              <p className="text-4xl font-bold text-gray-100">{queueState.queue.length}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleGetTicket}
          className="bg-blue-600 text-white font-bold text-2xl px-12 py-6 rounded-xl shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          PEGAR SENHA
        </button>
        <div className="w-full max-w-md mt-10">
          <CompanyProfileCard profile={profile} />
        </div>
      </div>
    );
  }

  const peopleInFront = queueState.queue.indexOf(myTicket);
  const estimatedTime = (peopleInFront + 1) * 5;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 text-center">
        <div className="flex justify-center items-center gap-4 mb-6">
            {profile?.logoBase64 && <img src={profile.logoBase64} alt="Logo" className="h-12 w-12 rounded-full object-cover shadow-lg"/>}
            <h1 className="text-2xl font-bold text-gray-100">
                {profile?.displayName || companyId}
            </h1>
        </div>

        <div className="mb-8">
          <p className="text-xl text-gray-400">Sua Senha</p>
          <h2 className="text-6xl sm:text-8xl font-bold text-sky-400 tracking-tight">{myTicket}</h2>
        </div>
        
        <div className="border-t border-b border-gray-700 py-6 my-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-lg text-gray-400">Senha Atual</p>
            <p className="text-4xl sm:text-5xl font-bold text-gray-100">{queueState.currentTicket || '---'}</p>
          </div>
          <div>
            <p className="text-lg text-gray-400">Tempo Estimado</p>
            <p className="text-4xl sm:text-5xl font-bold text-gray-100">
              {peopleInFront >= 0 ? `~${estimatedTime} min` : 'Atendido'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-200 mb-3">Próximos na Fila</h3>
          {queueState.queue.length > 0 ? (
            <ul className="space-y-2">
              {queueState.queue.slice(0, 5).map(ticket => (
                <li 
                  key={ticket} 
                  className={`py-2 px-4 rounded-lg text-lg font-medium ${ticket === myTicket ? 'bg-sky-500/20 text-sky-300 border border-sky-500' : 'bg-gray-700 text-gray-300'}`}
                >
                  {ticket}
                </li>
              ))}
              {queueState.queue.length > 5 && <li className="text-gray-400 pt-2">... e mais {queueState.queue.length - 5}</li>}
            </ul>
          ) : (
            <p className="text-gray-400">
              {peopleInFront >= 0 ? 'Você é o próximo a ser chamado!' : 'A fila está vazia.'}
            </p>
          )}
        </div>
        <div className="mt-10 pt-6 border-t border-gray-700">
             <CompanyProfileCard profile={profile} containerClassName="text-left" />
        </div>
      </div>
    </div>
  );
};

export default ClientView;
