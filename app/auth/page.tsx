'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { signInWithGoogle, signInWithEmail } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { Mail, Lock, Eye, EyeOff, User, CheckCircle2, ShieldCheck, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import TradingViewIcon from '@/components/ui/TradingViewIcon';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tvUsername, setTvUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: 'bg-border', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: '25%' };
    if (password.length < 10) return { label: 'Medium', color: 'bg-amber-500', width: '50%' };
    if (password.length < 14) return { label: 'Strong', color: 'bg-emerald-500', width: '75%' };
    return { label: 'Very Strong', color: 'bg-accent', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Sign in to Supabase first
        const { error: sbError } = await signInWithEmail(email, password);
        
        if (sbError) {
          setError(sbError.message);
          setIsLoading(false);
          return;
        }

        const res = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError("Invalid email or password in database");
          setIsLoading(false);
        } else {
          window.location.href = '/';
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, tradingViewUsername: tvUsername }),
        });

        if (!res.ok) {
          const data = await res.text();
          setError(data || "Something went wrong during registration");
          return;
        }

        // Auto login after registration
        const loginRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          setError("Account created, but failed to log in automatically. Please log in manually.");
          setIsLogin(true);
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Left Side - Institutional Value Prop */}
      <div className="hidden lg:flex flex-col justify-center p-24 bg-bg-secondary/50 border-r border-border relative overflow-hidden pt-32">

        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest mb-8"
          >
            <ShieldCheck className="w-3 h-3" />
            Institutional Grade Analysis
          </motion.div>
          
          <h2 className="syne font-extrabold text-6xl text-text-primary mb-6 uppercase tracking-tight leading-[0.9]">
            Professional <br /> <span className="text-accent">Market Clarity.</span>
          </h2>

          
          <div className="space-y-10">
            {[
              { icon: Zap, title: "Invite-Only Access", desc: "Get direct access to our premium TradingView scripts." },
              { icon: Globe, title: "Multi-Timeframe Context", desc: "See the bigger picture across all major liquid markets." },
              { icon: ShieldCheck, title: "14-Day Full Trial", desc: "Test the complete Samurai Vision system, no strings attached." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex gap-6 items-start group"
              >
                <div className="p-3 rounded-2xl bg-bg-tertiary border border-border group-hover:border-accent/30 transition-colors">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="syne font-bold text-lg text-text-primary uppercase tracking-tight mb-1">{item.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex flex-col justify-center p-6 sm:p-24 bg-bg-primary relative z-10 pt-32">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-12 text-center lg:text-left">
            <h1 className="syne font-extrabold text-4xl text-text-primary uppercase tracking-tight mb-3">
              {isLogin ? "Welcome Back" : "Join the Edge"}
            </h1>
            <p className="text-text-secondary text-sm">
              {isLogin ? "Enter your credentials to access your dashboard." : "Create your account to unlock premium indicators."}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex gap-1 mb-10 p-1 bg-bg-secondary/50 border border-border rounded-2xl">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-500 ${
                isLogin 
                  ? 'bg-bg-primary text-text-primary shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-border' 
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-500 ${
                !isLogin 
                  ? 'bg-bg-primary text-text-primary shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-border' 
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
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <>
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alexander Black"
                          className="w-full bg-bg-secondary border border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* TradingView Username */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1 flex justify-between">
                        TradingView Username
                        <span className="text-[8px] text-accent/70 lowercase tracking-normal font-sans">Required for indicator access</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                          <TradingViewIcon className="w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                        </div>
                        <input
                          required
                          type="text"
                          value={tvUsername}
                          onChange={(e) => setTvUsername(e.target.value)}
                          placeholder="your_tv_username"
                          className="w-full bg-bg-secondary border border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-bg-secondary border border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Password</label>
                    {isLogin && (
                      <Link href="#" className="text-[10px] font-mono text-accent/70 uppercase tracking-widest hover:text-accent hover:underline transition-colors">
                        Forgot?
                      </Link>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-bg-secondary border border-border rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
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
                        <span className="text-[8px] font-mono uppercase text-text-muted tracking-widest">Security: {strength.label}</span>
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

                {/* Checkboxes */}
                {isLogin ? (
                  <div className="flex items-center gap-2.5 px-1 py-1">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border bg-bg-secondary text-accent focus:ring-accent" />
                    <label htmlFor="remember" className="text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors">Keep me signed in</label>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 px-1 py-1">
                    <input required type="checkbox" id="terms" className="mt-0.5 w-4 h-4 rounded border-border bg-bg-secondary text-accent focus:ring-accent" />
                    <label htmlFor="terms" className="text-xs text-text-secondary leading-relaxed cursor-pointer hover:text-text-primary transition-colors">
                      I agree to the <Link href="#" className="text-accent hover:underline">Terms of Service</Link> and <Link href="#" className="text-accent hover:underline">Privacy Policy</Link>
                    </label>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full !rounded-xl !py-7 !text-xs !tracking-[0.2em]" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        PROCESSING...
                      </div>
                    ) : (
                      isLogin ? "LOG IN TO ACCOUNT" : "START YOUR 14-DAY TRIAL"
                    )}
                  </Button>
                </div>

                {/* Social Login */}
                <div className="relative py-2 flex items-center">
                  <div className="flex-1 h-px bg-border" />
                  <span className="px-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const { error } = await signInWithGoogle();
                    if (error) setError(error.message);
                  }}
                  className="w-full flex items-center justify-center gap-3 py-4 border border-border rounded-xl hover:bg-bg-secondary/80 hover:border-accent/20 transition-all duration-300"
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
                  <span className="text-[10px] font-bold syne text-text-primary uppercase tracking-[0.2em]">Continue with Google</span>
                </button>

                <p className="text-center text-xs text-text-secondary mt-8">
                  {isLogin ? "Don't have access? " : "Already an edge trader? "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-accent font-bold hover:underline transition-all"
                  >
                    {isLogin ? "Start your free trial →" : "Log in to dashboard →"}
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
