'use client';
import { motion } from 'framer-motion';
import { Search, Clock, CreditCard, Package } from 'lucide-react';

const steps = [
  {
    icon: Search,
    emoji: '🍽️',
    number: '01',
    title: 'Browse & Select',
    desc: 'Explore the full canteen menu with smart filters and AI-powered recommendations tailored just for you.',
    color: '#FF6B2B',
    bg: 'rgba(255,107,43,0.12)',
    border: 'rgba(255,107,43,0.25)',
  },
  {
    icon: Clock,
    emoji: '⏰',
    number: '02',
    title: 'Choose Pickup Time',
    desc: 'Schedule your order for the perfect moment — AI suggests the best time to skip the queue.',
    color: '#FFD700',
    bg: 'rgba(255,215,0,0.10)',
    border: 'rgba(255,215,0,0.25)',
  },
  {
    icon: CreditCard,
    emoji: '💳',
    number: '03',
    title: 'Pay Instantly',
    desc: 'Secure one-tap payment. UPI, card, or wallet — zero friction, no cash needed at the counter.',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.10)',
    border: 'rgba(139,92,246,0.25)',
  },
  {
    icon: Package,
    emoji: '✅',
    number: '04',
    title: 'Grab & Go',
    desc: 'Get notified when your order is ready. Walk in, show QR code, and pick up — no waiting!',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.25)',
  },
];

export default function OrderFlowSection() {
  return (
    <section id="flow" className="section-pad px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-orange-400 font-semibold text-sm tracking-widest uppercase mb-3 block">Simple Process</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Four simple steps. Order in under 30 seconds. No queues, no stress.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="absolute hidden lg:block top-14 left-[12.5%] right-[12.5%] h-px"
            style={{ background: 'linear-gradient(90deg, #FF6B2B33, #22C55E33)' }} />

          {steps.map((step, i) => {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="relative flex flex-col items-center text-center rounded-3xl p-6"
                style={{ background: step.bg, border: `1px solid ${step.border}` }}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: step.color, color: '#fff' }}>
                  {step.number}
                </div>

                {/* Icon circle */}
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 mt-4"
                  style={{ background: step.bg, border: `1px solid ${step.border}` }}
                >
                  {step.emoji}
                </motion.div>

                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Sora, sans-serif', color: step.color }}>
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>

                {/* Arrow for non-last items (mobile) */}
                {i < steps.length - 1 && (
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="lg:hidden mt-4 text-gray-600 text-xl"
                  >
                    ↓
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <motion.a
            href="#checkout"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-lg btn-ripple glow-orange"
            style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
            id="start-ordering-btn"
          >
            🚀 Start Ordering Now
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
