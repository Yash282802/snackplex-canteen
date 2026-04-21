'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface Order {
  id: string;
  email: string;
  items: { name: string; price: number; qty: number; emoji: string }[];
  total: number;
  status: 'placed' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
  pickupTime: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (email: string, items: Order['items'], total: number, pickupTime: string) => Promise<Order>;
  updateStatus: (id: string, status: Order['status']) => void;
  getOrderById: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html }),
    });
    const data = await res.json();
    console.log('📧 Email sent:', data.success ? 'SUCCESS' : 'FAILED');
  } catch (err) {
    console.log('📧 Email API error (using fallback):', err);
  }
}

function getVendorOrderEmailHtml(order: Order) {
  const itemsList = order.items.map(item => `<li>${item.emoji} ${item.name} x${item.qty} - ₹${item.price * item.qty}</li>`).join('');
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #fff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #FF6B2B; margin: 0;">SNACKPLEX</h1>
        <p style="color: #888;">New Order Received!</p>
      </div>
      <h2 style="color: #22C55E;">🛒 New Order #${order.id}</h2>
      <div style="background: #2a2a2a; padding: 15px; border-radius: 10px; margin: 15px 0;">
        <p style="margin: 5px 0;"><strong>Customer Email:</strong> ${order.email}</p>
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.id}</p>
        <p style="margin: 5px 0;"><strong>Pickup Time:</strong> ${order.pickupTime}</p>
        <p style="margin: 5px 0;"><strong>Total Amount:</strong> <span style="color: #22C55E; font-size: 18px;">₹${order.total}</span></p>
      </div>
      <h3>Order Items:</h3>
      <ul style="color: #ccc; font-size: 14px;">${itemsList}</ul>
      <p style="color: #888; font-size: 12px;">Please prepare this order for pickup.</p>
    </div>
  `;
}

function getOrderEmailHtml(order: Order, type: 'confirmation' | 'delivery') {
  const itemsList = order.items.map(item => `<li>${item.emoji} ${item.name} x${item.qty} - ₹${item.price * item.qty}</li>`).join('');
  
  if (type === 'confirmation') {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #fff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #FF6B2B; margin: 0;">SNACKPLEX</h1>
          <p style="color: #888;">GSFC University Canteen</p>
        </div>
        <h2 style="color: #22C55E;">✅ Order Confirmed!</h2>
        <p>Thank you for your order, <strong>${order.email}</strong>!</p>
        <div style="background: #2a2a2a; padding: 15px; border-radius: 10px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.id}</p>
          <p style="margin: 5px 0;"><strong>Pickup Time:</strong> ${order.pickupTime}</p>
          <p style="margin: 5px 0;"><strong>Total:</strong> ₹${order.total}</p>
        </div>
        <h3>Order Details:</h3>
        <ul style="color: #ccc;">${itemsList}</ul>
        <p style="color: #888; font-size: 14px;">We'll notify you when your order is ready for pickup!</p>
      </div>
    `;
  } else {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #fff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #FF6B2B; margin: 0;">SNACKPLEX</h1>
          <p style="color: #888;">GSFC University Canteen</p>
        </div>
        <h2 style="color: #FFD700;">🎉 Order Delivered!</h2>
        <p>Your order has been delivered, <strong>${order.email}</strong>!</p>
        <div style="background: #2a2a2a; padding: 15px; border-radius: 10px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.id}</p>
          <p style="margin: 5px 0;"><strong>Total Paid:</strong> ₹${order.total}</p>
        </div>
        <h3>What you ordered:</h3>
        <ul style="color: #ccc;">${itemsList}</ul>
        <p style="color: #FF6B2B; font-size: 18px; text-align: center;">Thank you for ordering with SNACKPLEX! 🍽️</p>
        <p style="color: #888; font-size: 14px;">See you again soon!</p>
      </div>
    `;
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders`);
      const mappedOrders: Order[] = response.data.map((o: any) => ({
        id: o._id,
        email: o.email || 'guest@example.com',
        items: o.items,
        total: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt,
        pickupTime: o.pickupTime || 'Now',
      }));
      setOrders(mappedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      const saved = localStorage.getItem('snackplex_orders');
      if (saved) setOrders(JSON.parse(saved));
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const addOrder = async (email: string, items: Order['items'], total: number, pickupTime: string): Promise<Order> => {
    let backendOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    try {
      const resp = await axios.post(`${API_BASE_URL}/api/orders/simulate`, {
        email, items, totalAmount: total, pickupTime, status: 'placed'
      });
      if (resp.data.success) backendOrderId = resp.data.order._id;
    } catch (err) {
      console.error('Backend simulated order failed:', err);
    }

    const newOrder: Order = {
      id: backendOrderId,
      email,
      items,
      total,
      status: 'placed',
      createdAt: new Date().toISOString(),
      pickupTime,
    };
    
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('snackplex_orders', JSON.stringify(updatedOrders));
    
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', order: newOrder }),
      });
    } catch (e) { console.log('Excel save error:', e); }

    await sendEmail(email, `Order Confirmed - ${newOrder.id} | SNACKPLEX`, getOrderEmailHtml(newOrder, 'confirmation'));
    const vendorEmail = process.env.NEXT_PUBLIC_VENDOR_EMAIL || 'canteen@snackplex.edu';
    await sendEmail(vendorEmail, `🛒 New Order - ${newOrder.id} | SNACKPLEX`, getVendorOrderEmailHtml(newOrder));
    
    return newOrder;
  };

  const updateStatus = async (id: string, status: Order['status']) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/orders/${id}`, { status });
    } catch (err) {
      console.error('Backend status update failed:', err);
    }

    const updatedOrders = orders.map(order => order.id === id ? { ...order, status } : order);
    setOrders(updatedOrders);
    localStorage.setItem('snackplex_orders', JSON.stringify(updatedOrders));

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', order: { id, status } }),
      });
    } catch (e) { console.log('Excel update error:', e); }
    
    const order = orders.find(o => o.id === id);
    if (order && status === 'delivered') {
      await sendEmail(order.email, `Order Delivered - ${id} | SNACKPLEX`, getOrderEmailHtml(order, 'delivery'));
    }
  };

  const getOrderById = (id: string) => orders.find(o => o.id === id);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateStatus, getOrderById, refreshOrders: fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}