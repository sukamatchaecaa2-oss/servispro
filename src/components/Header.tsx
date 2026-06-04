import React, { useState } from 'react';
import { Wrench, Phone, Clock, LogOut, ShieldAlert, BadgeInfo, Chrome, Sparkles } from 'lucide-react';
import { SHOP_INFO } from '../data';
import { LoggedInUser } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loggedInUser: LoggedInUser | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, loggedInUser, onSignOut }) => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm" id="servispro-header">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-xs font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              {SHOP_INFO.hours}
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              WhatsApp Admin: <a href={`https://wa.me/${SHOP_INFO.whatsapp}`} className="hover:text-brand-300 transition-colors font-medium">{SHOP_INFO.whatsappDisplay}</a>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {loggedInUser ? (
              <span className={`flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                loggedInUser.role === 'admin' 
                  ? 'bg-rose-950/60 text-red-200 border border-red-700' 
                  : 'bg-indigo-950/60 text-indigo-200 border border-indigo-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${loggedInUser.role === 'admin' ? 'bg-red-400' : 'bg-indigo-400'} animate-pulse`}></span>
                AKSES: {loggedInUser.role === 'admin' ? 'ADMIN / OWNER' : 'PELANGGAN'}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                Silakan login dengan Gmail Anda untuk melanjutkan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 select-none" id="logo-branding">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-420 flex items-center justify-center text-white shadow-md shadow-brand-200 shrink-0">
              <Wrench className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-display">Servis<span className="text-brand-500">Pro</span></span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold bg-brand-50 text-brand-600 rounded border border-brand-200">Premium</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Sistem Servis Barang Elektronik & Google Auth</p>
            </div>
          </div>

          {/* Controls right align */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Dynamic Navigation Tabs list depending on Google account details */}
            {loggedInUser && (
              <nav className="flex items-center bg-slate-100 p-1 rounded-xl" id="main-navigation">
                {loggedInUser.role === 'admin' ? (
                  <>
                    <button
                      onClick={() => setActiveTab('admin-tech')}
                      className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                        activeTab === 'admin-tech'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      id="nav-tab-admin-tech"
                    >
                      Panel Operasional Teknisi
                    </button>
                    <button
                      onClick={() => setActiveTab('admin-owner')}
                      className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                        activeTab === 'admin-owner'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      id="nav-tab-admin-owner"
                    >
                      Dashboard Owner & Keuangan
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveTab('home')}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                        activeTab === 'home'
                          ? 'bg-white text-brand-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      id="nav-tab-home"
                    >
                      Home & Info Layanan
                    </button>
                    <button
                      onClick={() => setActiveTab('booking')}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                        activeTab === 'booking'
                          ? 'bg-white text-brand-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      id="nav-tab-booking"
                    >
                      Form Booking
                    </button>
                    <button
                      onClick={() => setActiveTab('status')}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                        activeTab === 'status'
                          ? 'bg-white text-brand-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      id="nav-tab-status"
                    >
                      Cek Status
                    </button>
                  </>
                )}
              </nav>
            )}

            {/* Simulated Google Profile circle dropdown widget */}
            {loggedInUser && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="flex items-center gap-2 p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all duration-200 cursor-pointer shrink-0"
                  id="google-profile-account-btn"
                >
                  <img
                    src={loggedInUser.avatarUrl}
                    alt={loggedInUser.name}
                    className="w-8 h-8 rounded-full border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left hidden lg:block pr-3">
                    <div className="text-[11px] font-bold text-slate-800 leading-tight max-w-[100px] truncate">{loggedInUser.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono leading-none">{loggedInUser.email}</div>
                  </div>
                </button>

                {/* Dropdown popup */}
                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-200 rounded-3xl shadow-xl z-50 p-4 space-y-4 animate-fade-in text-xs">
                    <div className="text-center space-y-2 pb-3 border-b border-slate-100">
                      <img
                        src={loggedInUser.avatarUrl}
                        alt={loggedInUser.name}
                        className="w-12 h-12 rounded-full border border-slate-300 mx-auto bg-slate-150"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm leading-tight">{loggedInUser.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 leading-tight select-all">{loggedInUser.email}</div>
                      </div>
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] font-extrabold rounded-full ${
                        loggedInUser.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-brand-50 text-brand-600 border border-brand-200'
                      }`}>
                        {loggedInUser.role === 'admin' ? 'Administrator' : 'Pelanggan'}
                      </span>
                    </div>

                    <div className="text-slate-500 font-medium leading-relaxed px-1">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Keterangan Sesi</div>
                      Akun Gmail Anda mendikte sistem secara dinamis. Anda dapat beralih akun kapan saja untuk mencoba role lainnya.
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAccountDropdown(false);
                        onSignOut();
                      }}
                      className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer"
                      id="google-quick-signout-btn"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Keluar Akun Google
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
