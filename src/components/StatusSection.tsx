import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  Smartphone, 
  Activity, 
  HelpCircle, 
  Hourglass, 
  Wrench, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  QrCode,
  DollarSign,
  Calendar,
  Send,
  Sparkles
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { SHOP_INFO } from '../data';

interface StatusSectionProps {
  orders: Order[];
  prefilledId?: string;
  onClearPrefilledId?: () => void;
}

export const StatusSection: React.FC<StatusSectionProps> = ({ orders, prefilledId, onClearPrefilledId }) => {
  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto search if prefilledId is provided from checkout or admin selection
  useEffect(() => {
    if (prefilledId) {
      setSearchId(prefilledId);
      triggerSearch(prefilledId);
      if (onClearPrefilledId) onClearPrefilledId();
    }
  }, [prefilledId]);

  const triggerSearch = (queryId: string) => {
    const cleanQuery = queryId.replace(/\s+/g, '').toLowerCase();
    if (!cleanQuery) {
      setSearchedOrder(null);
      setHasSearched(false);
      return;
    }

    const found = orders.find(
      (order) => order.id.replace(/\s+/g, '').toLowerCase() === cleanQuery
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(searchId);
  };

  const handleQuickClick = (id: string) => {
    setSearchId(id);
    triggerSearch(id);
  };

  // Status styling map helper
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Menunggu Antrean':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          indicator: 'bg-amber-500',
          label: 'Menunggu Antrean',
          icon: <Hourglass className="w-4 h-4 text-amber-500" />
        };
      case 'Sedang Dicek':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          indicator: 'bg-blue-500',
          label: 'Sedang Dicek',
          icon: <Search className="w-4 h-4 text-blue-500" />
        };
      case 'Sedang Diperbaiki':
        return {
          bg: 'bg-orange-50 border-orange-200 text-orange-700',
          indicator: 'bg-orange-500',
          label: 'Sedang Diperbaiki',
          icon: <Wrench className="w-4 h-4 text-orange-500" />
        };
      case 'Selesai Siap Diambil':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          indicator: 'bg-emerald-500',
          label: 'Selesai Siap Diambil',
          icon: <CheckCircle className="w-4 h-4 text-emerald-500" />
        };
      case 'Gagal Diperbaiki':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          indicator: 'bg-rose-500',
          label: 'Gagal Diperbaiki',
          icon: <XCircle className="w-4 h-4 text-rose-500" />
        };
    }
  };

  // Price formatter
  const formatCost = (val: number, status: OrderStatus) => {
    if (val === 0) {
      if (status === 'Menunggu Antrean' || status === 'Sedang Dicek') {
        return 'Menunggu Estimasi Teknisi (Belum Ditentukan)';
      }
      return 'Bebas Biaya / Gratis';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const getTimelineSteps = (currentStatus: OrderStatus) => {
    const steps: { name: OrderStatus; desc: string }[] = [
      { name: 'Menunggu Antrean', desc: 'Sistem mencatat pesanan Anda & unit masuk antrean.' },
      { name: 'Sedang Dicek', desc: 'Teknisi melakukan diagnosis kerusakan sirkuit & komponen.' },
      { name: 'Sedang Diperbaiki', desc: 'Proses reparasi fisik, solder, & penggantian sparepart.' },
      { name: 'Selesai Siap Diambil', desc: 'Pengecekan kualitas akhir sukses & barang siap diambil.' }
    ];

    // If failed, make a custom timeline step or keep failed visible
    if (currentStatus === 'Gagal Diperbaiki') {
      return [
        { name: 'Menunggu Antrean' as OrderStatus, desc: 'Unit masuk antrean' },
        { name: 'Sedang Dicek' as OrderStatus, desc: 'Diagnosa teknisi dilakukan' },
        { name: 'Gagal Diperbaiki' as OrderStatus, desc: 'Sulit diperbaiki / sparepart langka. Barang siap dikembalikan.' }
      ];
    }

    return steps;
  };

  const getTimelineStepIndex = (currentStatus: OrderStatus, steps: { name: OrderStatus }[]) => {
    return steps.findIndex(step => step.name === currentStatus);
  };

  // WA admin query template
  const getWaContactUrl = (order: Order) => {
    const text = `Halo Admin ${SHOP_INFO.name}, saya ingin menanyakan status pengerjaan pesanan servis saya:
*ID Order*: ${order.id}
*Nama*: ${order.customerName}
*Unit*: ${order.brandType}
*Status Saat Ini*: ${order.status}
*Catatan Terakhir*: ${order.technicianNotes}

Apakah ada estimasi waktu selesai atau tambahan biaya lainnya? Terima kasih banyak.`;
    return `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const currentSteps = searchedOrder ? getTimelineSteps(searchedOrder.status) : [];
  const activeStepIdx = searchedOrder ? getTimelineStepIndex(searchedOrder.status, currentSteps) : -1;

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in" id="status-section-container">
      {/* 1. Search Box Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="text-center max-w-md mx-auto space-y-2">
          <div className="w-10 h-10 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-brand-500 mx-auto">
            <QrCode className="w-5.5 h-5.5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">Portal Cek Status Perbaikan</h2>
          <p className="text-xs sm:text-sm text-slate-500">Masukkan ID Order digital Anda untuk memantau detail pengerjaan, estimasi biaya, dan catatan teknisi secara real-time.</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center gap-2 pt-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              required
              placeholder="Contoh: SP-2026-61842"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 font-mono font-bold tracking-wider placeholder:font-sans placeholder:font-normal placeholder:tracking-normal border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              id="search-status-id-input"
            />
          </div>
          <button
            type="submit"
            className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm tracking-wide transition shrink-0 cursor-pointer"
            id="search-status-submit-btn"
          >
            Cari Order
          </button>
        </form>

        {/* Quick Navigation Suggestions */}
        <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Contoh ID Order Aktif:</span>
          <div className="flex flex-wrap gap-1.5">
            {orders.slice(0, 4).map((ord) => (
              <button
                key={ord.id}
                onClick={() => handleQuickClick(ord.id)}
                className={`px-2 py-1 font-mono font-bold rounded-lg border text-[11px] transition cursor-pointer ${
                  searchId.toLowerCase() === ord.id.toLowerCase()
                    ? 'bg-brand-50 border-brand-300 text-brand-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                id={`quick-search-tag-${ord.id}`}
              >
                {ord.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Search Result Panel */}
      {hasSearched ? (
        searchedOrder ? (
          <div className="space-y-6" id="status-search-found">
            {/* Main Result Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-500"></div>

              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 font-semibold tracking-wider font-mono">ID KODE ORDER</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px] font-bold border border-slate-200">DIGITAL</span>
                  </div>
                  <h3 className="text-2xl font-extrabold font-mono text-slate-900 tracking-wide mt-1">{searchedOrder.id}</h3>
                </div>

                {/* Status Badge */}
                <div>
                  <div className={`px-4 py-2 border rounded-xl flex items-center gap-2 font-bold text-sm ${getStatusStyle(searchedOrder.status).bg}`} id="badge-status-details">
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    {getStatusStyle(searchedOrder.status).label}
                  </div>
                </div>
              </div>

              {/* Info Matrix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left block (Metadata info) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-350" />
                    Informasi Kepemilikan & Unit
                  </h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Nama Pemilik:</span>
                      <span className="text-slate-900 font-bold">{searchedOrder.customerName}</span>
                    </div>
                    {searchedOrder.customerEmail && (
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-slate-500 font-medium whitespace-nowrap">Email Notifikasi:</span>
                        <span className="text-slate-600 font-mono text-xs select-all text-right truncate max-w-[200px]" title={searchedOrder.customerEmail}>
                          {searchedOrder.customerEmail}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Kategori Barang:</span>
                      <span className="px-2 py-0.5 bg-slate-200/70 text-slate-700 text-xs font-bold rounded-md">
                        {searchedOrder.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Merk & Tipe:</span>
                      <span className="text-slate-950 font-bold">{searchedOrder.brandType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Metode Servis:</span>
                      <span className="text-brand-600 font-bold">{searchedOrder.method}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Tanggal Transaksi:</span>
                      <span className="text-slate-600 font-mono text-xs">{searchedOrder.createdAt} WIB</span>
                    </div>
                  </div>
                </div>

                {/* Right block (Diagnose and Costs) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-slate-350" />
                    Hasil Investigasi Diagnosa & Biaya
                  </h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-sm">
                    <div className="space-y-1">
                      <span className="text-slate-500 text-xs font-semibold block">Keluhan Masuk Awal:</span>
                      <p className="text-slate-600 leading-relaxed text-xs bg-white border border-slate-200/60 p-2.5 rounded-lg italic">
                        "{searchedOrder.complaint}"
                      </p>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-slate-500 text-xs font-semibold block">Laporan Diagnosa Dokter / Catatan Teknisi:</span>
                      <p className="text-slate-700 font-medium leading-relaxed text-xs bg-slate-200/40 border border-slate-200/40 p-2.5 rounded-lg">
                        {searchedOrder.technicianNotes || 'Teknisi belum menuliskan laporan diagnosa.'}
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-xs">Total Biaya Perbaikan:</span>
                      </div>
                      <span className="text-base font-extrabold text-slate-900 font-display">
                        {formatCost(searchedOrder.repairCost, searchedOrder.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Timeline Tracker */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Activity className="w-4 h-4 text-slate-350" />
                  Alur Tahapan Servis Real-time
                </h4>

                {/* Horizontal Timeline Graphic */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 pl-4 md:pl-0">
                    {/* Visual Line connector for desktop */}
                    <div className="hidden md:block absolute left-4 right-4 top-1/2 -translate-y-3/2 h-1 bg-slate-200 -z-0">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-500" 
                        style={{ width: `${(activeStepIdx / (currentSteps.length - 1)) * 100}%` }}
                      ></div>
                    </div>

                    {/* Timeline elements */}
                    {currentSteps.map((step, idx) => {
                      const isCompleted = idx < activeStepIdx;
                      const isActive = idx === activeStepIdx;
                      const isLast = idx === currentSteps.length - 1;

                      let pointBg = 'bg-white border-slate-200 hover:border-slate-300';
                      let iconColor = 'text-slate-400';
                      
                      if (isCompleted) {
                        pointBg = 'bg-emerald-500 border-emerald-500 text-white';
                        iconColor = 'text-emerald-500';
                      } else if (isActive) {
                        const styleInfo = getStatusStyle(searchedOrder.status);
                        pointBg = `${styleInfo.indicator} border-current text-white scale-110 shadow-md shadow-brand-200`;
                        iconColor = 'text-slate-900 font-bold';
                      }

                      return (
                        <div key={idx} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center flex-1 max-w-full">
                          {/* Circle dot marker */}
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${pointBg}`}>
                            {isCompleted ? '✓' : idx + 1}
                          </div>

                          {/* Desktop labels */}
                          <div className="space-y-0.5">
                            <p className={`text-xs font-bold ${isActive ? 'text-brand-600' : 'text-slate-700'}`}>
                              {step.name}
                            </p>
                            <p className="text-[10px] text-slate-450 leading-tight max-w-[160px] mx-auto hidden md:block">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions banner */}
              <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <AlertCircle className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Kesulitan menemukan ID Anda? Coba hubungi bantuan langsung.</span>
                </div>
                <a
                  href={getWaContactUrl(searchedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                  id="direct-help-chat-wa"
                >
                  <Send className="w-3.5 h-3.5" />
                  Hubungi Admin via WhatsApp
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* SEARCH NOT FOUND STATE */
          <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-8 text-center space-y-4" id="status-search-not-found">
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-500 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-rose-955 font-display">Maaf, ID Order "{searchId}" Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mohon periksa kembali keselarasan ejaan kode Anda. Pastikan diawali dengan format **SP-2026-** diikuti dengan 5 digit angka yang Anda miliki secara presisi.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs pt-1">
              <span className="text-slate-400">Hubungi Hotline:</span>
              <a href={`https://wa.me/${SHOP_INFO.whatsapp}`} className="text-brand-500 font-bold hover:underline">
                {SHOP_INFO.whatsappDisplay}
              </a>
            </div>
          </div>
        )
      ) : (
        /* INITIAL STATE BEFORE SEARCH */
        <div className="p-8 bg-slate-50 border border-slate-200/70 border-dashed rounded-3xl text-center space-y-3" id="status-initial-prompt">
          <Sparkles className="w-10 h-10 text-slate-350 mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-slate-700">Menunggu Input Kode Order</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Gunakan kotak penelusuran di atas untuk memasukkan ID Nota Servis, atau klik salah satu **Contoh ID Order Aktif** di atas untuk simulasi cepat.</p>
          </div>
        </div>
      )}
    </div>
  );
};
