import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Layers, 
  CheckSquare, 
  Hourglass, 
  Table, 
  RefreshCcw, 
  FileEdit, 
  Wrench, 
  AlertCircle,
  TrendingUp,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  PenTool,
  ChevronDown,
  Package,
  PlusCircle,
  Download,
  LayoutDashboard,
  Coins,
  History,
  Info,
  Calendar
} from 'lucide-react';
import { Order, OrderStatus, OrderCategory, Sparepart } from '../types';
import { sendStatusUpdateEmail } from '../utils/emailService';

interface AdminSectionProps {
  orders: Order[];
  onUpdateOrder: (orderId: string, updatedFields: Partial<Order>) => void;
  onNavigateToStatus: (orderId: string) => void;
  spareparts: Sparepart[];
  onUpdateSpareparts: (newSpareparts: Sparepart[]) => void;
  initialSubTab?: 'technician' | 'owner';
}

export const AdminSection: React.FC<AdminSectionProps> = ({ 
  orders, 
  onUpdateOrder, 
  onNavigateToStatus, 
  spareparts, 
  onUpdateSpareparts,
  initialSubTab = 'technician'
}) => {
  // Navigation for Sub-Tabs
  const [activeSubTab, setActiveSubTab] = useState<'technician' | 'owner'>(initialSubTab);

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  // Filter and Search states for table
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Technician Form states
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [editStatus, setEditStatus] = useState<OrderStatus>('Menunggu Antrean');
  const [editNotes, setEditNotes] = useState('');
  const [selectedSparepartId, setSelectedSparepartId] = useState<string>('');
  const [technicianFeeInput, setTechnicianFeeInput] = useState<number>(0);
  const [editCost, setEditCost] = useState<number>(0);

  // Restock Form states
  const [restockPartId, setRestockPartId] = useState<string>('');
  const [restockQty, setRestockQty] = useState<number>(5);

  // Register New Sparepart states
  const [newPartName, setNewPartName] = useState<string>('');
  const [newPartStock, setNewPartStock] = useState<number>(10);
  const [newPartPrice, setNewPartPrice] = useState<number>(120000);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warn'>('success');
  const [restockSuccess, setRestockSuccess] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  // Active hover bar in SVG chart
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Print Invoice Modal overlay state
  const [showPrintInvoiceId, setShowPrintInvoiceId] = useState<string | null>(null);

  // Pre-fill form when Selected Order ID changes
  useEffect(() => {
    if (selectedOrderId) {
      const order = orders.find((o) => o.id === selectedOrderId);
      if (order) {
        setEditStatus(order.status);
        setEditNotes(order.technicianNotes || '');
        setSelectedSparepartId(order.sparepartId || '');
        setTechnicianFeeInput(order.technicianFee || 0);
        setEditCost(order.repairCost || 0);
      }
    } else {
      setEditStatus('Menunggu Antrean');
      setEditNotes('');
      setSelectedSparepartId('');
      setTechnicianFeeInput(0);
      setEditCost(0);
    }
  }, [selectedOrderId, orders]);

  // Set default selection to the first order if none is selected
  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders]);

  // Live total price recalculation when sparepart or fee changes
  useEffect(() => {
    const matchedPart = spareparts.find((p) => p.id === selectedSparepartId);
    const sparepartPrice = matchedPart ? matchedPart.price : 0;
    setEditCost(technicianFeeInput + sparepartPrice);
  }, [selectedSparepartId, technicianFeeInput, spareparts]);

  // Initialize dropdowns
  useEffect(() => {
    if (spareparts.length > 0 && !restockPartId) {
      setRestockPartId(spareparts[0].id);
    }
  }, [spareparts]);

  // Calculations for KPI widgets
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status !== 'Selesai Siap Diambil' && o.status !== 'Gagal Diperbaiki'
  ).length;
  const completedOrders = orders.filter((o) => o.status === 'Selesai Siap Diambil').length;
  
  // Total Revenue based purely on actual completed bills
  const totalRevenue = orders.reduce((sum, o) => sum + o.repairCost, 0);

  // Save changes from operasional technician form
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    const parentOrder = orders.find((o) => o.id === selectedOrderId);
    if (!parentOrder) return;

    const matchedPart = spareparts.find((p) => p.id === selectedSparepartId);
    const finalSparepartPrice = matchedPart ? matchedPart.price : 0;
    const calculatedTotalCost = technicianFeeInput + finalSparepartPrice;

    // Handle inventory deduction & restoration
    const previousPartId = parentOrder.sparepartId || '';
    if (previousPartId !== selectedSparepartId) {
      let updatedSpareparts = [...spareparts];
      
      // Restore previous part stock (+1)
      if (previousPartId) {
        updatedSpareparts = updatedSpareparts.map((p) =>
          p.id === previousPartId ? { ...p, stock: p.stock + 1 } : p
        );
      }

      // Check stock availability & deduct new part stock (-1)
      if (selectedSparepartId) {
        let outOfStock = false;
        updatedSpareparts = updatedSpareparts.map((p) => {
          if (p.id === selectedSparepartId) {
            if (p.stock <= 0) {
              outOfStock = true;
            }
            return { ...p, stock: Math.max(0, p.stock - 1) };
          }
          return p;
        });

        if (outOfStock) {
          showActionToast('Peringatan: Sparepart ini kehabisan stok! Stok dijadikan 0.', 'warn');
        }
      }
      
      onUpdateSpareparts(updatedSpareparts);
    }

    // Update order
    onUpdateOrder(selectedOrderId, {
      status: editStatus,
      technicianNotes: editNotes.trim(),
      repairCost: calculatedTotalCost,
      sparepartId: selectedSparepartId || undefined,
      sparepartName: matchedPart ? matchedPart.name : undefined,
      sparepartPrice: matchedPart ? matchedPart.price : undefined,
      technicianFee: technicianFeeInput,
    });

    if (editStatus === 'Selesai Siap Diambil') {
      showActionToast(`Sukses memperbarui ${selectedOrderId}. Sedang mengirim email pemberitahuan ke pelanggan...`, 'success');

      const updatedOrderObj: Order = {
        ...parentOrder,
        status: editStatus,
        technicianNotes: editNotes.trim(),
        repairCost: calculatedTotalCost,
        sparepartId: selectedSparepartId || undefined,
        sparepartName: matchedPart ? matchedPart.name : undefined,
        sparepartPrice: matchedPart ? matchedPart.price : undefined,
        technicianFee: technicianFeeInput,
      };

      sendStatusUpdateEmail(updatedOrderObj).then((res) => {
        if (res.success) {
          showActionToast(`Sukses memperbarui ${selectedOrderId}! 📧 ${res.info}`, 'success');
        } else {
          showActionToast(`Sukses memperbarui ${selectedOrderId}. ⚠️ Gagal kirim email: ${res.info}`, 'warn');
        }
      });
    } else {
      showActionToast(`Sukses! Pesanan ${selectedOrderId} berhasil diperbarui di sistem.`, 'success');
    }
  };

  const showActionToast = (msg: string, type: 'success' | 'warn' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 6000);
  };

  const handleFastEditSelect = (id: string) => {
    setSelectedOrderId(id);
    setActiveSubTab('technician');
    const formElement = document.getElementById('admin-update-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Restock existing spare part logic
  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockPartId) return;

    const updated = spareparts.map((p) => {
      if (p.id === restockPartId) {
        return { ...p, stock: p.stock + restockQty };
      }
      return p;
    });

    onUpdateSpareparts(updated);
    setRestockSuccess(`Stok berhasil ditambah sebanyak +${restockQty} unit!`);
    setTimeout(() => setRestockSuccess(null), 4000);
  };

  // Register parent new sparepart
  const handleRegisterPartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim() || newPartPrice <= 0) return;

    // Generate custom ID
    const nextNum = spareparts.length + 1;
    const generatedId = `SPART-00${nextNum}`;

    const newPart: Sparepart = {
      id: generatedId,
      name: newPartName.trim(),
      stock: newPartStock,
      price: newPartPrice
    };

    const updated = [...spareparts, newPart];
    onUpdateSpareparts(updated);

    setNewPartName('');
    setNewPartStock(10);
    setNewPartPrice(120000);
    setRegisterSuccess(`Suku cadang baru "${newPart.name}" sukses didaftarkan dengan ID ${generatedId}!`);
    setTimeout(() => setRegisterSuccess(null), 4000);
  };

  // Export Data Master to CSV file format simulation
  const handleExportDataCSV = () => {
    const dataSource = filteredOrders;
    const isFiltered = filteredOrders.length !== orders.length;

    const headers = 'ID Order,Pelanggan,WhatsApp,Email,Kategori,Merk Tipe,Biaya,Tanggal,Status,Sparepart\n';
    const rows = dataSource.map((o) => {
      const spName = o.sparepartName || 'Tidak Ada';
      return `"${o.id}","${o.customerName}","${o.customerWhatsapp}","${o.customerEmail || ''}","${o.category}","${o.brandType}",${o.repairCost},"${o.createdAt}","${o.status}","${spName}"`;
    }).join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', isFiltered ? `ServisPro_DataMaster_Filtered.csv` : `ServisPro_DataMaster_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showActionToast(
      isFiltered 
        ? `Sukses mengekspor ${filteredOrders.length} data hasil filter ke format CSV!` 
        : 'Sukses mengunduh laporan transaksi! File CSV berhasil dihasilkan otomatis.', 
      'success'
    );
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const getBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Menunggu Antrean':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Sedang Dicek':
        return 'bg-blue-150 text-blue-800 border-blue-200';
      case 'Sedang Diperbaiki':
        return 'bg-orange-100 text-orange-850 border-orange-200';
      case 'Selesai Siap Diambil':
        return 'bg-emerald-100 text-emerald-850 border-emerald-250';
      case 'Gagal Diperbaiki':
        return 'bg-rose-100 text-rose-850 border-rose-200';
    }
  };

  // Filter orders for Table Master
  const filteredOrders = orders.filter((order) => {
    const s = tableSearch.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(s) ||
      order.customerName.toLowerCase().includes(s) ||
      order.brandType.toLowerCase().includes(s) ||
      order.customerWhatsapp.includes(s) ||
      (order.customerEmail || '').toLowerCase().includes(s) ||
      order.category.toLowerCase().includes(s) ||
      order.complaint.toLowerCase().includes(s) ||
      (order.technicianNotes || '').toLowerCase().includes(s) ||
      (order.sparepartName || '').toLowerCase().includes(s);
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || order.category === categoryFilter;

    // Local Date Comparison without Timezone skew
    const parseLocalOrderDate = (createdAtStr: string): Date | null => {
      try {
        const datePart = createdAtStr.split(' ')[0];
        const parts = datePart.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          return new Date(year, month, day);
        }
      } catch (e) {}
      return null;
    };

    const orderDate = parseLocalOrderDate(order.createdAt);
    let matchesDate = true;

    if (orderDate && dateFilter !== 'All') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (dateFilter === 'Today') {
        matchesDate = orderDate.getTime() === today.getTime();
      } else if (dateFilter === 'Yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        matchesDate = orderDate.getTime() === yesterday.getTime();
      } else if (dateFilter === 'ThisWeek') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesDate = orderDate >= sevenDaysAgo && orderDate <= today;
      } else if (dateFilter === 'ThisMonth') {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        matchesDate = orderDate >= thirtyDaysAgo && orderDate <= today;
      } else if (dateFilter === 'Custom') {
        if (customStartDate) {
          const parts = customStartDate.split('-');
          const start = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          if (orderDate < start) matchesDate = false;
        }
        if (customEndDate) {
          const parts = customEndDate.split('-');
          const end = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          if (orderDate > end) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  // Calculate monthly stats for customized SVG Bar Chart
  const monthsData = [
    { name: 'Jan', value: 1200000 },
    { name: 'Feb', value: 2100000 },
    { name: 'Mar', value: 3050000 },
    { name: 'Apr', value: 1800000 },
    { name: 'Mei', value: 2500000 },
    { name: 'Jun', value: 1000000 },
  ];

  // Map dynamic order calculations into chart values
  orders.forEach((o) => {
    if (o.createdAt.includes('2026-05')) {
      monthsData[4].value += o.repairCost;
    } else if (o.createdAt.includes('2026-06') || o.createdAt.includes('2026-06')) {
      monthsData[5].value += o.repairCost;
    }
  });

  const maxVal = Math.max(...monthsData.map((d) => d.value), 4000000);

  return (
    <div className="space-y-8 animate-fade-in" id="admin-panel-container">
      {/* Visual Subtabs segments control - highly elegant switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-3" id="admin-tabs">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-brand-600" />
            ServisPro Premium Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">Sistem manajemen perbaikan barang elektronik & pengawasan inventaris.</p>
        </div>

        <div className="flex bg-slate-200/70 p-1 rounded-xl self-end">
          <button
            onClick={() => setActiveSubTab('technician')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'technician' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            id="subtab-technician"
          >
            <PenTool className="w-4 h-4" />
            Panel Teknisi
          </button>
          <button
            onClick={() => setActiveSubTab('owner')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'owner' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            id="subtab-owner"
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard Owner
          </button>
        </div>
      </div>

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl font-semibold text-xs sm:text-sm shadow-md animate-fade-in flex items-center gap-3 border ${
          toastType === 'success' 
            ? 'bg-emerald-900/90 text-emerald-50 border-emerald-700' 
            : 'bg-amber-900/90 text-amber-50 border-amber-700'
        }`}>
          {toastType === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <div className="flex-1">{toastMessage}</div>
        </div>
      )}

      {/* ----------------- SUB-TAB 1: PANEL TEKNISI ----------------- */}
      {activeSubTab === 'technician' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="subtab-technician-content">
          
          {/* Main List of orders under repair status */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-brand-600" />
                  <h3 className="text-base font-bold text-slate-900 font-display">Daftar Antrean Kerja Teknisi</h3>
                </div>
                <div className="text-xs bg-slate-100 px-3 py-1 font-bold text-slate-600 rounded-lg">
                  {orders.filter(o => o.status !== 'Selesai Siap Diambil').length} Antrean Aktif
                </div>
              </div>

              {/* Advanced filter components */}
              <div className="p-4 bg-slate-50/75 border-b border-slate-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Cari ID, pemilik, unit, nomor WA, catatan..."
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-205 rounded-xl focus:outline-hidden font-medium shadow-2xs hover:border-slate-300 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-205 rounded-xl focus:outline-hidden font-medium cursor-pointer shadow-2xs hover:border-slate-300 focus:border-indigo-500 transition-colors"
                    >
                      <option value="All">Semua Status</option>
                      <option value="Menunggu Antrean">Menunggu Antrean</option>
                      <option value="Sedang Dicek">Sedang Dicek</option>
                      <option value="Sedang Diperbaiki">Sedang Diperbaiki</option>
                      <option value="Selesai Siap Diambil">Selesai Siap Diambil</option>
                      <option value="Gagal Diperbaiki">Gagal Diperbaiki</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-205 rounded-xl focus:outline-hidden font-medium cursor-pointer shadow-2xs hover:border-slate-300 focus:border-indigo-500 transition-colors"
                    >
                      <option value="All">Semua Kategori</option>
                      <option value="HP">Smartphone / HP</option>
                      <option value="Laptop">PC / Laptop</option>
                      <option value="Konsol Game">Konsol Game</option>
                      <option value="TV">Monitor / TV</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-205 rounded-xl focus:outline-hidden font-medium cursor-pointer shadow-2xs hover:border-slate-300 focus:border-indigo-500 transition-colors"
                    >
                      <option value="All">Semua Tanggal</option>
                      <option value="Today">Hari Ini</option>
                      <option value="Yesterday">Kemarin</option>
                      <option value="ThisWeek">7 Hari Terakhir</option>
                      <option value="ThisMonth">30 Hari Terakhir</option>
                      <option value="Custom">Pilih Tanggal Manual...</option>
                    </select>
                  </div>
                </div>

                {/* Custom Date Range Picker Block (appears conditionally if Custom is selected) */}
                {dateFilter === 'Custom' && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl animate-fade-in text-xs">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-500 whitespace-nowrap uppercase tracking-wider text-[10px]">Rentang Tanggal:</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-medium">Dari:</span>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-bold bg-slate-50/70"
                        />
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-medium">Hingga:</span>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-bold bg-slate-50/70"
                        />
                      </div>
                    </div>

                    {(customStartDate || customEndDate) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomStartDate('');
                          setCustomEndDate('');
                        }}
                        className="text-[10px] font-extrabold text-rose-600 hover:text-rose-700 underline cursor-pointer ml-auto shrink-0 transition-colors border-none bg-transparent"
                      >
                        Atur Ulang
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100/50 text-slate-500 font-bold uppercase text-[10px] sm:text-xs">
                      <th className="px-4 py-3 text-center">ID Order</th>
                      <th className="px-4 py-3">Rincian Pelanggan</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Perkiraan Biaya</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          className={`border-b border-slate-100 text-xs hover:bg-slate-55/40 transition-colors ${
                            selectedOrderId === order.id ? 'bg-indigo-50/35 border-l-2 border-l-indigo-600' : ''
                          }`}
                        >
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => onNavigateToStatus(order.id)}
                              className="font-mono font-bold tracking-wider hover:underline text-brand-650 cursor-pointer"
                            >
                              {order.id}
                            </button>
                            <p className="text-[9px] text-slate-400 mt-1 font-mono">{order.createdAt.split(' ')[0]}</p>
                          </td>

                          <td className="px-4 py-4 space-y-1">
                            <div className="font-bold text-slate-900">{order.customerName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                              <span className="px-1.5 py-0.2 bg-slate-100 border text-[9px] rounded-md text-slate-500 font-bold">
                                {order.category}
                              </span>
                              <span className="truncate max-w-[120px]" title={order.brandType}>{order.brandType}</span>
                              {order.sparepartName && (
                                <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 text-[9px] rounded-md font-medium border border-indigo-100 flex items-center gap-0.5" title="Suku cadang dipasang">
                                  <Package className="w-2.5 h-2.5" />
                                  {order.sparepartName}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border inline-block ${getBadgeStyle(order.status)}`}>
                              {order.status}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-right font-mono font-bold text-slate-900 text-xs text-nowrap">
                            {order.repairCost === 0 ? (
                              <span className="text-slate-400 italic text-[10px]">TBD</span>
                            ) : (
                              formatCurrency(order.repairCost)
                            )}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleFastEditSelect(order.id)}
                                className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg shadow-sm cursor-pointer transition-colors"
                              >
                                Kelola
                              </button>
                              <a
                                href={`https://wa.me/${
                                  order.customerWhatsapp.startsWith('0') 
                                    ? '62' + order.customerWhatsapp.substring(1) 
                                    : order.customerWhatsapp.replace('+', '')
                                }?text=${encodeURIComponent(
                                  order.status === 'Selesai Siap Diambil'
                                    ? `Halo Kak ${order.customerName}, unit [${order.category}] ${order.brandType} Anda sudah SELESAI diperbaiki dan siap diambil ke toko. Total biaya: Rp ${order.repairCost.toLocaleString('id-ID')}. Silakan datang membawa kode order: ${order.id}.`
                                    : order.status === 'Sedang Diperbaiki'
                                      ? `Halo Kak ${order.customerName}, unit [${order.category}] ${order.brandType} Anda saat ini sedang dalam proses REPARASI oleh teknisi kami. Kode order: {order.id}.`
                                      : `Halo Kak ${order.customerName}, produk/gadget ${order.brandType} Anda dengan kode order ${order.id} saat ini berstatus: ${order.status}. Total biaya: Rp ${order.repairCost.toLocaleString('id-ID')}. Terima kasih telah menggunakan ServisPro Premium.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-colors inline-flex items-center gap-1 text-nowrap"
                              >
                                💬 WA
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-20 text-slate-400">
                          Tidak ada pesanan servis yang ditemukan sesuai kriteria filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form Update with parts and fee */}
          <div className="lg:col-span-1" id="admin-update-form">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-md space-y-6 lg:sticky lg:top-28">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-650 shrink-0">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-display text-sm">Form Operasional Servis</h3>
                  <p className="text-[11px] text-slate-400">Hubungkan diagnosa servis & suku cadang.</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Belum ada pesanan aktif untuk dikelola.
                </div>
              ) : (
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  {/* Select target order */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ID KODE ORDER SASARAN</label>
                    <select
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-205 rounded-xl focus:outline-hidden font-mono font-bold tracking-wider cursor-pointer"
                    >
                      {orders.map((ord) => (
                        <option key={ord.id} value={ord.id}>
                          {ord.id} - {ord.customerName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">STATUS PERBAIKAN SEKARANG</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-205 rounded-xl focus:outline-hidden cursor-pointer font-bold"
                    >
                      <option value="Menunggu Antrean">🟡 Menunggu Antrean</option>
                      <option value="Sedang Dicek">🔵 Sedang Dicek</option>
                      <option value="Sedang Diperbaiki">🟠 Sedang Diperbaiki</option>
                      <option value="Selesai Siap Diambil">🟢 Selesai Siap Diambil</option>
                      <option value="Gagal Diperbaiki">🔴 Gagal Diperbaiki</option>
                    </select>
                  </div>

                  {/* Spareparts Warehouse Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">PEMAKAIAN SUKU CADANG (INV GUDANG)</label>
                    <select
                      value={selectedSparepartId}
                      onChange={(e) => setSelectedSparepartId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-205 rounded-xl focus:outline-hidden cursor-pointer font-semibold text-slate-705"
                    >
                      <option value="">-- Tidak Memerlukan Sparepart (Jasa Saja) --</option>
                      {spareparts.map((p) => {
                        const isOutOfStock = p.stock <= 0;
                        return (
                          <option key={p.id} value={p.id} disabled={isOutOfStock}>
                            {p.name} - Rp {p.price.toLocaleString('id-ID')} {isOutOfStock ? '(STOK HABIS)' : `(Stok: ${p.stock})`}
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-[9px] text-slate-400">Bila diubah, stok gudang otomatis dikurangi dan harga langsung diakumulasi ke total tagihan.</p>
                  </div>

                  {/* Jasa Teknisi */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">BIAYA JASA TEKNISI (DIALURKAN MANUAL)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[11px] text-slate-400 font-bold pointer-events-none">Rp</span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="Contoh: 150000"
                        value={technicianFeeInput === 0 ? '' : technicianFeeInput}
                        onChange={(e) => setTechnicianFeeInput(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-205 rounded-xl focus:outline-hidden font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Live Breakdown Box */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-[11px] font-medium text-slate-600">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-200/50 pb-1 font-bold">
                      <span>Rincian Akumulasi Tagihan</span>
                      <span>NOMINAL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Biaya Jasa:</span>
                      <span className="font-semibold text-slate-800 font-mono">{formatCurrency(technicianFeeInput)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Suku Cadang:</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        {selectedSparepartId 
                          ? formatCurrency(spareparts.find(p => p.id === selectedSparepartId)?.price || 0) 
                          : 'Rp 0'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-900 font-bold border-t border-slate-200/50 pt-2 text-xs">
                      <span className="flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-550 shrink-0" />
                        Total Tagihan:
                      </span>
                      <span className="font-mono text-slate-950 text-sm">{formatCurrency(editCost)}</span>
                    </div>
                  </div>

                  {/* Technician Notes */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CATATAN TEKNISI & DIAGNOSA</label>
                    <textarea
                      rows={3}
                      placeholder="Tulis sparepart yang diganti, garansi dll."
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-205 rounded-xl focus:outline-hidden font-medium"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={!selectedOrderId}
                      className="w-full py-3 bg-slate-950 hover:bg-slate-905 text-white text-[11px] tracking-wider uppercase font-extrabold rounded-xl shrink-0 cursor-pointer shadow-sm disabled:opacity-50 transition-colors"
                    >
                      Simpan Perubahan
                    </button>
                    <button
                      type="button"
                      disabled={!selectedOrderId}
                      onClick={() => setShowPrintInvoiceId(selectedOrderId)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] tracking-wider uppercase font-extrabold rounded-xl shrink-0 cursor-pointer shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
                    >
                      🖨️ Cetak Nota
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: OWNER DASHBOARD & INVENTARIS ----------------- */}
      {activeSubTab === 'owner' && (
        <div className="space-y-10" id="subtab-owner-content">
          
          {/* Summary KPIs metrics (As st.metric widgets in Streamlit) */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="owner-metrics">
            {/* Metric 1 */}
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-2xs flex items-center gap-4 hover:shadow-xs transition duration-200">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100 shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">TOTAL PENDAPATAN TOKO</p>
                <h4 className="text-xl sm:text-2xl font-extrabold text-amber-700 font-display mt-0.5">{formatCurrency(totalRevenue)}</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  +12.8% Bulan Ini
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-2xs flex items-center gap-4 hover:shadow-xs transition duration-200">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">ORDERAN SELESAI SUKSES</p>
                <h4 className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-display mt-0.5">{completedOrders} Unit</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Barang sukses diserahkan</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-2xs flex items-center gap-4 hover:shadow-xs transition duration-200">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0">
                <Hourglass className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">TOTAL ANTREAN AKTIF</p>
                <h4 className="text-xl sm:text-2xl font-extrabold text-indigo-700 font-display mt-0.5">{pendingOrders} Unit</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Masih antre & dalam proses</p>
              </div>
            </div>
          </section>

          {/* Graphical Trends (Equivalent to st.bar_chart) */}
          <section className="bg-white p-6 border border-slate-200 rounded-3xl shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-550" />
                  Grafik Tren Pendapatan Bulanan Toko (Semua Unit)
                </h3>
                <p className="text-xs text-slate-400">Total akumulasi biaya perbaikan terhitung dari order masuk.</p>
              </div>
              <div className="text-xs px-2.5 py-1 bg-slate-150 border border-slate-200 rounded-lg text-slate-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                Tahun Buku 2026
              </div>
            </div>

            {/* SVG custom bar chart component with interactive hovers */}
            <div className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 space-y-2">
                <div className="relative h-60 w-full bg-slate-50 rounded-2xl p-4 flex items-end justify-between border border-slate-150">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-0.25 border-t border-slate-100 pointer-events-none"></div>
                  <div className="absolute inset-x-0 top-1/4 border-t border-slate-100 pointer-events-none"></div>
                  <div className="absolute inset-x-0 top-2/4 border-t border-slate-100 pointer-events-none"></div>
                  <div className="absolute inset-x-0 top-3/4 border-t border-slate-100 pointer-events-none font-mono text-[9px] text-slate-350 select-none">Grid</div>

                  {monthsData.map((d, i) => {
                    // Height proportion
                    const barHeightPct = Math.max(12, (d.value / maxVal) * 90);
                    
                    return (
                      <div 
                        key={i} 
                        className="flex flex-col items-center flex-1 h-full justify-end cursor-pointer group"
                        onMouseEnter={() => setHoveredBarIndex(i)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {/* Tooltip on Hover */}
                        <div className={`absolute top-4 bg-slate-900 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold shadow-md transition-opacity duration-200 pointer-events-none ${
                          hoveredBarIndex === i ? 'opacity-100' : 'opacity-0'
                        }`}>
                          Rp {d.value.toLocaleString('id-ID')}
                        </div>

                        {/* Visual bar graph */}
                        <div 
                          style={{ height: `${barHeightPct}%` }}
                          className={`w-10 sm:w-16 rounded-t-lg transition-all duration-300 ${
                            hoveredBarIndex === i 
                              ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' 
                              : d.name === 'Jun' 
                                ? 'bg-indigo-500/80' 
                                : 'bg-slate-300'
                          }`}
                        ></div>
                        <span className="text-xs font-bold text-slate-500 mt-2 font-display">{d.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart Legend Summary */}
              <div className="md:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200/65">
                    <Info className="w-4 h-4 text-slate-400" />
                    Analisa Finansial
                  </h4>
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-505 font-medium leading-relaxed">
                      Bulan <span className="font-bold text-slate-900">Maret</span> menjadi masa puncak transaksi berkat permintaan perbaikan korporasi sebesar <span className="font-semibold text-slate-850">Rp 3,05M</span>.
                    </p>
                    <p className="text-slate-505 font-medium leading-relaxed">
                      Layanan <span className="font-bold text-slate-900">Panggil Teknisi</span> menyumbang 40% omset servis bulan ini.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-205 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">TOTAL KUMULATIF TA 2026:</span>
                  <div className="text-lg font-extrabold text-slate-950 leading-tight">
                    {formatCurrency(monthsData.reduce((s, d) => s + d.value, 0))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 📦 Fitur Inventaris Sparepart Section (View Stocks & Add/New Parts) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="owner-inventory">
            
            {/* Sparepart stocks list table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-base font-bold text-slate-900 font-display">Suku Cadang & Inventaris Gudang</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-md">
                    {spareparts.length} Kategori Part
                  </span>
                </div>

                {/* Table display */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100/50 text-slate-505 text-xs font-bold divide-y divide-slate-100">
                        <th className="px-5 py-3">ID Part</th>
                        <th className="px-5 py-3">Nama Sparepart</th>
                        <th className="px-5 py-3 text-center">Status Stok</th>
                        <th className="px-5 py-3 text-right">Harga Jual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {spareparts.map((p) => {
                        const isLow = p.stock > 0 && p.stock <= 5;
                        const isOut = p.stock === 0;

                        return (
                          <tr key={p.id} className="hover:bg-slate-50 transition duration-150">
                            <td className="px-5 py-3.5 font-mono text-slate-500 font-medium">{p.id}</td>
                            <td className="px-5 py-3.5 font-bold text-slate-900">{p.name}</td>
                            <td className="px-5 py-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5 flex-col xs:flex-row">
                                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                                  isOut 
                                    ? 'bg-rose-100 text-rose-800' 
                                    : isLow 
                                      ? 'bg-amber-100 text-amber-800' 
                                      : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {p.stock} Unit
                                </span>
                                {isOut && <span className="text-[9px] text-rose-500 font-bold whitespace-nowrap">Wajib Restock!</span>}
                                {isLow && <span className="text-[9px] text-amber-500 font-bold whitespace-nowrap">Hampir Habis</span>}
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                              {formatCurrency(p.price)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Inventory Forms Side Column */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Form 1: Restock existing sparepart */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 font-display text-sm flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <RefreshCcw className="w-4.5 h-4.5 text-brand-600" />
                  Tambah Stok (Restock Unit)
                </h4>

                {restockSuccess && (
                  <div className="p-2.5 text-xs text-white bg-emerald-99 ring-1 ring-emerald-600 bg-emerald-800 font-bold rounded-lg mb-2">
                    {restockSuccess}
                  </div>
                )}

                <form onSubmit={handleRestockSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">PILIH SUKU CADANG</label>
                    <select
                      value={restockPartId}
                      onChange={(e) => setRestockPartId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-205 rounded-xl cursor-pointer font-bold"
                    >
                      {spareparts.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">KUANTITAS TAMBAHAN</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={restockQty}
                      onChange={(e) => setRestockQty(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-205 rounded-xl font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Perbarui Stok Gudang
                  </button>
                </form>
              </div>

              {/* Form 2: Register completely new spare part */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 font-display text-sm flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <PlusCircle className="w-4.5 h-4.5 text-emerald-600" />
                  Registrasi Sparepart Baru
                </h4>

                {registerSuccess && (
                  <div className="p-2.5 text-xs text-white bg-emerald-800 ring-1 ring-emerald-600 font-bold rounded-lg mb-2">
                    {registerSuccess}
                  </div>
                )}

                <form onSubmit={handleRegisterPartSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">NAMA SUKU CADANG BARU</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Motherboard IC PS5 Pro"
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-205 rounded-xl font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">STOK AWAL</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={newPartStock}
                        onChange={(e) => setNewPartStock(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-205 rounded-xl font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">HARGA JUAL</label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        required
                        value={newPartPrice}
                        onChange={(e) => setNewPartPrice(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-205 rounded-xl font-mono font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Daftar Suku Cadang Baru
                  </button>
                </form>
              </div>

            </div>
          </section>

          {/* 📋 Tabel Data Master Section (Filterable & CSV downloadable) */}
          <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs space-y-4">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-650" />
                  LOG TRANSAKSI & DATA MASTER SERVIS (Owner View)
                </h3>
                <p className="text-xs text-slate-400 mt-1">Gunakan tombol ekspor untuk mengekstrak data master ke dalam format tabel global.</p>
              </div>
              <button
                onClick={handleExportDataCSV}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm flex items-center gap-2 cursor-pointer transition-all self-end"
              >
                <Download className="w-4 h-4" />
                Ekspor ke Format CSV
              </button>
            </div>

            {/* Quick table view of logistics layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-505 font-bold text-xs border-b border-slate-150">
                    <th className="px-5 py-3">ID Order</th>
                    <th className="px-5 py-3">Rincian Pelanggan</th>
                    <th className="px-5 py-3">Informasi Perbaikan & Suku Cadang</th>
                    <th className="px-5 py-3 text-right">Biaya Total</th>
                    <th className="px-5 py-3">Tanggal Reg</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-705">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition duration-150">
                      <td className="px-5 py-4 font-mono font-bold text-slate-800">{o.id}</td>
                      <td className="px-5 py-4 space-y-1">
                        <p className="font-bold text-slate-950">{o.customerName}</p>
                        <p className="text-[11px] text-slate-400 font-mono select-all">WA: {o.customerWhatsapp}</p>
                        {o.customerEmail && <p className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{o.customerEmail}</p>}
                      </td>
                      <td className="px-5 py-4 space-y-1 max-w-xs">
                        <p className="font-semibold text-slate-900 border-b border-dotted border-slate-205 pb-0.5">{o.brandType} ({o.category})</p>
                        <p className="text-slate-405 text-[10px] italic truncate" title={o.complaint}>Keluhan: {o.complaint}</p>
                        {o.sparepartName ? (
                          <p className="text-[10px] text-indigo-700 font-bold bg-indigo-50/50 px-1.5 py-0.2 rounded-md border border-indigo-100/50 inline-block">
                            Ganti: {o.sparepartName} ({formatCurrency(o.sparepartPrice || 0)})
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">Suku Cadang: Tidak Ada</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(o.repairCost)}
                      </td>
                      <td className="px-5 py-4 font-mono text-[10px] text-slate-400">{o.createdAt}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md border text-center whitespace-nowrap ${getBadgeStyle(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </section>

        </div>
      )}

      {/* 🔮 GORGEOUS PRINTABLE NOTA/INVOICE DIALOG OVERLAY */}
      {showPrintInvoiceId && (() => {
        const invOrder = orders.find(o => o.id === showPrintInvoiceId);
        if (!invOrder) return null;
        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
              {/* Header Bar */}
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🖨️</span>
                  <span className="font-bold text-sm tracking-wide uppercase font-mono">Nota Transaksi Resmi / Invoice</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrintInvoiceId(null)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-lg border-none"
                >
                  Tutup [X]
                </button>
              </div>

              {/* Printable Body Content */}
              <div className="bg-white p-6 sm:p-8 space-y-6 text-slate-800" id="printable-area-react">
                <div className="text-center border-b-2 border-dashed border-slate-900 pb-5 space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-mono tracking-tight flex items-center justify-center gap-1">
                    <span>🔧</span> SERVISPRO PREMIUM SERVICES
                  </h2>
                  <p className="text-[12px] font-mono text-slate-500">Kavling Tekno No. 102, Kebayoran Baru, Jakarta Selatan</p>
                  <p className="text-[11px] font-mono text-slate-400">WA: 0812-3456-7890 | Email: office@servispro.id</p>
                  <p className="text-[11px] font-mono font-bold text-indigo-600 tracking-wider">WORKSPACE LOGISTIK & INVENTARIS RESMI</p>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono border-b border-slate-200 pb-4">
                  <div className="space-y-1 text-left">
                    <p><span className="text-slate-400">ID ORDER :</span> <strong className="text-slate-900">{invOrder.id}</strong></p>
                    <p><span className="text-slate-400">TANGGAL  :</span> {invOrder.createdAt}</p>
                    <p><span className="text-slate-400">METODE   :</span> {invOrder.method}</p>
                  </div>
                  <div className="space-y-1 text-left">
                    <p><span className="text-slate-400">PELANGGAN:</span> <strong className="text-slate-950">{invOrder.customerName}</strong></p>
                    <p><span className="text-slate-400">WHATSAPP :</span> {invOrder.customerWhatsapp}</p>
                    {invOrder.customerEmail && <p><span className="text-slate-400">EMAIL    :</span> {invOrder.customerEmail}</p>}
                  </div>
                </div>

                {/* Scope of repairs table */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="border-b border-slate-300 pb-1.5 font-bold uppercase tracking-wider text-[11px] text-left">
                    Spesifikasi Suku Cadang & Jasa Reparasi
                  </div>
                  <table className="w-full text-left font-mono">
                    <thead>
                      <tr className="border-b border-dashed border-slate-200 text-slate-404">
                        <th className="py-2 text-left">Rincian Deskripsi</th>
                        <th className="py-2 text-right">Biaya / Harga</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 text-left">
                          <p className="font-bold text-slate-900">[{invOrder.category}] {invOrder.brandType}</p>
                          <p className="text-[11px] text-slate-500 italic mt-0.5">Keluhan: {invOrder.complaint}</p>
                          {invOrder.technicianNotes && (
                            <p className="text-[11px] text-slate-400 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 text-left">
                              Catatan Teknisi: "{invOrder.technicianNotes}"
                            </p>
                          )}
                        </td>
                        <td className="py-3 text-right font-bold text-slate-1000">
                          {formatCurrency(invOrder.repairCost)}
                        </td>
                      </tr>
                      {invOrder.sparepartName && (
                        <tr>
                          <td className="py-2 text-slate-600 font-bold text-[11px] flex items-center gap-1 text-left">
                            <span>📦</span> Part Terpasang: {invOrder.sparepartName}
                          </td>
                          <td className="py-2 text-right text-slate-600 font-bold text-[11px]">
                            Terhitung pada total tagihan di atas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Total Block */}
                <div className="border-t-2 border-dashed border-slate-950 pt-4 flex justify-between items-center font-mono text-slate-950">
                  <span className="font-extrabold text-sm sm:text-base">TOTAL JASA & SUKU CADANG (NETTO)</span>
                  <span className="font-black text-base sm:text-lg">{formatCurrency(invOrder.repairCost)}</span>
                </div>

                {/* Guarantee Clauses */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-[10.5px] font-mono text-slate-500 leading-relaxed space-y-1 text-left">
                  <p className="font-bold text-slate-705">📜 SYARAT & KETENTUAN GARANSI WORKSPACE:</p>
                  <p>1. Masa berlaku jaminan garansi perbaikan adalah <b>90 Hari</b> setelah barang diserahterjemahkan ke pelanggan.</p>
                  <p>2. Segel pengaman tidak boleh mengalami robek, rusak fisik, kena air, atau terbakar akibat korsleting eksternal rumah.</p>
                  <p>3. Simpan dan lampirkan formulir cetak nota ini sebagai rujukan utama pendaftaran garansi instan ke admin toko kami.</p>
                </div>

                {/* Signatures */}
                <div className="flex justify-between text-xs font-mono pt-4 text-center">
                  <div className="w-36 space-y-12">
                    <p className="text-slate-405">Tim Teknisi ServisPro</p>
                    <p className="font-bold border-t border-slate-300 pt-1.5">( Tech-Team )</p>
                  </div>
                  <div className="w-36 space-y-12">
                    <p className="text-slate-405">Tanda Tangan Pelanggan</p>
                    <p className="font-bold border-t border-slate-300 pt-1.5">( {invOrder.customerName} )</p>
                  </div>
                </div>
              </div>

              {/* Action Operations Bar */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[10px] text-slate-405 font-bold font-mono tracking-wider">
                  Tip: Anda bisa mengambil screenshot layar atau klik tombol cetak.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPrintInvoiceId(null)}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const printContent = document.getElementById('printable-area-react');
                      if (printContent) {
                        const styleSheet = document.createElement("style");
                        styleSheet.id = "print-style-dynamic";
                        styleSheet.innerText = `
                          @media print {
                            body * {
                              visibility: hidden !important;
                            }
                            #printable-area-react, #printable-area-react * {
                              visibility: visible !important;
                            }
                            #printable-area-react {
                              position: absolute !important;
                              left: 0 !important;
                              top: 0 !important;
                              width: 100% !important;
                              margin: 0 !important;
                              padding: 20px !important;
                              border: none !important;
                              box-shadow: none !important;
                              background: white !important;
                              color: black !important;
                            }
                          }
                        `;
                        document.head.appendChild(styleSheet);
                        window.print();
                        styleSheet.remove();
                      }
                    }}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer border-none"
                  >
                    🖨️ Cetak / Unduh PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
