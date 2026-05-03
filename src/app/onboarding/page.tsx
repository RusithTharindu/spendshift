'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useApp } from '@/contexts/AppContext';
import Onboarding from '@/components/organisms/Onboarding';

function OnboardingGate() {
  const { state, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && state.onboarded) {
      router.replace('/dashboard');
    }
  }, [loading, state.onboarded, router]);

  if (loading) return null;
  if (state.onboarded) return null;
  return <Onboarding />;
}

export default function OnboardingPage() {
  return (
    <AppProvider>
      <OnboardingGate />
    </AppProvider>
  );
}
