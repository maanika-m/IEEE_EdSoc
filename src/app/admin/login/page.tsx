import React, { useState } from 'react';
import { LogoPlaceholder } from '../../../components/ui/LogoPlaceholder';
import { signInAdmin } from '../../../lib/supabase/auth';
import type { AdminProfile } from '../../../lib/types/database';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
  onLoginSuccess?: (profile: AdminProfile) => void;
}

export default function AdminLoginPage({ onNavigate, onLoginSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your officer email address.');
      return;
    }
    // Password is required, but never trimmed or transformed
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInAdmin(trimmedEmail, password);

      if (!result.success || !result.profile) {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      // Real Supabase session established and stored in browser storage
      onLoginSuccess?.(result.profile);
      onNavigate('/admin');
    } catch (err: any) {
      setError(err?.message || 'A network error occurred while connecting to Supabase Auth.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1b3d] text-white flex flex-col justify-between pcb-substrate-dark">
      {/* Top Bar */}
      <header className="p-6 border-b border-white/10 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="flex items-center gap-2 text-xs font-mono text-[#c6c6cf] hover:text-white"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Public Website</span>
        </a>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <LogoPlaceholder type="srmist" variant="nav" />
          <LogoPlaceholder type="edsoc" variant="nav" />
        </div>
      </header>

      {/* Login Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white text-[#151b2a] border border-[#c6c6cf]/60 clip-qfp-card p-8 sm:p-10 shadow-2xl relative">
          <div className="ic-pins-gold absolute top-0 left-6 right-6"></div>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff8928]"></span>
            <span className="font-mono text-[10px] text-[#964900] uppercase font-bold tracking-widest">
              OFFICER AUTHENTICATION
            </span>
          </div>

          <h2 className="font-poppins font-bold text-2xl text-[#0d1b3d] mb-1">
            Chapter Admin Console
          </h2>
          <p className="font-sans text-xs text-[#45464e] mb-6">
            Authorized access for elected office bearers &amp; faculty advisory of IEEE EdSoc SRMIST.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 bg-red-50/90 border border-red-200 border-l-4 border-l-red-600 font-sans text-xs text-red-800 break-words rounded-r shadow-xs flex items-start gap-2.5"
            >
              <span className="material-symbols-outlined text-base text-red-600 shrink-0 mt-0.5">
                error
              </span>
              <div className="flex-1 leading-relaxed">
                <span className="font-semibold block mb-0.5 text-red-950 font-mono text-[11px] uppercase tracking-wide">
                  Authentication Notice
                </span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-headline-sm text-xs font-semibold text-[#151b2a] mb-1">
                IEEE / Officer Email
              </label>
              <input
                type="email"
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@srmist.edu.in"
                className="w-full p-2.5 border border-[#c6c6cf] font-sans text-sm outline-none focus:border-[#ff8928] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-headline-sm text-xs font-semibold text-[#151b2a] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 border border-[#c6c6cf] font-sans text-sm outline-none focus:border-[#ff8928] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="chamfer-btn w-full py-3 bg-[#ff8928] hover:bg-[#964900] disabled:bg-[#ff8928]/60 text-white font-headline-sm text-xs uppercase font-bold tracking-wider transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin inline-block"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Console</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#e2e8fc] text-center font-mono text-[10px] text-[#76767f]">
            IEEE Education Society Student Chapter • SRMIST Kattankulathur
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center font-mono text-xs text-[#c6c6cf]/60 border-t border-white/10">
        © 2025 IEEE EdSoc SRMIST Student Chapter [CH-ID: 10429]
      </footer>
    </div>
  );
}
