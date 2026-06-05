import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Map, 
  CheckCheck,
  Zap,
  Activity,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationAlert } from '../types';

interface NotificationBellProps {
  notifications: NotificationAlert[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSimulateNew: (type: 'land' | 'construction') => void;
}

export default function NotificationBell({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSimulateNew
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'land' | 'construction'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Filtered list
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSeverityStyles = (severity: NotificationAlert['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/15 border border-red-500/30 text-red-400';
      case 'medium':
        return 'bg-amber-500/15 border border-amber-500/30 text-amber-400';
      default:
        return 'bg-sky-500/15 border border-sky-500/30 text-sky-450';
    }
  };

  const getIcon = (type: NotificationAlert['type'], severity: NotificationAlert['severity']) => {
    if (severity === 'high') {
      return <ShieldAlert className="w-4 h-4 text-red-400" />;
    }
    if (type === 'land') {
      return <Map className="w-4 h-4 text-emerald-400" />;
    }
    return <Activity className="w-4 h-4 text-teal-400" />;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Icon button with unread count */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg border border-white/5 bg-slate-900/60 transition-all cursor-pointer flex items-center justify-center focus:outline-none"
        title="Pemberitahuan AI Risiko & Mitigasi"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-slate-950 animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            id="notification-dropdown-panel"
            className="absolute right-0 mt-2 w-80 md:w-96 bg-slate-950/98 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-widest">
                  Notifikasi Khusus AI
                </h4>
              </div>
              <div className="flex gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="p-1 text-slate-400 hover:text-emerald-450 hover:bg-white/5 rounded transition-all text-xs flex items-center gap-1 font-mono text-[9px]"
                    title="Tandai semua dibaca"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Selesai dibaca</span>
                  </button>
                )}
                <button
                  onClick={onClearAll}
                  className="p-1 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded transition-all text-xs"
                  title="Hapus semua"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Sub-Tabs */}
            <div className="px-3 py-2 bg-slate-900/50 border-b border-white/5 flex items-center justify-between gap-1">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
                    activeTab === 'all'
                      ? 'bg-brand-gold/20 text-[#D4AF37] border border-brand-gold/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Semua ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('land')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
                    activeTab === 'land'
                      ? 'bg-brand-gold/20 text-[#D4AF37] border border-brand-gold/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Lahan ({notifications.filter(n => n.type === 'land').length})
                </button>
                <button
                  onClick={() => setActiveTab('construction')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
                    activeTab === 'construction'
                      ? 'bg-brand-gold/20 text-[#D4AF37] border border-brand-gold/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sipil ({notifications.filter(n => n.type === 'construction').length})
                </button>
              </div>

              {/* Developer simulator button */}
              <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                <button
                  onClick={() => onSimulateNew('land')}
                  className="p-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded text-[8px] font-mono uppercase border border-emerald-500/10"
                  title="Simulasi Peringatan Lahan"
                >
                  + Lahan
                </button>
                <button
                  onClick={() => onSimulateNew('construction')}
                  className="p-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded text-[8px] font-mono uppercase border border-teal-500/10"
                  title="Simulasi Notifikasi Sipil"
                >
                  + Sipil
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(item => (
                  <div
                    key={item.id}
                    className={`p-3.5 transition-all text-xs relative ${
                      item.isRead ? 'opacity-65 hover:opacity-90' : 'bg-white/2'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 justify-between">
                      {/* Left Block Badge + Title */}
                      <div className="flex gap-2 items-start flex-1 min-w-0">
                        <div className={`p-1.5 rounded-md mt-0.5 ${getSeverityStyles(item.severity)}`}>
                          {getIcon(item.type, item.severity)}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-100 font-sans tracking-tight text-[11px] leading-tight">
                              {item.title}
                            </span>
                            {!item.isRead && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                            )}
                          </div>
                          <p className="text-slate-400 text-[10.5px] leading-relaxed break-words font-sans">
                            {item.description}
                          </p>
                          <span className="text-[9px] text-slate-500 font-mono block">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Right Block Actions */}
                      <div className="flex items-center gap-1">
                        {!item.isRead && (
                          <button
                            onClick={() => onMarkAsRead(item.id)}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded transition-all cursor-pointer"
                            title="Tandai dibaca"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 px-4 text-center">
                  <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-[11px] font-semibold text-slate-400">Tidak Ada Notifikasi Tertunda</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                    Semua sistem pembebasan lahan, status tumpang tindih tata ruang BPN, dan deviasi konstruksi termitigasi secara aman.
                  </p>
                </div>
              )}
            </div>

            {/* Sub-Footer */}
            <div className="px-4 py-2 bg-slate-900 border-t border-white/5 text-[9.5px] text-slate-500 text-center font-mono">
              SaaS AI Engine - Terintegrasi Server BPN & PUPR
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
