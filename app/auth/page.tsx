'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KanjiWatermark from '@/components/shared/KanjiWatermark';
import Button from '@/components/ui/Button';
import { Mail, Lock, Eye, EyeOff, User, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: 'bg-border', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: '25%' };
    if (password.length < 10) return { label: 'Medium', color: 'bg-amber-500', width: '50%' };
    if (password.length < 14) return { label: 'Strong', color: 'bg-emerald-500', width: '75%' };
    return { label: 'Very Strong', color: 'bg-accent', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-12 bg-bg-secondary border border-border rounded-3xl text-center"
        >
          <div className="inline-flex p-4 bg-emerald-500/10 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="syne font-bold text-3xl text-text-primary mb-4 uppercase">Verify your email</h2>
          <p className="text-text-secondary mb-8">We've sent a verification link to your email address. Please check your inbox to activate your account.</p>
          <Link href="/">
            <Button variant="outline" className="w-full">Return Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-40 lg:pt-0">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-col justify-center p-24 bg-bg-secondary relative overflow-hidden">
        <KanjiWatermark kanji="入" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" size="40vw" />
        <div className="relative z-10 max-w-sm">
          <h2 className="syne font-extrabold text-5xl text-text-primary mb-4 uppercase tracking-tighter">
            See the market clearly.
          </h2>
          <p className="shippori-mincho text-2xl text-text-muted mb-12">「市場を明確に見る」</p>
          
          <ul className="space-y-6">
            {[
              "Full access during 14-day trial",
              "No credit card required",
              "Cancel anytime"
            ].map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-4 text-text-secondary font-medium"
              >
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span>{text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center p-8 sm:p-24 bg-bg-primary pt-52 lg:pt-32">
        <div className="max-w-md w-full mx-auto">
          {/* Tab Toggle */}
          <div className="flex gap-2 mb-12 p-1.5 bg-bg-secondary border border-border rounded-2xl">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                isLogin 
                  ? 'bg-bg-primary text-text-primary shadow-lg ring-1 ring-border' 
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                !isLogin 
                  ? 'bg-bg-primary text-text-primary shadow-lg ring-1 ring-border' 
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        required
                        type="text"
                        placeholder="Musashi Miyamoto"
                        className="w-full bg-bg-secondary border border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      required
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-bg-secondary border border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Password</label>
                    {isLogin && (
                      <Link href="#" className="text-[10px] font-mono text-accent uppercase tracking-widest hover:underline">
                        Forgot Password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-bg-secondary border border-border rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {!isLogin && password.length > 0 && (
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] font-mono uppercase text-text-muted tracking-widest">Strength: {strength.label}</span>
                      </div>
                      <div className="h-1 w-full bg-bg-tertiary rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: strength.width }}
                          className={`h-full ${strength.color} transition-all duration-500`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {isLogin ? (
                  <div className="flex items-center gap-2 px-1">
                    <input type="checkbox" id="remember" className="rounded border-border bg-bg-secondary text-accent" />
                    <label htmlFor="remember" className="text-xs text-text-secondary cursor-pointer">Remember me for 30 days</label>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 px-1">
                    <input required type="checkbox" id="terms" className="mt-0.5 rounded border-border bg-bg-secondary text-accent" />
                    <label htmlFor="terms" className="text-xs text-text-secondary leading-relaxed cursor-pointer">
                      I agree to the <Link href="#" className="text-accent hover:underline">Terms of Service</Link> and <Link href="#" className="text-accent hover:underline">Privacy Policy</Link>
                    </label>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg">
                  {isLogin ? "Log In" : "Create Account & Start Trial"}
                </Button>

                <div className="relative py-4 flex items-center">
                  <div className="flex-1 h-px bg-border" />
                  <span className="px-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">or continue with</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-4 border border-border rounded-xl hover:bg-bg-secondary transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-sm font-bold syne text-text-primary uppercase tracking-widest">Google</span>
                </button>

                <p className="text-center text-sm text-text-secondary">
                  {isLogin ? "No account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-accent font-bold hover:underline"
                  >
                    {isLogin ? "Start your free trial →" : "Log in →"}
                  </button>
                </p>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
