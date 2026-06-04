import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  User, 
  Smartphone, 
  Compass, 
  FileText, 
  Truck, 
  Send, 
  Copy, 
  CheckCircle2, 
  RotateCcw,
  Search,
  Eye,
  CalendarDays,
  Mail
} from 'lucide-react';
import { Order, OrderCategory, ServiceMethod } from '../types';
import { SHOP_INFO } from '../data';

interface BookingSectionProps {
  onAddOrder: (newOrder: Order) => void;
  onNavigateToStatus: (orderId: string) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ onAddOrder, onNavigateToStatus }) => {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [customerEmail, setCustomerEmail] = useState('sukamatchaecaa2@gmail.com');
  const [category, setCategory] = useState<OrderCategory>('HP');
  const [brandType, setBrandType] = useState('');
  const [complaint, setComplaint] = useState('');
  const [method, setMethod] = useState<ServiceMethod>('Antar ke Toko');

  // Form Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Confirmed State (Digital Receipt view)
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) {
      newErrors.customerName = 'Nama Lengkap wajib diisi';
    }
    
    const waClean = customerWhatsapp.replace(/\D/g, '');
    if (!customerWhatsapp.trim()) {
      newErrors.customerWhatsapp = 'Nomor WhatsApp wajib diisi';
    } else if (waClean.length < 9 || waClean.length > 15) {
      newErrors.customerWhatsapp = 'Nomor WhatsApp tidak valid (harus 9-15 digit angka saja)';
    }

    if (!customerEmail.trim()) {
      newErrors.customerEmail = 'Alamat Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      newErrors.customerEmail = 'Format alamat email tidak valid';
    }

    if (!brandType.trim()) {
      newErrors.brandType = 'Merk & Tipe Barang wajib diisi';
    }

    if (!complaint.trim()) {
      newErrors.complaint = 'Detail Keluhan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsappInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, plus sign and spaces for standard writing
    const val = e.target.value;
    const sanitized = val.replace(/[^0-9+\s-]/g, '');
    setCustomerWhatsapp(sanitized);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Generate random 5-digit number
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `SP-2026-${randomNum}`;

    // Format current time
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      customerWhatsapp: customerWhatsapp.replace(/\D/g, ''), // clean numeric format
      customerEmail: customerEmail.trim(),
      category,
      brandType: brandType.trim(),
      complaint: complaint.trim(),
      method,
      status: 'Menunggu Antrean',
      technicianNotes: 'Menunggu antrean untuk diperiksa oleh teknisi.',
      repairCost: 0,
      createdAt: formattedDate,
    };

    // Save order
    onAddOrder(newOrder);
    setSubmittedOrder(newOrder);

    // Reset Form
    setCustomerName('');
    setCustomerWhatsapp('');
    setCustomerEmail('sukamatchaecaa2@gmail.com');
    setCategory('HP');
    setBrandType('');
    setComplaint('');
    setMethod('Antar ke Toko');
    setErrors({});
  };

  const handleCopyId = () => {
    if (!submittedOrder) return;
    navigator.clipboard.writeText(submittedOrder.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const generateWhatsappMessageUrl = () => {
    if (!submittedOrder) return '';
    const text = `Halo Admin ${SHOP_INFO.name}, saya sudah melakukan booking servis online:
*ID Order*: ${submittedOrder.id}
*Nama*: ${submittedOrder.customerName}
*Barang*: ${submittedOrder.category} - ${submittedOrder.brandType}
*Keluhan*: ${submittedOrder.complaint}
*Metode*: ${submittedOrder.method}

Mohon dipandu untuk instruksi penyerahan barang / jadwalkan teknisi selanjutnya. Terima kasih!`;
    return `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in" id="booking-section-container">
      {submittedOrder ? (
        /* DIGITAL RECEIPT AND SUCCESS STATE */
        <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100 space-y-8" id="digital-receipt-success">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">Booking Berhasil Dibuat!</h2>
              <p className="text-sm text-slate-500">Berikut adalah nota digital pesanan perbaikan Anda di ServisPro.</p>
            </div>
          </div>

          {/* Copyable Order ID Code Box */}
          <div className="bg-slate-900 rounded-2xl p-6 text-center space-y-3 border border-slate-800 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <ClipboardCheck className="w-24 h-24 text-white" />
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">SIMPAN ID ORDER ANDA UNTUK CEK STATUS</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-3xl font-extrabold font-mono text-emerald-400 tracking-wider">
                {submittedOrder.id}
              </code>
              <button
                onClick={handleCopyId}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                title="Salin ID Order"
                id="copy-id-received"
              >
                {isCopied ? <span className="text-xs text-emerald-400 font-semibold px-1">Tersalin!</span> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500">Gunakan ID di atas di dalam tab <strong>"Cek Status"</strong> untuk melacak proses pengerjaan secara berkala.</p>
          </div>

          {/* Booking Summary Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-brand-500" />
                Rangkuman Nota Booking Digital
              </h3>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-6 py-3.5 text-slate-500 font-medium w-1/3">Nama Lengkap</td>
                  <td className="px-6 py-3.5 text-slate-900 font-semibold">{submittedOrder.customerName}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 text-slate-500 font-medium">No. WhatsApp</td>
                  <td className="px-6 py-3.5 text-slate-900 font-mono font-medium">{submittedOrder.customerWhatsapp}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 text-slate-500 font-medium">Alamat Email</td>
                  <td className="px-6 py-3.5 text-slate-900 font-mono text-xs">{submittedOrder.customerEmail}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 text-slate-500 font-medium">Kategori Barang</td>
                  <td className="px-6 py-3.5 text-slate-900">
                    <span className="px-2.5 py-1 bg-slate-200/60 text-slate-800 text-xs font-bold rounded-lg border border-slate-300">
                      {submittedOrder.category}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 text-slate-500 font-medium">Merk & Tipe Barang</td>
                  <td className="px-6 py-3.5 text-slate-900 font-semibold">{submittedOrder.brandType}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 text-slate-500 font-medium">Detail Keluhan</td>
                  <td className="px-6 py-3.5 text-slate-600 leading-relaxed">{submittedOrder.complaint}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 text-slate-500 font-medium">Metode Servis</td>
                  <td className="px-6 py-3.5 text-slate-900">
                    <span className="flex items-center gap-1.5 font-semibold text-brand-600">
                      <Truck className="w-4 h-4" />
                      {submittedOrder.method}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 text-slate-500 font-medium">Tanggal Masuk</td>
                  <td className="px-6 py-3.5 text-slate-600 font-mono text-xs">{submittedOrder.createdAt} WIB</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Actions Banner */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
            <a
              href={generateWhatsappMessageUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-center shadow-lg shadow-emerald-500/15 transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
              id="whatsapp-direct-link"
            >
              <Send className="w-4 h-4" />
              Kirim Nota ke WhatsApp Admin
            </a>
            <button
              onClick={() => onNavigateToStatus(submittedOrder.id)}
              className="flex-1 py-3 px-6 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
              id="view-status-direct"
            >
              <Eye className="w-4 h-4" />
              Cek Status Servis Saya
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setSubmittedOrder(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold underline flex items-center gap-1.5 mx-auto"
              id="make-another-booking-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Buat Booking Servis Baru Lainnya
            </button>
          </div>
        </div>
      ) : (
        /* STANDARD BOOKING FORM STATE */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg shadow-slate-100 space-y-6" id="booking-form-box">
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">Layanan Booking Servis Online</h2>
            <p className="text-slate-500 text-sm mt-1">Registrasikan kerusakan gadget Anda lebih cepat secara mandiri untuk menghindari antrean panjang di loket workshop.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Nama & WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">NAMA LENGKAP PELANGGAN <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border ${
                      errors.customerName ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-200 focus:ring-brand-500 focus:border-brand-500'
                    } rounded-xl focus:outline-hidden focus:ring-2 bg-white transition-all`}
                    id="input-name"
                  />
                </div>
                {errors.customerName && <p className="text-rose-500 text-xs font-semibold">{errors.customerName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">NOMOR WHATSAPP AKTIF <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <span className="text-sm font-semibold selection:bg-transparent select-none">+62</span>
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="81234567890 (Angka saja)"
                    value={customerWhatsapp}
                    onChange={handleWhatsappInput}
                    className={`w-full pl-14 pr-4 py-2.5 text-sm bg-slate-50/50 border ${
                      errors.customerWhatsapp ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-200 focus:ring-brand-500 focus:border-brand-500'
                    } rounded-xl focus:outline-hidden focus:ring-2 bg-white transition-all`}
                    id="input-whatsapp"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Masukkan digit tanpa angka 0 di depan atau +62. Cukup angka setelah kode negara.</p>
                {errors.customerWhatsapp && <p className="text-rose-500 text-xs font-semibold">{errors.customerWhatsapp}</p>}
              </div>
            </div>

            {/* Row 1.5: Alamat Email untuk Notifikasi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">ALAMAT EMAIL PELANGGAN <span className="text-rose-500">*</span></label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Contoh: sukamatchaecaa2@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border ${
                    errors.customerEmail ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-200 focus:ring-brand-500 focus:border-brand-500'
                  } rounded-xl focus:outline-hidden focus:ring-2 bg-white transition-all`}
                  id="input-email"
                />
              </div>
              <p className="text-[10px] text-slate-400">Alamat email wajib diisi demi keandalan system pemberitahuan otomatis (EmailJS) saat status perbaikan diperbarui.</p>
              {errors.customerEmail && <p className="text-rose-500 text-xs font-semibold">{errors.customerEmail}</p>}
            </div>

            {/* Row 2: Kategori & Merk Tipe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">KATEGORI BARANG ELEKTRONIK <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Smartphone className="w-4.5 h-4.5" />
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as OrderCategory)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white transition-all appearance-none cursor-pointer font-medium"
                    id="select-category"
                  >
                    <option value="HP">Smartphone / Tablet (HP)</option>
                    <option value="Laptop">PC / Laptop / Notebook</option>
                    <option value="Konsol Game">Konsol Game (PlayStation, Switch, Xbox)</option>
                    <option value="TV">Televisi / Smart TV / Monitor</option>
                    <option value="Lainnya">Barang Elektronik Lainnya</option>
                  </select>
                </div>
                <p className="text-[10px] text-slate-400">Pilih kategori umum yang cocok dengan unit elektronik Anda.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">MERK & TIPE DETAIL BARANG <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Compass className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Asus ROG Zephyrus G14, iPhone 14 Pro Max"
                    value={brandType}
                    onChange={(e) => setBrandType(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border ${
                      errors.brandType ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-200 focus:ring-brand-500 focus:border-brand-500'
                    } rounded-xl focus:outline-hidden focus:ring-2 bg-white transition-all`}
                    id="input-brand"
                  />
                </div>
                {errors.brandType && <p className="text-rose-500 text-xs font-semibold">{errors.brandType}</p>}
              </div>
            </div>

            {/* Row 3: Detail Keluhan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">DETAIL KELUHAN & GEJALA KERUSAKAN <span className="text-rose-500">*</span></label>
              <div className="relative">
                <span className="absolute top-3 left-3 pointer-events-none text-slate-400">
                  <FileText className="w-4.5 h-4.5" />
                </span>
                <textarea
                  required
                  rows={4}
                  placeholder="Deskripsikan kerusakan se-spesifik mungkin. (Contoh: Layar berkedip dan tidak bisa disentuh setelah terkena tumpahan kopi di bagian keyboard, laptop tidak mau menyala sama sekali tapi lampu indikator pengisian menyala jingga)"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border ${
                    errors.complaint ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-200 focus:ring-brand-500 focus:border-brand-500'
                  } rounded-xl focus:outline-hidden focus:ring-2 bg-white transition-all`}
                  id="textarea-complaint"
                />
              </div>
              <p className="text-[10px] text-slate-400">Infokan kronologis terjadinya kerusakan (misalnya: jatuh, terkena air, tiba-tiba mati) untuk membantu estimasi awal teknisi.</p>
              {errors.complaint && <p className="text-rose-500 text-xs font-semibold">{errors.complaint}</p>}
            </div>

            {/* Row 4: Metode Servis */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">METODE PENYERAHAN BARANG <span className="text-rose-500">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setMethod('Antar ke Toko')}
                  className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 select-none ${
                    method === 'Antar ke Toko'
                      ? 'border-brand-500 bg-brand-50/40 text-slate-900 ring-2 ring-brand-400/20'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                  id="method-antar"
                >
                  <input
                    type="radio"
                    checked={method === 'Antar ke Toko'}
                    onChange={() => {}} // handled by parent click
                    className="mt-0.5 accent-brand-600 cursor-pointer pointer-events-none"
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Antar langsung ke Toko</p>
                    <p className="text-xs text-slate-500 mt-1">Anda membawa unit secara mandiri ke alamat workshop fisik kami di Kebayoran Baru.</p>
                  </div>
                </div>

                <div
                  onClick={() => setMethod('Panggil Teknisi')}
                  className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 select-none ${
                    method === 'Panggil Teknisi'
                      ? 'border-brand-500 bg-brand-50/40 text-slate-900 ring-2 ring-brand-400/20'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                  id="method-panggil"
                >
                  <input
                    type="radio"
                    checked={method === 'Panggil Teknisi'}
                    onChange={() => {}} // handled by parent click
                    className="mt-0.5 accent-brand-600 cursor-pointer pointer-events-none"
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Panggil Teknisi ke Rumah</p>
                    <p className="text-xs text-slate-500 mt-1">Teknisi kami mendatangi rumah/kantor Anda. Sangat disarankan untuk area Jabodetabek.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                id="btn-submit-order"
              >
                <ClipboardCheck className="w-5 h-5" />
                Submit Form Booking Servis
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
