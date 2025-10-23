import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.tsx'
import AuthCallback from '@components/AuthCallback'
import { useAuthStore, useGuestStore } from '@zustand/store'

import './index.css'

export const Root = () => {
  const initAuth = useAuthStore((state) => state.initAuth);
  const initGuestUuid = useGuestStore((state) => state.initGuestUuid);

  useEffect(() => {
    initAuth();
    initGuestUuid();
  }, [initAuth, initGuestUuid]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
