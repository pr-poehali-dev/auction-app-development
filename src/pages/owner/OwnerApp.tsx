import { useState, useEffect } from 'react';
import { ownerMe, hasOwnerToken } from '@/lib/owner-api';
import OwnerLoginPage from './OwnerLoginPage';
import OwnerRegisterPage from './OwnerRegisterPage';
import OwnerDashboardPage from './OwnerDashboardPage';

type Screen = 'login' | 'register' | 'dashboard';

export default function OwnerApp() {
  const [screen, setScreen] = useState<Screen>('login');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!hasOwnerToken()) {
      setChecking(false);
      return;
    }
    ownerMe()
      .then((me) => {
        if (me) setScreen('dashboard');
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (screen === 'register') {
    return (
      <OwnerRegisterPage
        onSuccess={() => setScreen('login')}
        onGoLogin={() => setScreen('login')}
      />
    );
  }

  if (screen === 'dashboard') {
    return (
      <OwnerDashboardPage
        onLogout={() => setScreen('login')}
      />
    );
  }

  return (
    <OwnerLoginPage
      onSuccess={() => setScreen('dashboard')}
      onGoRegister={() => setScreen('register')}
    />
  );
}
