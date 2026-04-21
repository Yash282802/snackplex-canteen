'use client';
import { motion } from 'framer-motion';
import { Zap, Globe, Link, Mail, Phone, MapPin, Heart } from 'lucide-react';

const quickLinks = [
  { label: 'Menu', href: '#menu' },
  { label: 'Live Status', href: '#live' },
  { label: 'AI Insights', href: '#ai' },
  { label: 'How it Works', href: '#flow' },
  { label: 'Dashboard', href: '#admin' },
];

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-8 px-4 overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,107,43,0.15)' }}>
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, #FF6B2B, transparent)' }}/>

      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF6B2B, #FFD700)' }}>
                <Zap size={18} className="text-white" fill="white"/>
              </div>
              <span className="text-2xl font-black" style={{ fontFamily: 'Sora, sans-serif' }}>
                SNACK<span className="gradient-text">PLEX</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              AI-powered smart canteen system for GSFC University. Skip the queue, order ahead, eat smarter.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Link, Mail].map((Icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <Icon size={16}/>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map(link => (
                <a key={link.href} href={link.href}
                  className="block text-sm text-gray-400 hover:text-orange-400 transition-colors animated-underline w-fit">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Contact</h4>
            <div className="space-y-3">
              {[
                { icon: MapPin, text: 'GSFC University, Vadodara, Gujarat' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail, text: 'canteen@gsfcu.edu.in' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <Icon size={14} className="text-orange-400 mt-0.5 shrink-0"/>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="mt-5 glass rounded-xl p-3">
              <p className="text-xs text-orange-400 font-semibold mb-1">⏰ Canteen Hours</p>
              <p className="text-xs text-gray-400">Mon–Fri: 8:00 AM – 6:00 PM</p>
              <p className="text-xs text-gray-400">Saturday: 8:00 AM – 2:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400" fill="currentColor"/> for GSFC University Students
          </p>
          <p className="text-xs text-gray-500">© 2026 SNACKPLEX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
