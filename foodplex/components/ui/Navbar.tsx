'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Sun, Moon, Zap, LogOut, User } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import CartDrawer from './CartDrawer';

type NavbarProps = {
  isStaff?: boolean;
};

export default function Navbar({ isStaff = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();
  const { logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [darkMode]);

  const navLinks = isStaff
    ? [
        { label: 'Dashboard', href: '#admin' },
        { label: 'Live Status', href: '#live' },
        { label: 'Analytics', href: '#ai' },
      ]
    : [
        { label: 'Menu', href: '#menu' },
        { label: 'Live Status', href: '#live' },
        { label: 'How it Works', href: '#flow' },
      ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 touch-manipulation ${
          scrolled ? 'glass border-b border-white/10 py-3' : 'py-4'
        }`}
        style={{ backgroundColor: scrolled ? 'rgba(15, 15, 15, 0.9)' : 'rgba(15, 15, 15, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <a href={isStaff ? "#admin" : "#hero"} className="flex items-center gap-2 group touch-manipulation">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center touch-manipulation"
              style={{ background: 'linear-gradient(135deg, #FF6B2B, #FFD700)' }}
            >
              <Zap size={20} className="text-white" fill="white" />
            </motion.div>
            <span className="text-xl sm:text-xl font-black tracking-wider" style={{ fontFamily: 'Sora, sans-serif' }}>
              SNACK<span className="gradient-text">PLEX</span>
              {isStaff && <span className="text-xs text-purple-400 ml-1">(Staff)</span>}
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white animated-underline transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl glass flex items-center justify-center text-gray-300 hover:text-white transition-colors touch-manipulation"
              id="dark-mode-toggle"
            >
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </motion.button>

            {!isStaff && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCartOpen(true)}
                className="relative btn-ripple flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all touch-manipulation"
                style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
                id="cart-btn"
              >
                <ShoppingCart size={18} />
                <span className="hidden xs:inline sm:hidden md:inline">Cart</span>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ background: '#FFD700', color: '#111' }}
                  >
                    {count}
                  </motion.span>
                )}
              </motion.button>
            )}

            {isStaff && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl glass text-purple-400">
                  <User size={16} />
                  <span className="text-sm font-medium">Staff</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={logout}
                  className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl glass flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors touch-manipulation"
                  id="logout-btn"
                  title="Logout"
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            )}

            {!isStaff && (
              <button
                className="md:hidden w-10 h-10 glass rounded-xl flex items-center justify-center touch-manipulation"
                onClick={() => setMobileOpen(!mobileOpen)}
                id="mobile-menu-btn"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass border-t border-white/10 px-4 overflow-hidden"
            >
              <div className="py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-300 hover:text-white font-medium py-3 px-2 rounded-lg touch-manipulation"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
