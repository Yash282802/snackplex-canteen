'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, TrendingUp, Flame, Package, CheckCircle, Clock, XCircle, Database, Plus } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { useDashboardStats, useTotalOrdersToday, useTodayRevenue } from '@/lib/mockStats';
import { useOrders, Order } from '@/lib/orderContext';
import { useInventory } from '@/lib/inventoryContext';



const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function HeatmapCell({ active, intensity }: { active: boolean; intensity: number }) {
  const alpha = active ? 0.2 + intensity * 0.7 : 0.05;
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      className="w-8 h-8 rounded-md"
      style={{
        background: active
          ? `rgba(255, 107, 43, ${alpha})`
          : 'rgba(255,255,255,0.04)',
        border: active ? `1px solid rgba(255,107,43,${alpha + 0.1})` : '1px solid rgba(255,255,255,0.05)',
      }}
      title={active ? `High traffic` : 'Low traffic'}
    />
  );
}

export default function AdminSection() {
  const [loaded, setLoaded] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const totalOrders = useTotalOrdersToday();
  const todayRevenue = useTodayRevenue();
  const { orders, updateStatus } = useOrders();
  const { topItems, revenueData, heatmapData } = useDashboardStats();
  const { items: inventoryItems, addItem, updatePercent } = useInventory();

  const [showAddInv, setShowAddInv] = useState(false);
  const [invName, setInvName] = useState('');
  const [invPercent, setInvPercent] = useState(100);

  const handleAddInv = () => {
    if (invName.trim()) {
      addItem(invName, invPercent);
      setInvName('');
      setInvPercent(100);
      setShowAddInv(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(t);
  }, []);



  const topDish = topItems.length > 0 && topItems[0].name !== '' ? topItems[0].name : 'No orders yet';

  return (
    <section id="admin" className="section-pad px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-orange-400 font-semibold text-sm tracking-widest uppercase mb-3 block">Admin View</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Dashboard <span className="gradient-text">Preview</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Real-time operations overview — orders, revenue, and peak hour heatmap.
          </p>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString()}`, sub: 'From orders', color: '#22C55E', emoji: '💰' },
            { label: 'Total Orders', value: totalOrders.toString(), sub: 'Today', color: '#FF6B2B', emoji: '📦' },
            { label: 'Top Dish', value: topDish, sub: 'Based on orders', color: '#FFD700', emoji: '🏆' },
            { label: 'Active Staff', value: '6', sub: 'All stations live', color: '#8B5CF6', emoji: '👨‍🍳' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-4"
              style={{ border: `1px solid ${s.color}25` }}
            >
              <div className="text-2xl mb-2">{s.emoji}</div>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="font-black text-xl" style={{ fontFamily: 'Sora, sans-serif', color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6"
            style={{ border: '1px solid rgba(34,197,94,0.15)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-green-400" />
              <h3 className="font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Revenue Today</h3>
              <span className="ml-auto text-sm font-bold text-green-400">₹{todayRevenue.toLocaleString()}</span>
            </div>
            {!loaded ? (
              <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="skeleton h-10 w-full"/>)}</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3"/>
                  <XAxis dataKey="time" tick={{ fill:'#6B7280', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:'#6B7280', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <Tooltip
                    contentStyle={{ background:'#1e1e1e', border:'1px solid rgba(34,197,94,0.3)', borderRadius:12, color:'#fff' }}
                    formatter={(v: unknown)=>[`₹${v as number}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2.5} fill="url(#revGrad)"/>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Top Items Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6"
            style={{ border: '1px solid rgba(255,107,43,0.15)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Flame size={18} className="text-orange-400"/>
              <h3 className="font-bold" style={{ fontFamily:'Sora, sans-serif' }}>Most Ordered</h3>
              <span className="ml-auto text-xs text-orange-400 glass px-2 py-1 rounded-full">Today</span>
            </div>
            {!loaded ? (
              <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="skeleton h-10 w-full"/>)}</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topItems} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" horizontal={false}/>
                  <XAxis type="number" tick={{ fill:'#6B7280', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis dataKey="name" type="category" tick={{ fill:'#9CA3AF', fontSize:11 }} axisLine={false} tickLine={false} width={90}/>
                  <Tooltip
                    contentStyle={{ background:'#1e1e1e', border:'1px solid rgba(255,107,43,0.3)', borderRadius:12, color:'#fff' }}
                    formatter={(v: unknown)=>[`${v as number} orders`, 'Count']}
                  />
                  <Bar dataKey="orders" fill="#FF6B2B" radius={[0,6,6,0]}
                    background={{ fill:'rgba(255,255,255,0.03)', radius:6 }}/>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* Inventory Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 mb-6"
          style={{ border: '1px solid rgba(255,107,43,0.15)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-orange-400" />
              <h3 className="font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Live Inventory</h3>
            </div>
            <button
              onClick={() => setShowAddInv(!showAddInv)}
              className="glass p-2 rounded-xl text-gray-300 hover:text-white transition-colors flex items-center justify-center"
              title="Add Item"
            >
              {showAddInv ? <XCircle size={18} /> : <Plus size={18} />}
            </button>
          </div>

          <AnimatePresence>
            {showAddInv && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="p-4 rounded-2xl glass flex flex-wrap gap-4 items-end" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs text-gray-400 mb-1">Item Name</p>
                    <input
                      type="text"
                      value={invName}
                      onChange={e => setInvName(e.target.value)}
                      placeholder="e.g. Milk"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div className="w-24">
                    <p className="text-xs text-gray-400 mb-1">Percent Left (%)</p>
                    <input
                      type="number"
                      value={invPercent}
                      onChange={e => setInvPercent(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <button
                    onClick={handleAddInv}
                    className="px-4 py-2 rounded-xl font-bold text-sm text-white transition-transform hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
                  >
                    Add Component
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventoryItems.map(item => (
              <div key={item.id} className="relative group">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.percent}
                      onChange={(e) => updatePercent(item.id, Number(e.target.value))}
                      className="w-14 bg-transparent border-b border-white/20 text-right text-xs focus:outline-none focus:border-white transition-colors"
                      title="Edit percent"
                    />
                    <span className="text-xs text-gray-400">%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6"
          style={{ border: '1px solid rgba(255,107,43,0.15)' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={18} className="text-orange-400"/>
            <h3 className="font-bold" style={{ fontFamily:'Sora, sans-serif' }}>Peak Hours Heatmap</h3>
            <span className="ml-auto text-xs text-gray-400">🔴 = High traffic</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Hour labels */}
              <div className="flex gap-2 mb-2 ml-14">
                {hours.map(h => (
                  <div key={h} className="w-8 text-center text-xs text-gray-500">{h}</div>
                ))}
              </div>
              {/* Rows */}
              {heatmapData.map((row, ri) => (
                <div key={ri} className="flex items-center gap-2 mb-2">
                  <span className="w-12 text-xs text-gray-400 text-right shrink-0">{row.day}</span>
                  {hours.map((h, hi) => {
                    const isPeak = row.peak.includes(h);
                    const intensity = isPeak
                      ? (row.peak.indexOf(h) === Math.floor(row.peak.length / 2) ? 1 : 0.6)
                      : 0;
                    return (
                      <motion.div
                        key={hi}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: ri * 0.05 + hi * 0.03 }}
                      >
                        <HeatmapCell active={isPeak} intensity={intensity} />
                      </motion.div>
                    );
                  })}
                </div>
              ))}
              {/* Legend */}
              <div className="flex items-center gap-3 mt-4 ml-14">
                <span className="text-xs text-gray-500">Low</span>
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((a, i) => (
                  <div key={i} className="w-6 h-4 rounded" style={{ background: `rgba(255,107,43,${a})` }}/>
                ))}
                <span className="text-xs text-gray-500">High</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-orange-400" />
              <h3 className="font-bold text-xl" style={{ fontFamily: 'Sora, sans-serif' }}>Order Management</h3>
            </div>
            <button
              onClick={() => setShowOrders(!showOrders)}
              className="px-4 py-2 rounded-xl font-semibold text-sm text-white btn-ripple"
              style={{ background: 'linear-gradient(135deg, #FF6B2B, #E85520)' }}
            >
              {showOrders ? 'Hide Orders' : 'View All Orders'}
            </button>
          </div>

          {showOrders && (
            <div className="glass rounded-3xl p-6 overflow-x-auto" style={{ border: '1px solid rgba(255,107,43,0.15)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Order ID</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Email</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Items</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Total</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Pickup</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Status</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">No orders yet. Orders will appear here.</td>
                    </tr>
                  ) : (
                    orders.map((order, i) => {
                      const statusOptions: Order['status'][] = ['placed', 'preparing', 'ready', 'delivered'];
                      const itemsStr = order.items.map(item => `${item.emoji} ${item.name} x${item.qty}`).join(', ');
                      return (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-3 font-mono text-orange-400 text-xs">{order.id}</td>
                          <td className="py-3 px-3 text-gray-300">{order.email}</td>
                          <td className="py-3 px-3 text-gray-300 max-w-xs truncate">{itemsStr}</td>
                          <td className="py-3 px-3 font-bold text-green-400">₹{order.total}</td>
                          <td className="py-3 px-3 text-gray-300">{order.pickupTime}</td>
                          <td className="py-3 px-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'ready' ? 'bg-yellow-500/20 text-yellow-400' :
                              order.status === 'preparing' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-orange-500/20 text-orange-400'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1">
                              {statusOptions.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => updateStatus(order.id, status)}
                                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                                    order.status === status
                                      ? 'bg-orange-500 text-white'
                                      : 'glass text-gray-400 hover:text-white'
                                  }`}
                                  title={`Mark as ${status}`}
                                >
                                  {status === 'placed' && '📦'}
                                  {status === 'preparing' && '🔥'}
                                  {status === 'ready' && '✅'}
                                  {status === 'delivered' && '🎉'}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
