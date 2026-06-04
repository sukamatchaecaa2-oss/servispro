import React from 'react';
import { Wrench, Phone, Mail, MapPin, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { SHOP_INFO } from '../data';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800" id="servispro-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Branding block */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-display">Servis<span className="text-brand-400">Pro</span></span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
            Pusat perbaikan barang-barang elektronik premium terlengkap, tercepat, dan termurah. Dipercaya ribuan pelanggan sejak tahun 2018 dengan rincian garansi tertulis 100% transparan.
          </p>
          <div className="flex items-center gap-2 text-xs bg-slate-800 border border-slate-700/60 p-3 rounded-xl max-w-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Suku cadang original, pengerjaan bergaransi tertulis sampai 90 hari.</span>
          </div>
        </div>

        {/* Col 2: Services Quick Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Kategori Tersedia</h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-white transition">Smartphone & Tablet (HP)</li>
            <li className="hover:text-white transition">Notebook & Laptop Gamer</li>
            <li className="hover:text-white transition">Konsol Game (PS4/PS5/Nintendo)</li>
            <li className="hover:text-white transition">Smart TV & LCD Monitors</li>
            <li className="hover:text-white transition">Home Appliance & Elektronik Lain</li>
          </ul>
        </div>

        {/* Col 3: Contact & Help */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Informasi Kontak</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              <span className="leading-tight">{SHOP_INFO.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-400 shrink-0" />
              <a href={`https://wa.me/${SHOP_INFO.whatsapp}`} className="hover:text-white transition">{SHOP_INFO.whatsappDisplay}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-400 shrink-0" />
              <a href={`mailto:${SHOP_INFO.email}`} className="hover:text-white transition">{SHOP_INFO.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2026 {SHOP_INFO.name}. All Rights Reserved. Terdaftar di Kemenperin ID.</p>
        <div className="flex items-center gap-1.5 text-slate-500">
          <span>Dibuat dengan</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>oleh Tim ServisPro Indonesia</span>
        </div>
      </div>
    </footer>
  );
};
