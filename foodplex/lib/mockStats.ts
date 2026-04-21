'use client';
import { useState, useEffect } from 'react';

import { useOrders } from './orderContext';

export function useLiveStats() {
  const { orders } = useOrders();
  
  const queueOrders = orders.filter(o => o.status === 'placed' || o.status === 'preparing');
  const queueCount = queueOrders.length;
  const crowdLevel: 'Low' | 'Medium' | 'High' = queueCount < 8 ? 'Low' : queueCount < 18 ? 'Medium' : 'High';
  const waitTime = Math.max(3, queueCount * 2);

  const today = new Date().toDateString();
  const todayOrdersLength = orders.filter(o => new Date(o.createdAt).toDateString() === today).length;

  return { orders: todayOrdersLength, waitTime, crowdLevel, queueCount };
}

export function useTotalOrdersToday() {
  const { orders } = useOrders();
  const today = new Date().toDateString();
  return orders.filter(o => new Date(o.createdAt).toDateString() === today).length;
}

export function useTodayRevenue() {
  const { orders } = useOrders();
  const today = new Date().toDateString();
  return orders.filter(o => new Date(o.createdAt).toDateString() === today)
               .reduce((sum, o) => sum + o.total, 0);
}

export function useDashboardStats() {
  const { orders } = useOrders();
  
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const revMap: Record<number, number> = {};
  hours.forEach(h => revMap[h] = 0);
  
  todayOrders.forEach(o => {
    const d = new Date(o.createdAt);
    let h = d.getHours();
    if (h < 8) h = 8;
    if (h > 17) h = 17;
    if (revMap[h] !== undefined) {
      revMap[h] += o.total;
    }
  });

  const revenueData = hours.map(h => ({
    time: h > 12 ? `${h-12}PM` : h === 12 ? '12PM' : `${h}AM`,
    revenue: revMap[h]
  }));

  const itemMap: Record<string, number> = {};
  orders.forEach(o => {
    o.items.forEach(i => {
      itemMap[i.name] = (itemMap[i.name] || 0) + i.qty;
    });
  });
  
  const sortedItems = Object.entries(itemMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, orders]) => ({ name, orders }));
  
  const topItems = sortedItems.length > 0 ? sortedItems : [
    { name: '', orders: 0 }
  ];

  const heatMapRecord: Record<string, Record<number, number>> = {
    'Mon': {}, 'Tue': {}, 'Wed': {}, 'Thu': {}, 'Fri': {}, 'Sat': {}, 'Sun': {}
  };
  orders.forEach(o => {
    const d = new Date(o.createdAt);
    const dayStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
    let h = d.getHours();
    if (h < 8) h = 8;
    if (h > 17) h = 17;
    if (heatMapRecord[dayStr]) {
       heatMapRecord[dayStr][h] = (heatMapRecord[dayStr][h] || 0) + 1;
    }
  });

  const heatmapData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
    const hCounts = heatMapRecord[day];
    const peakHours = [];
    for (const h in hCounts) {
      if (hCounts[h] > 0) peakHours.push(Number(h));
    }
    return { day, peak: peakHours };
  });

  return { topItems, revenueData, heatmapData };
}

export const predictionData = [
  { time: '8AM', orders: 12 },
  { time: '9AM', orders: 35 },
  { time: '10AM', orders: 28 },
  { time: '11AM', orders: 65 },
  { time: '12PM', orders: 145 },
  { time: '1PM', orders: 180 },
  { time: '2PM', orders: 90 },
  { time: '3PM', orders: 45 },
  { time: '4PM', orders: 55 },
  { time: '5PM', orders: 30 },
  { time: '6PM', orders: 15 },
];

export const inventoryData = [
  { name: 'Masala Maggi', percent: 75, color: '#FF6B2B' },
  { name: 'Dosa Batter', percent: 45, color: '#FFD700' },
  { name: 'Bread', percent: 60, color: '#22C55E' },
  { name: 'Cheese', percent: 30, color: '#EF4444' },
  { name: 'Paneer', percent: 55, color: '#8B5CF6' },
  { name: 'Vegetables', percent: 80, color: '#06B6D4' },
];


