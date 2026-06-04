import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { BookingSection } from './components/BookingSection';
import { StatusSection } from './components/StatusSection';
import { AdminSection } from './components/AdminSection';
import { Footer } from './components/Footer';
import { GoogleLoginSection } from './components/GoogleLoginSection';
import { INITIAL_ORDERS, INITIAL_SPAREPARTS } from './data';
import { Order, Sparepart, LoggedInUser } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Chrome, Lock, Sparkles, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [orders, setOrders] = useState<Order[]>([]);
  const [spareparts, setSpareparts] = useState<Sparepart[]>([]);
  const [prefilledStatusId, setPrefilledStatusId] = useState<string>('');

  // 1. Initial configuration check and loading persistent database simulations
  useEffect(() => {
    // Check if user session already exists in safe localStorage persist state (simulating st.session_state persistence)
    const storedUser = localStorage.getItem('servispro_google_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setLoggedInUser(parsedUser);
        
        // Setup initial default active tab matching the credentials role
        if (parsedUser.role === 'admin') {
          setActiveTab('admin-tech');
        } else {
          setActiveTab('home');
        }
      } catch (err) {
        console.error('Session restore failed', err);
        localStorage.removeItem('servispro_google_user');
      }
    }

    // Orders Database
    const storedOrders = localStorage.getItem('servispro_orders');
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (err) {
        console.error('Failed to parse stored orders', err);
        setOrders(INITIAL_ORDERS);
      }
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('servispro_orders', JSON.stringify(INITIAL_ORDERS));
    }

    // Spareparts Database
    const storedParts = localStorage.getItem('servispro_spareparts');
    if (storedParts) {
      try {
        setSpareparts(JSON.parse(storedParts));
      } catch (err) {
        console.error('Failed to parse stored spareparts', err);
        setSpareparts(INITIAL_SPAREPARTS);
      }
    } else {
      setSpareparts(INITIAL_SPAREPARTS);
      localStorage.setItem('servispro_spareparts', JSON.stringify(INITIAL_SPAREPARTS));
    }
  }, []);

  // Update persistent state handles
  const handleUpdateSpareparts = (newSpareparts: Sparepart[]) => {
    setSpareparts(newSpareparts);
    localStorage.setItem('servispro_spareparts', JSON.stringify(newSpareparts));
  };

  const handleAddOrder = (newOrder: Order) => {
    // If the logged in user is a customer, optionally record their email inside the order
    const orderWithEmail = {
      ...newOrder,
      customerEmail: loggedInUser?.email || newOrder.customerEmail || 'sukamatchaecaa2@gmail.com'
    };
    const updated = [orderWithEmail, ...orders];
    setOrders(updated);
    localStorage.setItem('servispro_orders', JSON.stringify(updated));
  };

  const handleUpdateOrder = (orderId: string, updatedFields: Partial<Order>) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          ...updatedFields,
        };
      }
      return order;
    });
    setOrders(updated);
    localStorage.setItem('servispro_orders', JSON.stringify(updated));
  };

  // Safe user login trigger
  const handleLogin = (user: LoggedInUser) => {
    setLoggedInUser(user);
    localStorage.setItem('servispro_google_user', JSON.stringify(user));
    
    // Dynamic tab routing based on authorization levels
    if (user.role === 'admin') {
      setActiveTab('admin-tech');
    } else {
      setActiveTab('home');
    }
  };

  // Safe user logout trigger
  const handleSignOut = () => {
    setLoggedInUser(null);
    localStorage.removeItem('servispro_google_user');
    setActiveTab('home');
  };

  // Navigate directly to track order progress
  const handleNavigateToStatus = (orderId: string) => {
    setPrefilledStatusId(orderId);
    setActiveTab('status');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased" id="servispro-app-root">
      {/* 1. Header Bar with conditional elements linked with Google authorization state */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loggedInUser={loggedInUser}
        onSignOut={handleSignOut}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-hidden flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {!loggedInUser ? (
            /* UNAUTHENTICATED GATEWAY - Renders the Google Simulated Login block */
            <motion.div
              key="login-view animate-fade-in"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-xl mx-auto py-4"
            >
              {/* Promo Welcome Banner */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 mb-6 border border-slate-800 flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full filter blur-3xl opacity-20 -z-0"></div>
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-brand-405 bg-brand-950/50 px-2 py-0.5 rounded-md border border-brand-800/40">Sistem Servis Terpadu</span>
                  <h3 className="text-lg font-bold">ServisPro Premium</h3>
                  <p className="text-xs text-slate-400">Selamat datang kembali! Silakan masuk dengan akun Gmail Anda untuk memulai pendaftaran order servis, memantau riwayat antrean secara transparan, atau mengelola operasional bengkel.</p>
                </div>
              </div>

              {/* Central Auth Screen */}
              <GoogleLoginSection onLogin={handleLogin} />
            </motion.div>
          ) : (
            /* AUTHENTICATED WORKSPACE */
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full flex-1"
            >
              {/* CUSTOMER TABS */}
              {loggedInUser.role === 'customer' && (
                <>
                  {activeTab === 'home' && (
                    <HomeSection 
                      onStartBooking={() => setActiveTab('booking')}
                      onCheckStatus={() => setActiveTab('status')}
                    />
                  )}

                  {activeTab === 'booking' && (
                    <BookingSection 
                      onAddOrder={handleAddOrder}
                      onNavigateToStatus={handleNavigateToStatus}
                    />
                  )}

                  {activeTab === 'status' && (
                    <StatusSection 
                      orders={orders}
                      prefilledId={prefilledStatusId}
                      onClearPrefilledId={() => setPrefilledStatusId('')}
                    />
                  )}
                </>
              )}

              {/* ADMIN & OWNER TABS */}
              {loggedInUser.role === 'admin' && (
                <>
                  {activeTab === 'admin-tech' && (
                    <AdminSection 
                      orders={orders}
                      onUpdateOrder={handleUpdateOrder}
                      onNavigateToStatus={handleNavigateToStatus}
                      spareparts={spareparts}
                      onUpdateSpareparts={handleUpdateSpareparts}
                      initialSubTab="technician"
                    />
                  )}

                  {activeTab === 'admin-owner' && (
                    <AdminSection 
                      orders={orders}
                      onUpdateOrder={handleUpdateOrder}
                      onNavigateToStatus={handleNavigateToStatus}
                      spareparts={spareparts}
                      onUpdateSpareparts={handleUpdateSpareparts}
                      initialSubTab="owner"
                    />
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Corporate aesthetic Footer with maps & info */}
      <Footer />
    </div>
  );
}
