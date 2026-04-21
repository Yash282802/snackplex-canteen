'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, User, Briefcase, ArrowRight, Lock, Mail } from 'lucide-react';
import axios from 'axios';

type UserRole = 'student' | 'staff' | null;

interface LoginPageProps {
  onLogin: (role: 'student' | 'staff', email: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [showForm, setShowForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffSecret, setStaffSecret] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: 'student' | 'staff') => {
    setSelectedRole(role);
    setShowForm(true);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      if (isRegister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/signup`, {
          email,
          password,
          role: selectedRole,
          staffSecret: selectedRole === 'staff' ? staffSecret : undefined
        });
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        email,
        password,
        role: selectedRole
      }, { withCredentials: true });
      
      onLogin(selectedRole!, email);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg('Network connectivity error. Is your local backend running?');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setStaffSecret('');
    setErrorMsg('');
    setIsRegister(false);
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
          {!showForm ? (
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
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-3xl p-8"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm"
              >
                ← Back to role selection
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: selectedRole === 'student' ? 'linear-gradient(135deg, #FF6B2B, #E85520)' : 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>
                  {selectedRole === 'student' ? <User size={28} className="text-white" /> : <Briefcase size={28} className="text-white" />}
                </div>
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {isRegister ? `Register as ${selectedRole === 'student' ? 'Student' : 'Staff'}` : `Sign In as ${selectedRole === 'student' ? 'Student' : 'Staff'}`}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {isRegister ? 'Setup your secure credentials below.' : 'Enter your credentials to securely login.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm mb-4">
                    {errorMsg}
                  </motion.div>
                )}

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'student' ? 'your.email@university.edu' : 'snackplex@gsfcuniversity.ac.in'}
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
                      minLength={6}
                    />
                  </div>
                </div>

                {isRegister && selectedRole === 'staff' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                    <label className="text-sm text-gray-400 mb-2 block mt-1">Staff Secure Registration Key</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="password"
                        value={staffSecret}
                        onChange={(e) => setStaffSecret(e.target.value)}
                        placeholder="Provided by Administrator"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                        required={isRegister && selectedRole === 'staff'}
                      />
                    </div>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold text-white btn-ripple glow-orange relative overflow-hidden mt-6"
                  style={{ background: selectedRole === 'student' ? 'linear-gradient(135deg, #FF6B2B, #E85520)' : 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isRegister ? 'Creating Account...' : 'Authenticating...'}
                    </div>
                  ) : (
                    isRegister ? 'Create Account' : 'Secure Sign In'
                  )}
                </motion.button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                {isRegister ? 'Already registered?' : 'Need to join?'} {' '}
                <button type="button" onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }} className="text-white hover:text-orange-400 font-bold transition-colors">
                  {isRegister ? 'Sign In Instead' : 'Register Here'}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-gray-500 text-xs mt-8">
          © 2026 GSFC University • FoodPlex Canteen System
        </p>
      </motion.div>
    </div>
  );
}