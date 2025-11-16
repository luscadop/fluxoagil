
import React from 'react';
import { HashRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import ClientView from './components/ClientView';
import AdminAuth from './components/AdminAuth';
import TvView from './components/TvView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';

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
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
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
    <HashRouter>
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
    </HashRouter>
  );
};

export default App;
