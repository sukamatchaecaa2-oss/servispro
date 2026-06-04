import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Eye, 
  Truck, 
  MessageSquare, 
  MapPin, 
  Phone, 
  ChevronDown, 
  Star, 
  Calendar, 
  ChevronRight, 
  HelpCircle,
  Search
} from 'lucide-react';
import { ADVANTAGES, TESTIMONIALS, FAQS, SHOP_INFO } from '../data';

interface HomeSectionProps {
  onStartBooking: () => void;
  onCheckStatus: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onStartBooking, onCheckStatus }) => {
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-brand-500" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-brand-500" />;
      case 'Eye':
        return <Eye className="w-6 h-6 text-brand-500" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-brand-500" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-brand-500" />;
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-16 animate-fade-in" id="home-section-container">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 text-white relative shadow-xl shadow-slate-950/20" id="hero-banner">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38a8f9_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-brand-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
            Layanan Profesional Jaminan Mutu
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Sistem Manajemen Servis Barang Elektronik <span className="text-brand-400 font-bold">ServisPro</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {SHOP_INFO.tagline}. Booking perbaikan handphone, laptop, TV, dan konsol game Anda secara online. Cek status pengerjaan secara transparan kapan saja tanpa ribet.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onStartBooking}
              className="py-3 px-6 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              id="hero-btn-booking"
            >
              Booking Servis Sekarang
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onCheckStatus}
              className="py-3 px-6 bg-slate-800/80 hover:bg-slate-800 text-white font-medium rounded-xl border border-slate-700 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              id="hero-btn-status"
            >
              Cek Status Perbaikan
            </button>
          </div>

          <div className="border-t border-slate-700/60 pt-8 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-400 border border-white/10 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Alamat Workshop</p>
                <p className="text-xs text-slate-400 leading-tight">{SHOP_INFO.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-400 border border-white/10 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Kontak WhatsApp</p>
                <a href={`https://wa.me/${SHOP_INFO.whatsapp}`} className="hover:text-brand-300 transition-colors font-medium text-brand-400">
                  {SHOP_INFO.whatsappDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Advantages */}
      <section className="space-y-8" id="advantages-section">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Kami mengutamakan kepuasan pelanggan dengan pelayanan berstandar tinggi dan alur kerja yang 100% transparan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANTAGES.map((adv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
              id={`advantage-card-${idx}`}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center shadow-xs">
                  {getIconComponent(adv.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-950 font-display">{adv.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{adv.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Customer Testimonials */}
      <section className="space-y-8" id="testimonials-section">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            Testimonial Pelanggan
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Ulasan asli dari para pelanggan setia yang mempercayakan perbaikan barang elektroniknya di ServisPro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testi, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6"
              id={`testimonial-card-${idx}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testi.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  "{testi.comment}"
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{testi.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{testi.role}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-300" />
                  {testi.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive FAQ (Equivalent to streamlit expander component) */}
      <section className="bg-slate-100/75 rounded-3xl p-6 sm:p-10 border border-slate-200 max-w-4xl mx-auto space-y-8" id="faq-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-brand-500 shrink-0" />
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Temukan jawaban cepat atas pertanyaan Anda seputar proses, biaya, dan jaminan servis kami.
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari FAQ..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const originalIndex = FAQS.findIndex((f) => f.question === faq.question);
              const isExpanded = expandedFaqIndex === originalIndex;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-2xs"
                  id={`faq-item-${originalIndex}`}
                >
                  <button
                    onClick={() => toggleFaq(originalIndex)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors text-sm sm:text-base cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                        isExpanded ? 'rotate-180 text-brand-500' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isExpanded ? 'max-h-96 border-t border-slate-100 p-4 bg-slate-50/50' : 'max-h-0'
                    }`}
                  >
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              Tidak ada hasil FAQ yang cocok dengan kata kunci "{faqSearch}"
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
