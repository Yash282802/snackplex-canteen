'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Check, Smartphone, Wallet, Mail } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useOrders } from '@/lib/orderContext';
import { menuItems } from '@/lib/menuData';

type PayState = 'idle' | 'processing' | 'success';

function SuccessTick({ orderId }: { orderId: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex flex-col items-center gap-4 py-8"
    >
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <motion.circle
            cx="50" cy="50" r="44"
            fill="none" stroke="#22C55E" strokeWidth="5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M28 52 L44 68 L72 36"
            fill="none" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        </svg>
      </div>
      <h3 className="text-2xl font-black text-green-400" style={{ fontFamily: 'Sora, sans-serif' }}>Order Placed! 🎉</h3>
      <p className="text-gray-400 text-center text-sm">Your order is confirmed. We've sent a confirmation email!</p>
      <div className="glass rounded-2xl px-6 py-3 text-sm text-center">
        <p className="text-gray-400">Order ID</p>
        <p className="text-xl font-bold text-orange-400">{orderId}</p>
      </div>
    </motion.div>
  );
}

export default function CheckoutSection() {
  const { cart, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [open, setOpen] = useState(false);
  const [payState, setPayState] = useState<PayState>('idle');
  const [payMethod, setPayMethod] = useState<'upi' | 'wallet'>('upi');
  const [pickupTime, setPickupTime] = useState('Now');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');

  // Use first 3 items as preview if cart is empty
  const displayItems = cart.length > 0 ? cart : menuItems.slice(0, 3).map(i => ({ ...i, qty: 1 }));
  const displayTotal = cart.length > 0 ? total : displayItems.reduce((s, i) => s + i.price, 0);

  const handlePay = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    const orderItems = cart.length > 0 
      ? cart.map(item => ({ name: item.name, price: item.price, qty: item.qty, emoji: item.emoji }))
      : displayItems.map(item => ({ name: item.name, price: item.price, qty: item.qty, emoji: item.emoji }));
    
    setPayState('processing');
    setTimeout(async () => {
      const newOrder = await addOrder(email, orderItems, displayTotal, pickupTime);
      setOrderId(newOrder.id);
      setPayState('success');
      clearCart();
    }, 2000);
  };

  const handleClose = () => {
    setOpen(false);
    setEmail('');
    setOrderId('');
    setTimeout(() => setPayState('idle'), 400);
  };

  return (
    <section id="checkout" className="section-pad px-4" style={{ background: 'linear-gradient(180deg, #0F0F0F, #130a00, #0F0F0F)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-orange-400 font-semibold text-sm tracking-widest uppercase mb-3 block">Seamless Payment</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Quick <span className="gradient-text">Checkout</span>
          </h2>
          <p className="text-gray-400">Pay in one tap — no queues at the counter required.</p>
        </motion.div>

        {/* Checkout preview card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 sm:p-8 max-w-xl mx-auto"
          style={{ border: '1px solid rgba(255,107,43,0.2)' }}
        >
          <h3 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            <ShoppingCart size={20} className="text-orange-400" />
            {cart.length > 0 ? 'Your Order' : 'Sample Order'}
          </h3>

          <div className="space-y-3 mb-5">
            {displayItems.slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-gray-500 text-xs">Qty: {item.qty}</p>
                </div>
                <p className="font-bold text-sm text-orange-400">
                  {item.price > 0 ? `₹${item.price * item.qty}` : 'MRP'}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Subtotal</span>
              <span className="font-semibold">₹{displayTotal}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-400 text-sm">Convenience fee</span>
              <span className="text-green-400 text-sm font-semibold">FREE 🎉</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
              <span className="font-bold text-lg">Total</span>
              <span className="font-black text-2xl gradient-text" style={{ fontFamily: 'Sora, sans-serif' }}>₹{displayTotal}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen(true)}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg btn-ripple glow-orange"
            style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
            id="open-checkout-modal"
          >
            Proceed to Pay →
          </motion.button>
        </motion.div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
              style={{ background: '#1a1a1a', border: '1px solid rgba(255,107,43,0.2)' }}
            >
              <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6" />

              {payState === 'success' ? (
                <SuccessTick orderId={orderId} />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black" style={{ fontFamily: 'Sora, sans-serif' }}>Complete Payment</h3>
                    <button onClick={handleClose} className="w-8 h-8 glass rounded-lg flex items-center justify-center">
                      <X size={16} />
                    </button>
                  </div>

                  {/* Email */}
                  <div className="mb-5">
                    <p className="text-sm text-gray-400 mb-2 font-medium">Email Address</p>
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
                    <p className="text-xs text-gray-500 mt-1">Order confirmation will be sent to this email</p>
                  </div>

                  {/* Pickup time */}
                  <div className="mb-5">
                    <p className="text-sm text-gray-400 mb-2 font-medium">Pickup Time</p>
                    <div className="flex gap-2 flex-wrap">
                      {['Now', 'In 15 min', 'In 30 min', 'Custom'].map(t => (
                        <button
                          key={t}
                          onClick={() => setPickupTime(t)}
                          className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                            pickupTime === t
                              ? 'text-white'
                              : 'glass text-gray-400'
                          }`}
                          style={pickupTime === t ? { background: 'linear-gradient(135deg, #FF6B2B, #E85520)' } : {}}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pay method */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2 font-medium">Payment Method</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'upi' as const, label: 'UPI', icon: <Smartphone size={18} /> },
                        { id: 'wallet' as const, label: 'Wallet', icon: <Wallet size={18} /> },
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => setPayMethod(m.id)}
                          className={`flex flex-col items-center gap-1 py-4 rounded-2xl font-semibold text-sm transition-all ${
                            payMethod === m.id ? 'text-white glow-orange' : 'glass text-gray-400'
                          }`}
                          style={payMethod === m.id ? { background: 'linear-gradient(135deg, #FF6B2B, #E85520)' } : {}}
                          id={`pay-${m.id}`}
                        >
                          {m.icon}
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-5 p-4 rounded-2xl glass">
                    <span className="text-gray-400">Total to pay</span>
                    <span className="font-black text-xl gradient-text">₹{displayTotal}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePay}
                    disabled={payState === 'processing'}
                    className="w-full py-4 rounded-2xl font-bold text-white text-lg btn-ripple relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
                    id="confirm-pay-btn"
                  >
                    {payState === 'processing' ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      `Pay ₹${displayTotal} Now`
                    )}
                  </motion.button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
