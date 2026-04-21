'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronDown, Zap, Clock, ShoppingBag } from 'lucide-react';
import { useLiveStats } from '@/lib/mockStats';

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 50);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 50);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <>{count}</>;
}

const floatingItems = [
  { emoji: '🍜', x: '8%', y: '25%', delay: 0, size: '3rem' },
  { emoji: '☕', x: '85%', y: '20%', delay: 1, size: '2.5rem' },
  { emoji: '🥙', x: '75%', y: '65%', delay: 2, size: '3.5rem' },
  { emoji: '🍔', x: '12%', y: '70%', delay: 0.5, size: '2.8rem' },
  { emoji: '🥗', x: '92%', y: '50%', delay: 2.5, size: '2rem' },
];

export default function HeroSection() {
  const { orders, waitTime } = useLiveStats();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Gradient orbs */}
      <div className="absolute top-20 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF6B2B, transparent)' }} />
      <div className="absolute bottom-20 right-1/4 w-56 h-56 sm:w-80 sm:h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }} />

      {/* Floating food items - hidden on mobile for performance */}
      <div className="hidden sm:block">
        {floatingItems.map((item, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none select-none"
            style={{ left: item.x, top: item.y, fontSize: item.size }}
            animate={{ y: [0, -18, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4 + i * 0.5, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Canteen Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-green-500/30 mt-32 mb-10 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
        >
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
            <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
          </div>
          <p className="text-sm font-bold tracking-wide">
            <span className="text-green-400">CANTEEN IS OPEN NOW</span>
            <span className="text-gray-500 ml-2">🕒 08:30 AM - 07:30 PM</span>
          </p>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B2B, #FFD700)' }}>
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="text-4xl sm:text-5xl md:text-7xl font-black tracking-normal" style={{ fontFamily: 'Sora, sans-serif' }}>
              SNACK<span className="gradient-text">PLEX</span>
            </span>
          </div>
          <p className="text-xl sm:text-2xl md:text-4xl font-bold text-white mt-4 sm:mt-6 mb-5 sm:mb-6">
            Skip the Queue.{' '}
            <span className="gradient-text">Eat Smart.</span>
          </p>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
            AI-powered smart ordering for GSFC University Canteen. Order ahead, track live queue, eat without the wait.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16"
        >
          <motion.a
            href="#menu"
            whileTap={{ scale: 0.97 }}
            className="btn-ripple flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-white text-base sm:text-lg shadow-2xl glow-orange touch-manipulation"
            style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
            id="hero-order-btn"
          >
            <ShoppingBag size={20} />
            Order Now
          </motion.a>
          <motion.a
            href="#live"
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-white text-base sm:text-lg glass border border-white/20 touch-manipulation"
            id="hero-live-btn"
          >
            <Clock size={20} />
            Live Queue
          </motion.a>
        </motion.div>

        {/* Live Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6"
        >
          {[
            { icon: '📦', label: 'Orders Today', value: orders, suffix: '', live: true },
            { icon: '⏱️', label: 'Avg Wait', value: waitTime, suffix: ' min', live: true },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.95 }}
              className="glass rounded-2xl px-4 py-2 sm:px-5 sm:py-3 flex items-center gap-2 sm:gap-3 touch-manipulation"
            >
              <span className="text-xl sm:text-2xl">{stat.icon}</span>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xl sm:text-2xl font-black" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {stat.live
                      ? stat.value
                      : <AnimatedCounter end={typeof stat.value === 'number' ? stat.value * 10 | 0 : 0} />
                    }{stat.suffix}
                  </span>
                  {stat.live && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                </div>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator removed */}
    </section>
  );
}
