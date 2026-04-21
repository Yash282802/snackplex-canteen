'use client';
import { motion } from 'framer-motion';
import { Brain, Clock, Users } from 'lucide-react';
import { useLiveStats, useDashboardStats } from '@/lib/mockStats';

const crowdConfig: Record<'Low' | 'Medium' | 'High', { color: string; label: string; bars: number; ring: string }> = {
  Low: { color: '#22C55E', label: 'Low — Great time to visit!', bars: 2, ring: '#22C55E' },
  Medium: { color: '#F59E0B', label: 'Medium — Moderate rush', bars: 5, ring: '#F59E0B' },
  High: { color: '#EF4444', label: 'High — Expect a wait!', bars: 9, ring: '#EF4444' },
};

function QueueDots({ count }: { count: number }) {
  const dots = Array.from({ length: Math.min(count, 20) });
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {dots.map((_, i) => (
        <motion.div
          key={i}
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
          style={{ background: 'rgba(255,107,43,0.15)', border: '1px solid rgba(255,107,43,0.3)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.04, type: 'spring' }}
        >
          🧑
        </motion.div>
      ))}
      {count > 20 && (
        <div className="w-7 h-7 rounded-full glass flex items-center justify-center text-xs text-orange-400 font-bold">
          +{count - 20}
        </div>
      )}
    </div>
  );
}

export default function LiveStatusSection() {
  const { orders, waitTime, crowdLevel, queueCount } = useLiveStats();
  const { topItems } = useDashboardStats();
  const cfg = crowdConfig[crowdLevel];
  const bars = Array.from({ length: 10 });

  const trendingText = topItems.length > 0 && topItems[0].name !== '' 
      ? topItems.slice(0, 2).map(t => t.name).join(' + ')
      : 'Waiting for orders...';
  const trendingCount = topItems.length > 0 ? topItems[0].orders : 0;

  const skipTip = waitTime > 5 
      ? `Queue is long! Pre-order ${Math.ceil(waitTime + 5)} min ahead to skip the rush!`
      : 'Queue is short! You can order directly right now.';

  const bestTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour < 11) return '11:45 AM';
    if (currentHour < 13) return '2:30 PM';
    if (currentHour < 15) return '4:00 PM';
    return 'Tomorrow 9:00 AM';
  };

  return (
    <section id="live" className="section-pad px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-semibold text-sm tracking-widest uppercase">Live Now</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Canteen <span className="gradient-text">Status</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Real-time crowd monitoring and queue intelligence powered by AI.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Crowd Meter */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 flex flex-col items-center"
          >
            <div className="flex items-center gap-2 mb-6 self-start">
              <Users size={18} className="text-orange-400" />
              <h3 className="font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Crowd Level</h3>
            </div>

            {/* Circular meter */}
            <div className="relative w-36 h-36 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="58" fill="none" stroke="#2a2a2a" strokeWidth="12" />
                <motion.circle
                  cx="70" cy="70" r="58"
                  fill="none"
                  stroke={cfg.ring}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - (queueCount / 30)) }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black" style={{ color: cfg.color, fontFamily: 'Sora, sans-serif' }}>
                  {queueCount}
                </span>
                <span className="text-xs text-gray-400">in queue</span>
              </div>
            </div>

            {/* Bars */}
            <div className="flex items-end gap-1 mb-4 h-10">
              {bars.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 rounded-t"
                  style={{ height: `${(i + 1) * 10}%`, background: i < cfg.bars ? cfg.color : '#2a2a2a' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: cfg.color }} />
              <span className="text-sm font-semibold" style={{ color: cfg.color }}>{crowdLevel}</span>
            </div>
            <p className="text-xs text-gray-400 text-center mt-1">{cfg.label}</p>
          </motion.div>

          {/* Queue Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-orange-400" />
                <h3 className="font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Live Queue</h3>
              </div>
              <span className="text-xs glass px-2 py-1 rounded-full text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Updating
              </span>
            </div>

            <div className="mb-6">
              <QueueDots count={queueCount} />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,107,43,0.1)', border: '1px solid rgba(255,107,43,0.2)' }}>
                <p className="text-2xl font-black gradient-text" style={{ fontFamily: 'Sora, sans-serif' }}>{waitTime}</p>
                <p className="text-xs text-gray-400">min wait</p>
              </div>
              <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <p className="text-2xl font-black text-green-400" style={{ fontFamily: 'Sora, sans-serif' }}>{orders}</p>
                <p className="text-xs text-gray-400">orders today</p>
              </div>
            </div>
          </motion.div>

          {/* AI Tip */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <Brain size={18} className="text-purple-400" />
              <h3 className="font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>AI Recommendation</h3>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="rounded-2xl p-4" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <p className="text-xs text-purple-300 mb-1">⏰ Best time to order:</p>
                <p className="text-xl font-black text-white">{bestTime()}<span className="blink text-orange-400">|</span></p>
                <p className="text-xs text-gray-400 mt-1">Based on today's traffic patterns</p>
              </div>

              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,107,43,0.1)', border: '1px solid rgba(255,107,43,0.2)' }}>
                <p className="text-xs text-orange-300 mb-1">🔥 Trending right now:</p>
                <p className="font-bold text-white">{trendingText}</p>
                <p className="text-xs text-gray-400 mt-1">Ordered {trendingCount}x recently</p>
              </div>

              <div className="rounded-2xl p-4" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <p className="text-xs text-green-400 mb-1">💡 Skip tip:</p>
                <p className="text-sm text-white">{skipTip}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
