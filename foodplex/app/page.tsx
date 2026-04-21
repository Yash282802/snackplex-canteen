'use client';
import { AuthProvider, useAuth } from '@/lib/authContext';
import { CartProvider } from '@/lib/cartContext';
import { OrderProvider } from '@/lib/orderContext';
import { InventoryProvider } from '@/lib/inventoryContext';
import LoginPage from '@/components/sections/LoginPage';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import HeroSection from '@/components/sections/HeroSection';
import MenuSection from '@/components/sections/MenuSection';
import LiveStatusSection from '@/components/sections/LiveStatusSection';
import AISection from '@/components/sections/AISection';
import OrderFlowSection from '@/components/sections/OrderFlowSection';
import CheckoutSection from '@/components/sections/CheckoutSection';
import AdminSection from '@/components/sections/AdminSection';

function MainContent() {
  const { isLoggedIn, userRole, login, logout } = useAuth();

  if (!isLoggedIn) {
    return <LoginPage onLogin={login} />;
  }

  if (userRole === 'staff') {
    return (
      <CartProvider>
        <Navbar isStaff />
        <main>
          <AdminSection />
          <LiveStatusSection />
          <AISection />
        </main>
        <Footer />
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <Navbar />
      <main>
        <HeroSection />
        <MenuSection />
        <LiveStatusSection />
        <OrderFlowSection />
        <CheckoutSection />
      </main>
      <Footer />
    </CartProvider>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <OrderProvider>
        <InventoryProvider>
          <MainContent />
        </InventoryProvider>
      </OrderProvider>
    </AuthProvider>
  );
}