import React, { useState, useEffect, useRef } from 'react';
import { useQueue } from '../hooks/useQueue';
import { useCompanyProfile } from '../hooks/useCompanyProfile';

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


const ClientView: React.FC = () => {
  const [companyId, setCompanyId] = useState<string | null>(() => sessionStorage.getItem('fluxoagil-company-id'));
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

  const handleScanSuccess = (scannedCompanyId: string) => {
    setIsScanning(false);
    setScanError(null);
    sessionStorage.setItem('fluxoagil-company-id', scannedCompanyId);
    setCompanyId(scannedCompanyId);
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
      sessionStorage.setItem('fluxoagil-company-id', trimmedId);
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.5 6.5v-2.5m-11-4H1m11-8h-1M4 8h1m16 11.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-11-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm11 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-11 11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                    </svg>
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
      <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="flex items-center gap-4 mb-2">
            {profile?.logoBase64 && <img src={profile.logoBase64} alt="Logo" className="h-12 w-12 rounded-full object-cover"/>}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
                Fila para: <span className="text-sky-400">{profile?.displayName || companyId}</span>
            </h1>
        </div>
        <p className="text-lg text-gray-400 mb-8">Consulte o status da fila e retire sua senha de atendimento.</p>

        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm mb-8 shadow-inner">
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
      </div>
    );
  }

  const peopleInFront = queueState.queue.indexOf(myTicket);
  const estimatedTime = (peopleInFront + 1) * 5;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 max-w-2xl mx-auto text-center">
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

    </div>
  );
};

export default ClientView;
