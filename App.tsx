
import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import ClientView from './components/ClientView';
import AdminAuth from './components/AdminAuth';
import TvView from './components/TvView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import JoinView from './components/JoinView';

// SVG Icons for Navigation
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const HistoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995a6.473 6.473 0 010 1.912c0 .382.145.755.438.995l1.003.827c.48.398.664 1.04.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995a6.473 6.473 0 010-1.912c0-.382-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
  </svg>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans pb-24">
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-sky-400">
                <LogoIcon className="h-7 w-7"/>
                <span>FLUXO<span className="font-light text-gray-300">ÁGIL</span></span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<ClientView />} />
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/tv/:companyId" element={<TvView />} />
            <Route path="/tv" element={<TvView />} />
            <Route path="/history" element={<HistoryView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/join/:companyId" element={<JoinView />} />
          </Routes>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 shadow-lg z-10">
          <div className="container mx-auto flex justify-around max-w-lg">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center pt-3 pb-2 w-full transition-colors duration-200 ${
                  isActive ? 'text-sky-400' : 'text-gray-400 hover:text-sky-400'
                }`
              }
            >
              <HomeIcon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">Início</span>
            </NavLink>
            <NavLink 
              to="/history" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center pt-3 pb-2 w-full transition-colors duration-200 ${
                  isActive ? 'text-sky-400' : 'text-gray-400 hover:text-sky-400'
                }`
              }
            >
              <HistoryIcon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">Histórico</span>
            </NavLink>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center pt-3 pb-2 w-full transition-colors duration-200 ${
                  isActive ? 'text-sky-400' : 'text-gray-400 hover:text-sky-400'
                }`
              }
            >
              <SettingsIcon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">Configurações</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </BrowserRouter>
  );
};

export default App;
