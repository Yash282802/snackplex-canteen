'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Brain, TrendingUp, Package, Cpu } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { predictionData, inventoryData } from '@/lib/mockStats';

function InventoryBar({ name, percent, color, index }: { name: string; percent: number; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="space-y-1"
    >
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-300 font-medium">{name}</span>
        <span className="font-bold" style={{ color }}>{percent}%</span>
      </div>
      <div className="h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

function AIFeatureChip({ label, icon }: { label: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm font-medium text-gray-300"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.div>
  );
}

export default function AISection() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="ai" className="section-pad px-4" style={{ background: 'linear-gradient(180deg, #0F0F0F 0%, #130a00 50%, #0F0F0F 100%)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
            style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
            <Cpu size={14} className="text-purple-400" />
            <span className="text-purple-400 text-sm font-semibold">AI-Powered Intelligence</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Inventory <span className="gradient-text">& Analytics</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Machine learning predicts demand, manages inventory, and optimizes operations — all in real time.
          </p>
        </motion.div>

        {/* AI Feature chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {[
            { label: 'Demand Prediction', icon: '🔮' },
            { label: 'Queue Balancing', icon: '⚖️' },
            { label: 'Auto Inventory Alerts', icon: '📦' },
            { label: 'Peak Hour Detection', icon: '⏰' },
            { label: 'Personalized Suggestions', icon: '✨' },
            { label: 'Waste Reduction', icon: '♻️' },
          ].map((f, i) => <AIFeatureChip key={i} {...f} />)}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Prediction Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6"
            style={{ border: '1px solid rgba(255,107,43,0.15)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-orange-400" />
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>Order Demand Prediction</h3>
              <span className="ml-auto text-xs text-orange-400 glass px-2 py-1 rounded-full">Today's Forecast</span>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-12 w-full" />)}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={predictionData}>
                  <defs>
                    <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B2B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF6B2B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e1e1e', border: '1px solid rgba(255,107,43,0.3)', borderRadius: 12, color: '#fff' }}
                    labelStyle={{ color: '#FF6B2B', fontWeight: 700 }}
                  />
                  <Area type="monotone" dataKey="orders" stroke="#FF6B2B" strokeWidth={2.5}
                    fill="url(#orderGrad)" dot={{ fill: '#FF6B2B', r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}

            <div className="mt-4 p-3 rounded-2xl flex items-start gap-3"
              style={{ background: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.15)' }}>
              <Brain size={16} className="text-orange-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-300">
                Peak demand expected at <span className="text-orange-400 font-semibold">1:00 PM</span> with ~180 orders.
                AI suggests increasing staff by <span className="text-orange-400 font-semibold">2 members</span> during noon rush.
              </p>
            </div>
          </motion.div>

          {/* Inventory Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6"
            style={{ border: '1px solid rgba(255,107,43,0.15)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Package size={18} className="text-orange-400" />
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>Inventory Status</h3>
              <span className="ml-auto text-xs text-green-400 glass px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live Tracking
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-5">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-6 w-full" />)}
              </div>
            ) : (
              <div className="space-y-5">
                {inventoryData.map((item, i) => (
                  <InventoryBar key={i} {...item} index={i} />
                ))}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-red-400 font-bold text-lg">2</p>
                <p className="text-xs text-gray-400">Low Stock Alerts</p>
              </div>
              <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <p className="text-green-400 font-bold text-lg">98%</p>
                <p className="text-xs text-gray-400">Uptime Today</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
