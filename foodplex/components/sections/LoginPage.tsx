'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, User, Briefcase, ArrowRight, Lock, Mail, ArrowLeft, RefreshCw } from 'lucide-react';

type UserRole = 'student' | 'staff' | null;
type AuthMode = 'role' | 'login' | 'forgot' | 'otp' | 'reset';

interface LoginPageProps {
  onLogin: (role: 'student' | 'staff', email: string) => void;
}

const STAFF_EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@gsfcuniversity\.ac\.in$/;

function validateCredentials(email: string, password: string, role: 'student' | 'staff'): boolean {
  // Both need password
  if (!password || password.length === 0) return false;
  
  if (role === 'staff') {
    // Staff must use @gsfcuniversity.ac.in email
    return STAFF_EMAIL_PATTERN.test(email);
  }
  
  // Student must have valid email with @
  return email.includes('@') && email.includes('.');
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<AuthMode>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleSelect = (role: 'student' | 'staff') => {
    setSelectedRole(role);
    setMode('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    const isValid = validateCredentials(email, password, selectedRole!);
    
    if (isValid) {
      setTimeout(() => {
        onLogin(selectedRole!, email);
      }, 800);
    } else {
      if (selectedRole === 'staff') {
        setErrorMsg('Staff must use @gsfcuniversity.ac.in email');
      } else {
        setErrorMsg('Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }
    setIsLoading(true);
    setMessage('');
    
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generatedOtp);
    
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: `Password Reset OTP - SNACKPLEX`,
          html: `
            <div style="font-family: Arial, padding: 20px; background: #1a1a1a; color: #fff;">
              <h2 style="color: #FF6B2B;">SNACKPLEX Password Reset</h2>
              <p>Your OTP for password reset is:</p>
              <h1 style="font-size: 32px; letter-spacing: 8px; color: #22C55E;">${generatedOtp}</h1>
              <p style="color: #888; font-size: 12px;">This OTP is valid for 10 minutes.</p>
            </div>
          `
        })
      });
      setMessage('OTP sent to your email!');
      setMode('otp');
    } catch (e) {
      setMessage('OTP sent (demo): ' + generatedOtp);
      setMode('otp');
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = () => {
    if (otp === sentOtp) {
      setMode('reset');
      setMessage('OTP verified! Set your new password.');
    } else {
      setMessage('Invalid OTP. Please try again.');
    }
  };

const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    
    // In demo mode, just show success
    setMessage('Password reset successful! Please login with your new password.');
    setTimeout(() => {
      setMode('login');
      setEmail('');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setSentOtp('');
    }, 2000);
  };

  const handleBack = () => {
    if (mode === 'forgot' || mode === 'otp' || mode === 'reset') {
      setMode('role');
      setSelectedRole(null);
    } else if (mode === 'login') {
      setMode('role');
    }
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setSentOtp('');
    setMessage('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: '#0F0F0F' }}>
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF6B2B, transparent)' }} />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #FF6B2B, #FFD700)' }}
          >
            <Zap size={40} className="text-white" fill="white" />
          </motion.div>
          <h1 className="text-4xl font-black mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            SNACK<span className="gradient-text">PLEX</span>
          </h1>
          <p className="text-gray-400 text-lg">GSFC University Canteen</p>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'role' && (
            <motion.div
              key="role-select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass rounded-3xl p-8"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#1A1A1A' }}
            >
              <h2 className="text-xl font-bold text-center mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                Select Your Role
              </h2>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('student')}
                  className="w-full p-5 rounded-2xl flex items-center gap-4 transition-all"
                  style={{ background: 'linear-gradient(135deg, #FF6B2B20, #FF6B2B10)', border: '1px solid #FF6B2B50' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}>
                    <User size={22} className="text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-white text-lg">Student</p>
                    <p className="text-sm text-gray-400">Order food & track queue</p>
                  </div>
                  <ArrowRight size={20} className="text-orange-400" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('staff')}
                  className="w-full p-5 rounded-2xl flex items-center gap-4 transition-all"
                  style={{ background: 'linear-gradient(135deg, #8B5CF620, #8B5CF610)', border: '1px solid #8B5CF650' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>
                    <Briefcase size={22} className="text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-white text-lg">Canteen Staff</p>
                    <p className="text-sm text-gray-400">Manage orders & dashboard</p>
                  </div>
                  <ArrowRight size={20} className="text-purple-400" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {mode === 'login' && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-3xl p-8"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#1A1A1A' }}
            >
              <button onClick={handleBack} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: selectedRole === 'student' ? 'linear-gradient(135deg, #FF6B2B, #E85520)' : 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>
                  {selectedRole === 'student' ? <User size={28} className="text-white" /> : <Briefcase size={28} className="text-white" />}
                </div>
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {selectedRole === 'student' ? 'Student Login' : 'Staff Login'}
                </h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@university.edu"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-orange-400 text-sm hover:underline w-full text-right"
                >
                  Forgot Password?
                </button>

                {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold text-white btn-ripple glow-orange"
                  style={{ background: selectedRole === 'student' ? 'linear-gradient(135deg, #FF6B2B, #E85520)' : 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}
                >
                  {isLoading ? 'Signing in...' : `Sign In as ${selectedRole === 'student' ? 'Student' : 'Staff'}`}
                </motion.button>
              </form>
            </motion.div>
          )}

          {mode === 'forgot' && (
            <motion.div
              key="forgot-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-3xl p-8"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#1A1A1A' }}
            >
              <button onClick={handleBack} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}>
                  <RefreshCw size={28} className="text-white" />
                </div>
                <h2 className="text-xl font-bold">Forgot Password</h2>
                <p className="text-gray-400 text-sm mt-1">Enter your email to reset</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@university.edu"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {message && <p className="text-green-400 text-sm">{message}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold text-white btn-ripple"
                  style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {mode === 'otp' && (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-3xl p-8"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#1A1A1A' }}
            >
              <button onClick={handleBack} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back
              </button>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Verify OTP</h2>
                <p className="text-gray-400 text-sm mt-1">Enter 6-digit code sent to your email</p>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full py-3 rounded-xl bg-black/30 border border-white/10 text-white text-center text-2xl letter-spacing-8"
                    maxLength={6}
                  />
                </div>

                {message && <p className="text-orange-400 text-sm">{message}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerifyOtp}
                  className="w-full py-4 rounded-xl font-bold text-white btn-ripple"
                  style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
                >
                  Verify OTP
                </motion.button>

                <button onClick={handleSendOtp} className="w-full text-orange-400 text-sm hover:underline">
                  Resend OTP
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'reset' && (
            <motion.div
              key="reset-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-3xl p-8"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#1A1A1A' }}
            >
              <button onClick={handleBack} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back
              </button>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Reset Password</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                  />
                </div>

                {message && <p className="text-green-400 text-sm">{message}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResetPassword}
                  className="w-full py-4 rounded-xl font-bold text-white btn-ripple"
                  style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
                >
                  Reset Password
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-gray-500 text-xs mt-8">
          © 2026 GSFC University • SNACKPLEX Canteen System
        </p>
      </motion.div>
    </div>
  );
}