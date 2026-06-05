import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Trash2, 
  Clock, 
  User as UserIcon, 
  CheckCircle2, 
  HelpCircle,
  Tag,
  AlertCircle,
  Activity,
  Milestone as MilestoneIcon,
  X
} from 'lucide-react';

export interface ProjectEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: 'milestone' | 'deadline' | 'inspection' | 'general';
  pic: string; // Person in Charge
}

interface TimelineCalendarProps {
  currentUser: {
    fullName: string;
    role: string;
    companyName: string;
  } | null;
}

const PRE_SEEDED_EVENTS: ProjectEvent[] = [
  {
    id: 'EVT-01',
    title: 'Laporan Mingguan Ke-16 Diserahkan',
    description: 'Batas akhir unggah berkas pengawasan fisik minggu ke-16 menuju dashboard Kementerian PUPR.',
    date: '2026-06-01',
    type: 'deadline',
    pic: 'Ir. Raden Pratama'
  },
  {
    id: 'EVT-02',
    title: 'Pemasangan Tiang Pancang Gudang B',
    description: 'Pekerjaan struktur utama untuk tiang pancang pondasi dalam (Spun Pile) Gudang Logistik B.',
    date: '2026-06-04',
    type: 'milestone',
    pic: 'CV Nusantara Mandiri'
  },
  {
    id: 'EVT-03',
    title: 'Laporan Mingguan Ke-17 Batas Akhir',
    description: 'Submission dokumen rekapitulasi progress cuaca dan material lapangan.',
    date: '2026-06-08',
    type: 'deadline',
    pic: 'Ir. Raden Pratama'
  },
  {
    id: 'EVT-04',
    title: 'Audit HSE Keselamatan Kerja Proyek',
    description: 'Pemeriksaan rutin kelayakan alat berat, alat pelindung diri (APD), dan jaring pengaman scaffolding.',
    date: '2026-06-11',
    type: 'inspection',
    pic: 'Bpk. Hendra Wijaya (K3)'
  },
  {
    id: 'EVT-05',
    title: 'Pengecoran Deck Slab Jembatan Utama',
    description: 'Casting beton untuk jalan penghubung utama menggunakan material Ready-mix K-350 PUPR.',
    date: '2026-06-18',
    type: 'milestone',
    pic: 'PT Wijaya Karya Utama'
  },
  {
    id: 'EVT-06',
    title: 'Laporan Mingguan Ke-18 Batas Akhir',
    description: 'Penyusunan berkas evaluasi progres kumulatif beserta Kurva-S deviasi fisik lapangan.',
    date: '2026-06-15',
    type: 'deadline',
    pic: 'Ir. Raden Pratama'
  },
  {
    id: 'EVT-07',
    title: 'Tes Keandalan Jaringan Listrik IoT PJU',
    description: 'Inspeksi fungsional sirkuit smart controller pada sirkulasi smart city smart grid.',
    date: '2026-06-25',
    type: 'inspection',
    pic: 'Bpk. Sofyan (Sistem IoT)'
  },
  {
    id: 'EVT-08',
    title: 'Serah Terima Parsial Struktur Pendukung',
    description: 'Penandatanganan berita acara serah terima parsial gardu listrik induk blok barat dengan PLN.',
    date: '2026-06-30',
    type: 'milestone',
    pic: 'Direksi Utama PT Sinergi'
  },
  {
    id: 'EVT-09',
    title: 'Laporan Bulanan Akhir Juni 2026',
    description: 'Konsolidasi seluruh laporan harian & mingguan Juni guna pencairan termin anggaran berikutnya.',
    date: '2026-06-29',
    type: 'deadline',
    pic: 'Ir. Raden Pratama'
  }
];

