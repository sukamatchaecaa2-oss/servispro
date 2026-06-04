import React, { useState } from 'react';
import { LoggedInUser, UserRole } from '../types';
import { KeyRound, Mail, ShieldAlert, BadgeInfo, Chrome, ArrowRight, UserCheck } from 'lucide-react';

interface GoogleLoginSectionProps {
  onLogin: (user: LoggedInUser) => void;
}

export const GoogleLoginSection: React.FC<GoogleLoginSectionProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123'); // Preset password for convenient simulation
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Email Gmail tidak boleh kosong');
      return;
    }

    if (!cleanEmail.endsWith('@gmail.com')) {
      setError('Gunakan alamat Gmail yang valid (Harus berakhiran @gmail.com)');
      return;
    }

    // Determine role based on specific instructions:
    // "Di dalam kode, hardcode satu email khusus sebagai ADMIN (Contoh: 'admin.servispro@gmail.com')"
    const role: UserRole = cleanEmail === 'admin.servispro@gmail.com' ? 'admin' : 'customer';
    
    // Determine default name
    const resolvedName = name.trim() || (role === 'admin' ? 'ServisPro Admin Team' : cleanEmail.split('@')[0]);

    const loggedInUser: LoggedInUser = {
      email: cleanEmail,
      name: resolvedName.substring(0, 1).toUpperCase() + resolvedName.substring(1),
      role: role,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(resolvedName)}`,
    };

    onLogin(loggedInUser);
  };



  return (
    <div className="max-w-md mx-auto my-8 animate-fade-in" id="google-login-container">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-100 flex flex-col">
        {/* Top Google simulated branding bar */}
        <div className="bg-slate-50 border-b border-slate-150 p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Chrome className="w-4 h-4 text-brand-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs font-bold text-slate-500 tracking-wide font-sans">Simulasi Google Sign-In</span>
          </div>
          <span className="px-2 py-0.5 text-[10px] bg-slate-200 text-slate-600 rounded-full font-bold">Lokal</span>
        </div>

        {/* Real-looking Google Identity Form */}
        <div className="p-6 sm:p-8 flex-1 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2 font-display">
              <span>🔑</span> ServisPro Login
            </h1>
            <p className="text-xs text-slate-500 font-medium">Gunakan akun Gmail Anda untuk mengakses sistem secara aman</p>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-start gap-2 border border-red-200 animate-bounce">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">📧 ALAMAT EMAIL GMAIL</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Contoh: pelanggan@gmail.com atau admin.servispro@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-205 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-405 font-medium"
                  id="google-email-input"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">🔒 KATA SANDI (PASSWORD)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-205 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-405 font-mono"
                  id="google-password-input"
                />
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">👤 NAMA LENGKAP (OPSIONAL)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                  <UserCheck className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Contoh: Aditya Pratama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-205 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-405 font-medium"
                  id="google-name-input"
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
              id="google-submit-login-btn"
            >
              🚀 Masuk Ke Sistem
            </button>
          </form>
        </div>

        {/* Explanations Info Box to satisfy logical expectations */}
        <div className="bg-slate-50 p-4 border-t border-slate-150 rounded-b-3xl text-[11px] text-slate-500 flex items-start gap-2 leading-relaxed">
          <BadgeInfo className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p><strong>Informasi Hak Akses Sistem:</strong></p>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>Login dengan email <strong>admin.servispro@gmail.com</strong> agar sistem dapat mendeteksi hak akses <strong>ADMIN</strong> dengan antarmuka kelola teknisi & dashboard keuangan lengkap.</li>
              <li>Login dengan email Gmail lainnya dideteksi otomatis sebagai <strong>PELANGGAN</strong> untuk mengakses info, booking servis, dan melacak progres.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
