import React, { useState } from 'react';
import { 
  auth, 
  db, 
  handleFirestoreError, 
  OperationType 
} from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Building, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  ChevronRight, 
  ShieldAlert, 
  Briefcase 
} from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (userProfile: User) => void;
  onCancel: () => void;
  showCancelBtn?: boolean;
}

export default function AuthScreen({ onAuthSuccess, onCancel, showCancelBtn = false }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration additional fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<User['role']>('developer');

  // UI state
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Form field-level validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!password) {
      errors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }

    if (!isLogin) {
      if (!fullName.trim()) {
        errors.fullName = 'Nama lengkap wajib diisi';
      }
      if (!companyName.trim()) {
        errors.companyName = 'Nama perusahaan wajib diisi';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setInfoMessage(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // Sign In Action
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        // Fetch User Profile from Firestore "/users/{uid}"
        let profile: User | null = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            profile = userDoc.data() as User;
          }
        } catch (err) {
          console.warn('Gagal mengambil profil dari Firestore, menggunakan fallback schema.', err);
        }

        // Fallback user profile setup if no document exists
        if (!profile) {
          profile = {
            id: fbUser.uid,
            email: fbUser.email || email,
            role: 'developer',
            fullName: fbUser.displayName || 'Ir. Rekanan Baru',
            companyName: 'Nusantara Karya, PT'
          };
          // Try to create the missing Firestore profile lazily
          try {
            await setDoc(doc(db, 'users', fbUser.uid), {
              uid: fbUser.uid,
              email: profile.email,
              fullName: profile.fullName,
              role: profile.role,
              companyName: profile.companyName
            });
          } catch (createErr) {
            console.error('Lazy profile creation failed:', createErr);
          }
        }

        onAuthSuccess(profile);
      } else {
        // Sign Up / Register Action
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        const newProfile: User = {
          id: fbUser.uid,
          email: email,
          role: role,
          fullName: fullName,
          companyName: companyName
        };

        // Write new profile to Firestore with transaction safety
        const path = `users/${fbUser.uid}`;
        try {
          await setDoc(doc(db, 'users', fbUser.uid), {
            uid: fbUser.uid,
            email: email,
            fullName: fullName,
            role: role,
            companyName: companyName
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.CREATE, path);
        }

        setInfoMessage('Akun baru berhasil didaftarkan! Mengarahkan ke Dashboard...');
        setTimeout(() => {
          onAuthSuccess(newProfile);
        }, 1500);
      }
    } catch (err: any) {
      console.error('Firebase Auth action failed:', err);
      let errorMsg = 'Terjadi kesalahan sistem internal. Silakan hubungi admin.';
      
      if (err.code === 'auth/user-not-found') {
        errorMsg = 'Akun email tidak terdaftar. Silakan lakukan registrasi terlebih dahulu.';
      } else if (err.code === 'auth/wrong-password') {
        errorMsg = 'Kombinasi password salah. Silakan coba kembali.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'Email ini sudah digunakan oleh akun lain.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Format email yang dimasukkan tidak sah.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password kurang kuat. Minimal sampaikan 6 karakter.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'Metode Email/Password belum diaktifkan di Firebase Console Auth.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-10 animate-fade-in">
      {/* Dynamic Glowing Accents behind Card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      
      {/* Frosted Glass Container Card */}
      <div className="relative glass-panel bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl text-slate-100">
        
        {/* Branding Title Area */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold font-display text-white tracking-tight">
            {isLogin ? 'MASUK PORTAL SAAS' : 'DAFTAR SAAS UTAMA'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin 
              ? 'Lakukan autentikasi untuk memuat masterplan konstruksi' 
              : 'Daftarkan profil baru untuk memulai sirkulasi data Sipil'
            }
          </p>
        </div>

        {/* Info or Message Banners */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{serverError}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg flex items-start gap-2 text-xs text-emerald-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{infoMessage}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleAuthAction} className="space-y-4">
          
          {/* 1. Full name during Sign Up */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Contoh: Ir. Raden Pratama"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-white/5 border rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all ${validationErrors.fullName ? 'border-red-500 bg-red-500/5' : 'border-white/10'}`}
                />
              </div>
              {validationErrors.fullName && <p className="text-[10px] text-red-400">{validationErrors.fullName}</p>}
            </div>
          )}

          {/* 2. Email field */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="email"
                placeholder="developer@fortuna.co.id"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 bg-white/5 border rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all autoComplete="email" ${validationErrors.email ? 'border-red-500 bg-red-500/5' : 'border-white/10'}`}
              />
            </div>
            {validationErrors.email && <p className="text-[10px] text-red-400">{validationErrors.email}</p>}
          </div>

          {/* 3. Password field */}
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="password"
                placeholder="******"
                value={password}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 bg-white/5 border rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all ${validationErrors.password ? 'border-red-500 bg-red-500/5' : 'border-white/10'}`}
              />
            </div>
            {validationErrors.password && <p className="text-[10px] text-red-400">{validationErrors.password}</p>}
          </div>

          {/* 4. Extra fields during Sign Up */}
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">Nama Perusahaan (PT/BUMDes)</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Contoh: Nusantara Karya, PT"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 bg-white/5 border rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all ${validationErrors.companyName ? 'border-red-500 bg-red-500/5' : 'border-white/10'}`}
                  />
                </div>
                {validationErrors.companyName && <p className="text-[10px] text-red-400">{validationErrors.companyName}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">SaaS Persona / Jabatan</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as User['role'])}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  >
                    <option value="developer">Developer Perumahan / Kawasan</option>
                    <option value="contractor">Kontraktor Sipil</option>
                    <option value="investor">Global L.P. Investor</option>
                    <option value="government_official">Pemda / BUMDes</option>
                    <option value="admin">SaaS Multi-tenant Admin</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-600 text-slate-900 font-bold text-xs rounded-lg uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Memverifikasi...' : 'Mendaftarkan...'}
              </>
            ) : (
              <>
                {isLogin ? 'Masuk Sekarang' : 'Daftar Akun Baru'} <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Show Cancel / Guest Access if requested */}
          {showCancelBtn && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 bg-slate-900/60 border border-white/10 hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-300 transition-all cursor-pointer"
            >
              Kembali ke Landing Page
            </button>
          )}
        </form>

        {/* Tab Switcher */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-slate-400">
          {isLogin ? (
            <p>
              Belum memiliki akses?{' '}
              <button 
                onClick={() => setIsLogin(false)}
                className="text-[#D4AF37] font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Daftar Akun Baru
              </button>
            </p>
          ) : (
            <p>
              Sudah memiliki akun terdaftar?{' '}
              <button 
                onClick={() => setIsLogin(true)}
                className="text-[#D4AF37] font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Masuk ke Portal
              </button>
            </p>
          )}
        </div>

        {/* Developer Sandbox Instruction Footer */}
        <div className="mt-6 p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl space-y-2 text-[10px] text-slate-300 leading-relaxed font-sans">
          <div className="flex items-center gap-1 text-[#D4AF37] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Panduan Pengembang (Sandbox)
          </div>
          <p>
            1. Pastikan Anda mengaktifkan metode <strong>Email/Password</strong> di panel <a href="https://console.firebase.google.com/project/marketplace-30272/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline font-mono">Firebase Console</a>.
          </p>
          <p>
            2. Ingin test cepat? Anda dapat mendaftarkan akun baru apa saja dengan email & password minimal 6 karakter. Profil akan langsung tersinkron secara aman ke Firestore!
          </p>
        </div>

      </div>
    </div>
  );
}
