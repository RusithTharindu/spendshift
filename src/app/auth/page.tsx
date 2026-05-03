'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconChart, IconCheck, IconLock, IconWallet } from '@/components/atoms/Icons';

type Mode = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
    };

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Authentication failed.');
        return;
      }
      router.replace('/dashboard');
      router.refresh();
    } catch {
      setError('Unable to reach the server.');
    } finally {
      setPending(false);
    }
  }

  const isSignup = mode === 'signup';

  return (
    <main className="auth-page">
      <section className="auth-shell anim-fade-up" aria-label="SpendShift authentication">
        <div className="auth-card">
          <div className="auth-card-top">
            <div className="auth-brand">
              <div className="auth-mark">§</div>
              <div>
                <h1>SpendShift</h1>
                <p>Sign in before onboarding.</p>
              </div>
            </div>
          </div>

          <div className="auth-card-head">
            <span className="auth-kicker">Account</span>
            <h2>{isSignup ? 'Create your login' : 'Welcome back'}</h2>
            <p>{isSignup ? 'Your preferences and spending data stay under this user.' : 'Use your email and password to continue.'}</p>
          </div>

          <div className="auth-summary" aria-label="Authentication details">
            <div>
              <IconLock size={15} />
              <span>Secure session</span>
            </div>
            <div>
              <IconWallet size={15} />
              <span>User-scoped data</span>
            </div>
            <div>
              <IconChart size={15} />
              <span>Then onboarding</span>
            </div>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button type="button" role="tab" aria-selected={!isSignup} onClick={() => { setMode('signin'); setError(''); }}>
              Sign in
            </button>
            <button type="button" role="tab" aria-selected={isSignup} onClick={() => { setMode('signup'); setError(''); }}>
              Sign up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label>
                <span>Name</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  minLength={2}
                  required
                  placeholder="Jane Doe"
                />
              </label>
            )}

            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                placeholder="you@example.com"
              />
            </label>

            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                minLength={isSignup ? 8 : undefined}
                required
                placeholder="••••••••"
              />
            </label>

            {isSignup && (
              <p className="auth-hint">Use 8+ characters with a letter, number, and special character.</p>
            )}

            {error && <div className="auth-error" role="alert">{error}</div>}

            <button className="auth-submit" type="submit" disabled={pending}>
              {!pending && <IconCheck size={16} stroke={2.2} />}
              {pending ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
