'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface InventoryItem {
  id: string;
  name: string;
  percent: number;
  color: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (name: string, percent: number) => void;
  updatePercent: (id: string, newPercent: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const defaultItems: InventoryItem[] = [
  { id: '1', name: 'Masala Maggi', percent: 75, color: '#FF6B2B' },
  { id: '2', name: 'Dosa Batter', percent: 45, color: '#FFD700' },
  { id: '3', name: 'Bread', percent: 60, color: '#22C55E' },
  { id: '4', name: 'Cheese', percent: 30, color: '#EF4444' },
  { id: '5', name: 'Paneer', percent: 55, color: '#8B5CF6' },
  { id: '6', name: 'Vegetables', percent: 80, color: '#06B6D4' },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('snackplex_inventory');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(defaultItems);
      localStorage.setItem('snackplex_inventory', JSON.stringify(defaultItems));
    }
  }, []);

  const addItem = (name: string, percent: number) => {
    const colors = ['#FF6B2B', '#FFD700', '#22C55E', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name,
      percent: Math.max(0, Math.min(100, percent)),
      color: newColor
    };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem('snackplex_inventory', JSON.stringify(updated));
  };

  const updatePercent = (id: string, newPercent: number) => {
    const p = Math.max(0, Math.min(100, newPercent));
    const updated = items.map(item => item.id === id ? { ...item, percent: p } : item);
    setItems(updated);
    localStorage.setItem('snackplex_inventory', JSON.stringify(updated));
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, updatePercent }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
