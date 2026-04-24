'use client';
import { useState } from 'react';
import { motion, AnimatePresence, type Variants, type Easing } from 'framer-motion';
import { Plus, Star, Flame, Leaf, X, ShoppingCart } from 'lucide-react';
import { menuItems, categories, MenuItem } from '@/lib/menuData';
import { useCart } from '@/lib/cartContext';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' as Easing }
  }),
};

function MenuCard({ item, index, onSelect }: { item: MenuItem; index: number; onSelect: (item: MenuItem) => void }) {
  const { addToCart } = useCart();
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileTap={{ scale: 0.98 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group touch-manipulation"
      style={{ background: 'linear-gradient(145deg, #1e1e1e, #242424)', border: '1px solid rgba(255,255,255,0.07)' }}
      onClick={() => onSelect(item)}
    >
      {/* Tags */}
      <div className="absolute top-3 left-3 z-10 flex gap-1 flex-wrap max-w-[calc(100%-24px)]">
        {item.popular && (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white flex items-center gap-1 shrink-0"
            style={{ background: 'linear-gradient(90deg, #FF6B2B, #E85520)' }}>
            <Flame size={10} /> Hot
          </span>
        )}
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-green-400 glass flex items-center gap-1 shrink-0">
          <Leaf size={9} /> Veg
        </span>
      </div>

      {/* Image display */}
      <div className="flex items-center justify-center h-28 sm:h-32 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden bg-[#1a1a1a]">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-sm sm:text-base leading-snug" style={{ fontFamily: 'Sora, sans-serif' }}>{item.name}</h3>
        </div>
        <p className="text-xs text-gray-400 mb-3 sm:mb-4 leading-relaxed line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-lg font-black gradient-text" style={{ fontFamily: 'Sora, sans-serif' }}>
              {item.price > 0 ? `₹${item.price}` : 'MRP'}
            </p>
            <p className="text-xs text-gray-500">{item.quantity}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={e => { e.stopPropagation(); addToCart(item); }}
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white btn-ripple touch-manipulation"
            style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
          >
            <Plus size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ItemModal({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { addToCart } = useCart();
  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
              style={{ background: '#1e1e1e', border: '1px solid rgba(255,107,43,0.3)' }}>
              <div className="flex items-center justify-center h-36 sm:h-44 shrink-0 relative overflow-hidden bg-[#1a1a1a]">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>
              <div className="p-5 sm:p-6 overflow-y-auto">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h2 className="text-xl sm:text-2xl font-black" style={{ fontFamily: 'Sora, sans-serif' }}>{item.name}</h2>
                  <button onClick={onClose} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white touch-manipulation shrink-0">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
                  <span className="text-gray-400 text-sm">{item.quantity}</span>
                  <span className="text-xs text-green-400 glass px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Leaf size={9} /> Veg
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{item.description}</p>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-2xl sm:text-3xl font-black gradient-text">{item.price > 0 ? `₹${item.price}` : 'MRP'}</p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { addToCart(item); onClose(); }}
                    className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl font-bold text-white btn-ripple touch-manipulation"
                    style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
                    id={`add-to-cart-${item.id}`}
                  >
                    <ShoppingCart size={16} />
                    Add
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filtered = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(i => i.category === activeCategory);

  return (
    <section id="menu" className="section-pad px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-orange-400 font-semibold text-sm tracking-widest uppercase mb-3 block">Our Menu</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Smart <span className="gradient-text">Menu</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Freshly prepared dishes from the GSFC University Canteen kitchen — order ahead, skip the line.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeCategory === cat
                  ? 'text-white glow-orange'
                  : 'glass text-gray-400 hover:text-white'
              }`}
              style={activeCategory === cat ? { background: 'linear-gradient(135deg, #FF6B2B, #E85520)' } : {}}
              id={`cat-${cat.replace(/ /g, '-').toLowerCase()}`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Items Count Removed */}

        {/* Grid */}
        <motion.div
          key={activeCategory}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filtered.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} onSelect={setSelectedItem} />
          ))}
        </motion.div>
      </div>

      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}