export default function TimelineCalendar({ currentUser }: TimelineCalendarProps) {
  // Navigation states (Initial: June 2026 based on live environment time context)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(5); // 0-indexed: 5 is June
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-06-05'); // Default: 5th June 2026

  // Event states
  const [events, setEvents] = useState<ProjectEvent[]>(() => {
    const saved = localStorage.getItem('saas_timeline_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return PRE_SEEDED_EVENTS; }
    }
    return PRE_SEEDED_EVENTS;
  });

  // Filter states
  const [filterType, setFilterType] = useState<string>('all');

  // Modal / Form state for Add Event
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newType, setNewType] = useState<ProjectEvent['type']>('milestone');
  const [newDate, setNewDate] = useState<string>('2026-06-05');
  const [newPic, setNewPic] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('saas_timeline_events', JSON.stringify(events));
  }, [events]);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Calculate grid helper properties
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday, 6 is Saturday
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate calendar days array
  const prevMonthDaysToShow = firstDayIndex; 
  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonthIndex);

  const daysArray: { day: number; month: number; year: number; isCurrent: boolean }[] = [];

  // 1. Prev month tail days
  for (let i = prevMonthDaysToShow - 1; i >= 0; i--) {
    daysArray.push({
      day: daysInPrevMonth - i,
      month: prevMonthIndex,
      year: prevMonthYear,
      isCurrent: false
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push({
      day: d,
      month: currentMonth,
      year: currentYear,
      isCurrent: true
    });
  }

  // 3. Next month head days (to make full 42 grid or nearest 7 multiple)
  const totalSlots = daysArray.length;
  const nextMonthDaysNeeded = totalSlots % 7 === 0 ? 0 : 7 - (totalSlots % 7);
  const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  for (let d = 1; d <= nextMonthDaysNeeded; d++) {
    daysArray.push({
      day: d,
      month: nextMonthIndex,
      year: nextMonthYear,
      isCurrent: false
    });
  }

  const navigatePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const navigateNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const resetToToday = () => {
    const today = new Date();
    // For sandbox demonstration matching IKN project reporting time context, focus on June 2026
    setCurrentYear(2026);
    setCurrentMonth(5); // June
    setSelectedDateStr('2026-06-05');
  };

  const formatSelectedDateHuman = () => {
    if (!selectedDateStr) return '';
    const parts = selectedDateStr.split('-');
    if (parts.length !== 3) return selectedDateStr;
    const y = parseInt(parts[0]);
    const m = parseInt(parts[1]) - 1;
    const d = parseInt(parts[2]);
    return `${d} ${monthNames[m]} ${y}`;
  };

  const getEventsForDate = (dateString: string) => {
    return events.filter(e => {
      // Direct string comparison YYYY-MM-DD
      const evDate = e.date;
      const isDateSelected = evDate === dateString;
      const isTypeMatched = filterType === 'all' || e.type === filterType;
      return isDateSelected && isTypeMatched;
    });
  };

  const getAllEventsForActiveMonth = () => {
    return events.filter(e => {
      if (filterType !== 'all' && e.type !== filterType) return false;
      const parts = e.date.split('-');
      if (parts.length < 2) return false;
      const evYear = parseInt(parts[0]);
      const evMonth = parseInt(parts[1]) - 1; // 0-based
      return evYear === currentYear && evMonth === currentMonth;
    });
  };

  const handleDayClick = (dayObj: { day: number; month: number; year: number }) => {
    const mString = String(dayObj.month + 1).padStart(2, '0');
    const dString = String(dayObj.day).padStart(2, '0');
    const fullDateStr = `${dayObj.year}-${mString}-${dString}`;
    setSelectedDateStr(fullDateStr);
  };

  const addCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: ProjectEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      description: newDescription || 'Tidak ada deskripsi tambahan.',
      date: newDate,
      type: newType,
      pic: newPic.trim() || (currentUser ? currentUser.fullName : 'Pengawas Lapangan')
    };

    setEvents(prev => [...prev, newEv]);
    setSelectedDateStr(newDate); // Auto focus on the newly scheduled date
    
    // Reset fields
    setNewTitle('');
    setNewDescription('');
    setNewPic('');
    setShowAddModal(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Style helper for types
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
      case 'deadline':
        return 'bg-red-500/10 text-red-300 border border-red-500/20';
      case 'inspection':
        return 'bg-teal-500/10 text-teal-300 border border-teal-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border border-slate-500/20';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'milestone': return 'Milestone Fisik';
      case 'deadline': return 'Tenggat Laporan';
      case 'inspection': return 'Inspeksi & HSE';
      default: return 'Kegiatan Umum';
    }
  };

  const getDotColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-amber-500';
      case 'deadline': return 'bg-red-500';
      case 'inspection': return 'bg-teal-500';
      default: return 'bg-slate-400';
    }
  };

  const selectedEvents = getEventsForDate(selectedDateStr);
  const activeMonthEvents = getAllEventsForActiveMonth();

  return (
    <div id="timeline-calendar-wrapper" className="glass-panel p-5 rounded-2xl border border-white/10 space-y-6">
      
      {/* Calendar Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-gold/10 rounded-lg text-[#D4AF37] border border-brand-gold/20">
            <MilestoneIcon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono tracking-wider text-[#D4AF37] uppercase">IKN Project Roadmap & Live Calender</h3>
            <p className="text-[11px] text-slate-400">Sinkronisasi milestones fisik konstruksi sipil & tenggat pelaporan pengawasan.</p>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => {
              setNewDate(selectedDateStr);
              setShowAddModal(true);
            }}
            className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Jadwalkan Milestone
          </button>
        </div>
      </div>

      {/* Grid: 3-Columns (2 Columns for Calendar Calendar Widget, 1 Column for Date Details List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Elements: Controls and Grid Calendar Map (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Calendar Month Selector Navbar Controls */}
          <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-white/5">
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={navigatePrev}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-xs font-mono font-bold text-slate-100 min-w-[120px] text-center">
                {monthNames[currentMonth].toUpperCase()} {currentYear}
              </span>

              <button 
                onClick={navigateNext}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                title="Bulan Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Status Pill / Filter */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400">
                <Filter className="w-3.5 h-3.5 text-brand-gold" />
                <span>Kategori:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded px-2 py-0.5 text-brand-gold-light focus:outline-none focus:ring-1 focus:ring-brand-gold font-mono"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="milestone">Milestone Fisik</option>
                  <option value="deadline">Batas Laporan</option>
                  <option value="inspection">HSE & Audit</option>
                </select>
              </div>

              <button
                onClick={resetToToday}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded font-mono text-[10px] uppercase tracking-wider border border-white/5 transition-all cursor-pointer"
              >
                Hari Ini
              </button>
            </div>
          </div>

          {/* Core Calendar Monthly Grid */}
          <div className="p-3 bg-slate-950/30 rounded-2xl border border-white/5 space-y-2">
            
            {/* Days of week titles */}
            <div className="grid grid-cols-7 gap-1 text-center border-b border-white/5 pb-2">
              {daysOfWeek.map((day, dIdx) => (
                <div 
                  key={day} 
                  className={`text-[10px] font-mono tracking-wider font-bold ${dIdx === 0 ? 'text-red-400' : dIdx === 6 ? 'text-indigo-400' : 'text-slate-400'}`}
                >
                  {day.toUpperCase()}
                </div>
              ))}
            </div>

            {/* Monthly grid cell slots */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {daysArray.map((cell, idx) => {
                const mStr = String(cell.month + 1).padStart(2, '0');
                const dStr = String(cell.day).padStart(2, '0');
                const cellDateStr = `${cell.year}-${mStr}-${dStr}`;
                
                const isSelected = selectedDateStr === cellDateStr;
                const isTodayStr = cellDateStr === '2026-06-05'; // Our simulated baseline current time
                const cellEvents = events.filter(e => e.date === cellDateStr && (filterType === 'all' || e.type === filterType));
                const hasEvents = cellEvents.length > 0;

                return (
                  <button
                    key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
                    onClick={() => handleDayClick(cell)}
                    className={`min-h-[64px] p-1 rounded-lg flex flex-col justify-between items-stretch transition-all relative outline-none cursor-pointer ${
                      cell.isCurrent 
                        ? 'bg-slate-950/40 text-slate-200 border border-white/5 hover:bg-slate-900/60' 
                        : 'bg-slate-950/10 text-slate-500 opacity-40 border border-transparent'
                    } ${isSelected ? 'ring-2 ring-[#D4AF37] border-transparent bg-slate-900/80' : ''}`}
                  >
                    {/* Day Number Row */}
                    <div className="flex justify-between items-center">
                      <span className={`text-[11px] font-mono font-bold ${
                        isSelected 
                          ? 'text-[#D4AF37]' 
                          : isTodayStr 
                            ? 'bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded-full text-[10px]' 
                            : 'text-slate-300'
                      }`}>
                        {cell.day}
                      </span>

                      {/* Small Type Color Pill if multiple */}
                      {hasEvents && (
                        <div className="flex gap-0.5">
                          {(Array.from(new Set(cellEvents.map(e => e.type))) as string[]).map(t => (
                            <span key={t} className={`w-1.5 h-1.5 rounded-full ${getDotColor(t)}`} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick description labels on cell for large screens */}
                    <div className="hidden md:flex flex-col gap-0.5 mt-1 overflow-hidden max-h-[32px] text-[8px] text-left">
                      {cellEvents.slice(0, 2).map(ev => (
                        <div 
                          key={ev.id} 
                          className={`px-1 py-0.5 rounded-sm truncate font-sans ${
                            ev.type === 'milestone' 
                              ? 'bg-amber-500/10 text-amber-300' 
                              : ev.type === 'deadline' 
                                ? 'bg-red-500/10 text-red-300' 
                                : 'bg-teal-500/10 text-teal-300'
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {cellEvents.length > 2 && (
                        <div className="text-[7.5px] text-slate-500 text-right font-mono font-bold">
                          +{cellEvents.length - 2} item
                        </div>
                      )}
                    </div>

                    {/* Small dot indicators for mobile viewports */}
                    <div className="flex md:hidden justify-center items-center mt-1">
                      {hasEvents && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Key Legend Guide */}
          <div className="flex flex-wrap items-center gap-4 text-[10.5px] p-2 bg-slate-950/30 rounded-xl border border-white/5 px-4">
            <span className="text-slate-400 font-mono">Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">Milestone Fisik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-300">Deadline Laporan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span className="text-slate-300">Inspeksi & Mutu</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="px-1.5 py-0.2 px-2 bg-emerald-500 text-slate-950 font-bold rounded text-[9.5px]">5</span>
              <span className="text-slate-400">Hari Ini (Simulasi)</span>
            </div>
          </div>

        </div>

        {/* Right Elements: Date Details Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Active Title bar for details */}
          <div className="bg-slate-900 border border-white/10 p-3.5 rounded-2xl space-y-3">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-brand-gold" />
                <span className="text-xs font-mono font-bold text-slate-200">Agenda Kegiatan</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-white/5 uppercase">
                {selectedDateStr}
              </span>
            </div>

            <div className="text-sm font-bold font-display text-[#D4AF37] border-b border-white/5 pb-2">
              {formatSelectedDateHuman()}
            </div>

            {/* List of events on selected date */}
            {selectedEvents.length > 0 ? (
              <div className="space-y-3.5 overflow-y-auto max-h-[380px] pr-1">
                {selectedEvents.map(ev => (
                  <div 
                    key={ev.id} 
                    className="p-3 bg-slate-950/40 rounded-xl border border-white/5 space-y-2 relative group hover:border-[#D4AF37]/30 transition-all text-xs"
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-mono font-bold ${getTypeBadgeClass(ev.type)}`}>
                        {getTypeLabel(ev.type)}
                      </span>
                      
                      {/* Delete Event Button for custom events */}
                      <button 
                        onClick={() => deleteEvent(ev.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800 transition-all cursor-pointer"
                        title="Hapus Kegiatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-100 font-sans leading-tight text-[12.5px]">{ev.title}</h4>
                    
                    <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{ev.description}</p>

                    {/* PIC & Meta details footer row */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-white/5 font-mono">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[120px]">{ev.pic}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[9.5px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{ev.id}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 px-4 hover:border-white/5 rounded-xl border border-dashed border-white/5 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-300">Tidak Ada Kegiatan Ke-sipilan</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Hari ini bersih dari milestone pengawas maupun batas pengunggahan Kurva-S.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNewDate(selectedDateStr);
                    setShowAddModal(true);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[#D4AF37] border border-brand-gold/20 rounded font-mono text-[10px] tracking-wide transition-all cursor-pointer"
                >
                  + Jadwalkan Baru
                </button>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar for Active Month */}
          <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl text-xs space-y-2">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Ringkasan Bulan {monthNames[currentMonth]}</span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2 rounded border border-white/5">
                <div className="text-[10.5px] text-slate-400 font-sans">Total Agenda</div>
                <div className="text-lg font-bold font-mono text-slate-100 mt-0.5">{activeMonthEvents.length}</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-white/5">
                <div className="text-[10.5px] text-slate-400 font-sans">Milestone Utama</div>
                <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                  {activeMonthEvents.filter(e => e.type === 'milestone').length}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: ADD CUSTOM MILESTONE / EVENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm glass-panel bg-slate-900 border border-white/10 rounded-2xl p-5 lg:p-6 shadow-2xl text-slate-100 flex flex-col space-y-4">
            
            {/* Modal Heading Area */}
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5 text-brand-gold font-mono font-bold text-xs uppercase tracking-wider">
                <CalendarIcon className="w-4 h-4 text-brand-gold" />
                <span>Rancang Agenda Baru</span>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={addCustomEvent} className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="block text-slate-400 font-semibold mb-0.5">Judul Kegiatan / Milestone</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemasangan Tiang Pancang Utama"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 font-semibold mb-0.5">Pilih Kategori</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ProjectEvent['type'])}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                >
                  <option value="milestone">Milestone Fisik Lapangan</option>
                  <option value="deadline">Batas Akhir Pelaporan Pengawas</option>
                  <option value="inspection">HSE & Audit Verifikasi Lapangan</option>
                  <option value="general">Kegiatan Sipil Umum</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold mb-0.5">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400 font-semibold mb-0.5">Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ir. Raden Pratama"
                    value={newPic}
                    onChange={(e) => setNewPic(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 font-semibold mb-0.5">Uraian Detil Kegiatan</label>
                <textarea
                  rows={3}
                  placeholder="Masukkan deskripsi penimbangan, aspal ready-mix, koordinat lapangan, atau persyaratan pelaporan berkas..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-white/10 rounded text-xs transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold rounded text-xs hover:brightness-110 transition-all cursor-pointer"
                >
                  Simpan Jadwal
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
