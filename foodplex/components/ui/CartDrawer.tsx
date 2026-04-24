'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { useOrders } from '@/lib/orderContext';
import { useAuth } from '@/lib/authContext';
import { loadRazorpay } from '@/lib/loadRazorpay';

type Props = { open: boolean; onClose: () => void };

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, updateQty, removeFromCart, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { userEmail, isLoggedIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (total <= 0) return;
    setIsProcessing(true);

    try {
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      // Create order on your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, totalAmount: total }),
      });
      const data = await response.json();

      if (!data.success) {
        alert('Server error creating order');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use environment variable
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'SnackPlex Canteen',
        description: 'Food Order Payment',
        order_id: data.order.id, // This is the order ID from your backend
        handler: async function (response: any) {
          // Verify payment on your backend
          const verifyData = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: data.dbOrderId,
            }),
          });
          
          const verifyResult = await verifyData.json();
          if (verifyResult.success) {
            // ✅ SUCCESS: Create the order in the system which sends the email
            try {
              const orderEmail = userEmail || 'guest@example.com';
              // Approximate pickup time (15 mins from now)
              const pickupTime = new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              await addOrder(orderEmail, cart, total, pickupTime);
              alert('Payment Successful! Bill sent to your email.');
            } catch (err) {
              console.error('Order creation error:', err);
              alert('Payment caught, but failed to register order. Please contact support.');
            }
            
            clearCart();
            onClose();
          } else {
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: isLoggedIn ? 'Authenticated User' : 'Foodplex User',
          email: userEmail || 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#FF6B2B'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'UPI / QR Code',
                instruments: [
                  {
                    method: 'upi'
                  }
                ]
              }
            },
            sequence: ['block.upi', 'netbanking', 'card'],
            preferences: {
              show_default_blocks: true
            }
          }
        }
      };

      // @ts-ignore
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error', error);
      alert('Something went wrong!');
    }
    
    setIsProcessing(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col"
            style={{ background: '#1A1A1A', borderLeft: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-orange-400" />
                <h3 className="font-bold text-base sm:text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>Your Cart</h3>
              </div>
              <button onClick={onClose} className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:text-red-400 transition-colors touch-manipulation">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                  <div className="text-5xl sm:text-6xl">🛒</div>
                  <p className="font-medium">Your cart is empty</p>
                  <p className="text-sm text-center">Add items from our delicious menu!</p>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass rounded-xl p-3 flex items-center gap-2 sm:gap-3"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-[#1a1a1a]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-orange-400 text-sm font-bold">
                        {item.price > 0 ? `₹${item.price}` : 'MRP'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 sm:w-6 h-7 sm:h-6 rounded-md bg-orange-500/20 flex items-center justify-center hover:bg-orange-500/40 transition-colors touch-manipulation"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold w-5 sm:w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 sm:w-6 h-7 sm:h-6 rounded-md bg-orange-500/20 flex items-center justify-center hover:bg-orange-500/40 transition-colors touch-manipulation"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors ml-1 touch-manipulation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total</span>
                  <span className="text-xl font-bold gradient-text">₹{total}</span>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-3 sm:py-3 rounded-xl font-bold text-white btn-ripple touch-manipulation disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
                  id="checkout-from-cart"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout →'}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 rounded-xl font-medium text-gray-400 hover:text-red-400 transition-colors text-sm touch-manipulation"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
