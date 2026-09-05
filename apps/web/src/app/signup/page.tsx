'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/button';
import Image from 'next/image';

function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-[40px] w-[112px] md:h-[50px] md:w-[140px] overflow-hidden">
                <Image
                  src="/fin_logo.png"
                  alt="WrectifAI"
                  width={1024}
                  height={1024}
                  priority
                  className="absolute left-0 top-[-28px] md:top-[-35px] h-[96px] md:h-[120px] w-full object-contain object-left"
                />
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#1a56db] transition-colors">How It Works</a>
            <a href="/#ai-diagnose" className="text-sm font-medium text-slate-600 hover:text-[#1a56db] transition-colors">AI Diagnose</a>
            <a href="/#quotes" className="text-sm font-medium text-slate-600 hover:text-[#1a56db] transition-colors">Quotes</a>
            <a href="/#for-garages" className="text-sm font-medium text-slate-600 hover:text-[#1a56db] transition-colors">For Garages</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#1a56db] transition-colors">
              Log In
            </Link>
            <Link href="/signup">
              <Button className="bg-[#17307a] hover:bg-[#12245c] text-white rounded-full px-5">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
import { useAuth, type User } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import { Phone, ShieldCheck, User as UserIcon } from 'lucide-react';
import OtpInput from '@/components/common/otp-input';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export default function SignupPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  // AuthGuard handles redirection after login automatically.

  // Form states
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    if (!mobileNumber.trim()) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }

    const sanitizedPhone = mobileNumber.replace(/\s+/g, '');
    if (sanitizedPhone.length < 10) {
      setErrorMsg('error: Invalid phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/auth/check-phone', { mobileNumber: sanitizedPhone });
      setIsOtpSent(true);
      setSuccessMsg('OTP code sent successfully!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'This phone number is already registered. Please use a different phone number.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const data = await apiClient.post<AuthResponse>('/auth/register', {
        name,
        mobileNumber: mobileNumber.replace(/\s+/g, ''),
        otp,
        role: 'customer'
      });

      login(data.accessToken, data.refreshToken, data.user);
      setSuccessMsg('Successfully registered and logged in! Redirecting...');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed. Please check the OTP code.';
      setErrorMsg(message);
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      // In OAuth flow, we use the same endpoint as login to mock/stub Google/Apple auth.
      const data = await apiClient.post<AuthResponse>('/auth/login', { provider });
      login(data.accessToken, data.refreshToken, data.user);
      setSuccessMsg(`Successfully logged in via ${provider === 'google' ? 'Google' : 'Apple'}! Redirecting...`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `${provider === 'google' ? 'Google' : 'Apple'} login failed.`;
      setErrorMsg(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-50">
      <PublicNavbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-600/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-600/5 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-white/80 p-8 sm:p-10 shadow-[0_20px_60px_rgba(23,48,122,0.08)] relative z-10 transition-all">
          <div className="text-center mb-8">
            <span className="text-blue-600 font-bold tracking-wider text-xs mb-4 block">CREATE ACCOUNT</span>
            
            <div className="relative h-[50px] w-[140px] overflow-hidden mx-auto mb-5">
              <Image
                src="/fin_logo.png"
                alt="WrectifAI"
                width={1024}
                height={1024}
                priority
                className="absolute left-0 top-[-30px] h-[120px] w-full object-contain object-center"
                style={{ width: '100%', height: '120px' }}
              />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17307a] tracking-tight">Join WrectifAI</h1>
            <p className="text-[13px] text-slate-500 mt-2 font-medium">Sign up to access specialized vehicle services.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold text-red-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-sm font-semibold text-green-600">
              {successMsg}
            </div>
          )}

          {!isOtpSent ? (
            /* Step 1: Name and Phone number request */
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#17307a] uppercase tracking-wide mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <UserIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-[#17307a] placeholder-slate-400 outline-none transition-all focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17307a] uppercase tracking-wide mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone className="h-5 w-5" />
                  </span>
                  <input
                    type="tel"
                    required
                    autoComplete="off"
                    value={mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      const digits = val.replace(/\D/g, '').slice(0, 10);
                      setMobileNumber(digits);
                    }}
                    placeholder="e.g., 9876543210"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-[#17307a] placeholder-slate-400 outline-none transition-all focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-[#1a56db] text-white text-[15px] font-bold hover:bg-[#1546b5] transition-all flex items-center justify-center disabled:opacity-50 shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>
          ) : (
            /* Step 2: Verify OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-[#17307a] uppercase tracking-wide">Enter 6-Digit OTP</label>
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-[11px] font-bold text-[#1a56db] hover:underline uppercase"
                  >
                    Change Details
                  </button>
                </div>
                <OtpInput value={otp} onChange={setOtp} disabled={isSubmitting} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full h-12 rounded-xl bg-[#1a56db] text-white text-[15px] font-bold hover:bg-[#1546b5] transition-all flex items-center justify-center disabled:opacity-50 shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Sign Up'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-4 text-[11px] text-slate-400 font-bold uppercase tracking-wider">OR CONTINUE WITH</span>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={isSubmitting}
              type="button"
              className="h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="h-[20px] w-[20px]" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              onClick={() => handleOAuthLogin('apple')}
              disabled={isSubmitting}
              type="button"
              className="h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="h-[20px] w-[20px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.31.11.45.11.83 0 1.9-.53 2.37-1.44z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 font-medium">
              {"Already have an account? "}
              <Link href="/login" className="font-bold text-[#1a56db] hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
