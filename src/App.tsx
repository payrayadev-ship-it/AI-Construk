/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  FileText, 
  Calculator, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Landmark, 
  Download, 
  Upload, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  HelpCircle, 
  FileCheck2, 
  RefreshCw, 
  User as UserIcon,
  Search,
  Scale,
  Compass,
  ArrowRight
} from 'lucide-react';
import { 
  User, 
  ProposalInput, 
  ProposalOutput, 
  RabInput, 
  RabOutput, 
  GISPolygon, 
  GISUtility, 
  LandCertificate, 
  ProjectUpdate, 
  ProjectMetadata, 
  IndustrialEstateSim, 
  InvestorPortfolio, 
  SmartSensor 
} from './types';
import Navigation from './components/Navigation';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-928',
    email: 'payrayadev@gmail.com',
    role: 'developer',
    fullName: 'Ir. Raden Pratama',
    companyName: 'Nusantara Karya, PT'
  });

  // Global UI Alert/Toast state:
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // State for Module 1: AI Proposal
  const [proposalInput, setProposalInput] = useState<ProposalInput>({
    projectName: 'Grand Nusantara Technopolis',
    location: 'ikn',
    landSize: 250000,
    investmentValue: 850000000000, // 850 Milyar Rupiah
    projectType: 'industrial'
  });
  const [proposalOutput, setProposalOutput] = useState<ProposalOutput | null>(null);
  const [generatingProposal, setGeneratingProposal] = useState(false);

  // State for Module 2: AI RAB
  const [rabInput, setRabInput] = useState<RabInput>({
    jobName: 'Pembangunan Jalan Akses Beton KIPP-A1',
    length: 1200,
    width: 6,
    thickness: 0.28,
    location: 'Ibu Kota Nusantara Penajam',
    materialStandard: 'PUPR-2023'
  });
  const [rabOutput, setRabOutput] = useState<RabOutput | null>(null);
  const [generatingRab, setGeneratingRab] = useState(false);

  // State for Module 3: GIS Masterplan
  const [gisPolygons, setGisPolygons] = useState<GISPolygon[]>([
    { id: 'poly-1', name: 'Kavling Manufaktur Elektronik A', type: 'industrial', coordinates: [[-0.425, 116.945], [-0.425, 116.949], [-0.428, 116.949], [-0.428, 116.945]], area: 160000, color: '#D4AF37', owner: 'PT Global Indo Chipset', status: 'Disetujui Pemda' },
    { id: 'poly-2', name: 'Green Buffer Zone Rimba Raya', type: 'green', coordinates: [[-0.421, 116.940], [-0.421, 116.944], [-0.424, 116.944], [-0.424, 116.940]], area: 120000, color: '#10B981', owner: 'Kementerian LHK', status: 'Konservasi' },
    { id: 'poly-3', name: 'Zona Listrik & Sub-Gardu PLN', type: 'utility', coordinates: [[-0.429, 116.950], [-0.429, 116.953], [-0.431, 116.953], [-0.431, 116.950]], area: 45000, color: '#EF4444', owner: 'PT PLN (Persero)', status: 'Konstruksi Penuh' }
  ]);
  const [selectedPolygon, setSelectedPolygon] = useState<GISPolygon | null>(null);
  const [gisMeasureResult, setGisMeasureResult] = useState<string | null>(null);
  const [activeGeoLayer, setActiveGeoLayer] = useState<string>('all');
  const [drawingType, setDrawingType] = useState<string | null>(null);

  // State for Module 4: Land Management
  const [certificates, setCertificates] = useState<LandCertificate[]>([
    { id: 'LC-101', certificateNumber: 'SHM-2910-KIPP', type: 'SHM', ownerName: 'H. Sugianto bin Abidin', area: 12500, location: 'Sepaku, Penajam Paser Utara', status: 'Clean & Clear', liberationProgress: 100, compensationValue: 12500000000 },
    { id: 'LC-102', certificateNumber: 'HGB-8843-SEPAKU', type: 'HGB', ownerName: 'PT Nusantara Logistics Hub', area: 55000, location: 'Kawasan Industri KIPP', status: 'Acquired', liberationProgress: 100, compensationValue: 48500000000 },
    { id: 'LC-103', certificateNumber: 'AJB-028-ADAT', type: 'AJB', ownerName: 'Keluarga Adat Dayak Paser', area: 18000, location: 'Batas Sektor Barat 4', status: 'Disputed', liberationProgress: 45, compensationValue: 16200000000 },
    { id: 'LC-104', certificateNumber: 'HGU-092-BUMD', type: 'HGU', ownerName: 'BUMD Kaltim Prima', area: 140000, location: 'Daerah Penyangga PJU', status: 'In Negotiation', liberationProgress: 75, compensationValue: 112000000000 }
  ]);
  const [searchCert, setSearchCert] = useState('');
  const [selectedCert, setSelectedCert] = useState<LandCertificate | null>(null);
  const [analyzingLandRisk, setAnalyzingLandRisk] = useState(false);

  // State for Module 5: Project Management & Curve-S Updates
  const [projectMetadata, setProjectMetadata] = useState<ProjectMetadata>({
    id: 'PRJ-IKN-01',
    name: 'Kawasan Industri Strategis Nusantara - Fase 1',
    budget: 3450000000000, // 3.45 Triliun
    spent: 2415000000000,
    plannedDurationWeeks: 24,
    currentWeek: 16,
    history: [
      {
        id: 'REP-16',
        reportDate: '2026-06-01',
        reportType: 'Weekly',
        physicalProgress: 68.4,
        financialProgress: 70.0,
        actualCashflowOut: 115000000000,
        actualCashflowIn: 130000000000,
        workSummary: 'Pemasangan struktur baja gudang logistik blok B, penggelaran aspal primer jalan tipe K, dan finishing pemasangan saluran drainase modular tipe V.',
        constrains: 'Curah hujan tidak menentu dari sore hingga malam hari, penyuplaian tiang pancang sempat tertahan di pelabuhan Balikpapan selama 2 hari.',
        materialsUsed: [
          { name: 'Semen Portland Campuran', quantity: '420 Ton' },
          { name: 'Rambu Baja Struktural', quantity: '115 Unit' },
          { name: 'Ready-mix Beton K-350', quantity: '1,840 m³' }
        ],
        photoUrls: ['/photo1.jpg'],
        aiAnalysis: {
          progressStatus: 'Minor Delay',
          delayRisk: 'Menengah. Potensi denda jika pengerjaan jalan utama tertunda memasuki bulan Juni basah.',
          deviationPercentage: -1.6,
          mitigationStrategy: 'Percepat pengerjaan aspal ke pagi-siang hari. Tambah unit concrete pump mobile untuk memotong siklus pengecoran.'
        }
      }
    ]
  });
  
  // Controls for report submittal
  const [newProgress, setNewProgress] = useState({
    physical: 70.2,
    financial: 71.5,
    summary: 'Melanjutkan pengisian kerikil agregat lapis A dan testing fungsionalitas Lampu Penerangan Jalan Umum berbasis sirkuit IoT pintar.',
    constrains: 'Ketersediaan operator grader cadangan terbatas.'
  });
  const [submittingReport, setSubmittingReport] = useState(false);

  // State for Module 6: Kawasan Industri Simulator
  const [industrialSim, setIndustrialSim] = useState<IndustrialEstateSim>({
    id: 'SIM-IKN-TECH',
    name: 'Kawasan Ekonomi Khusus Nongsa Digital Park Expansion',
    totalAreaHectares: 120,
    developmentPhases: 3,
    capexLandAcquisition: 80000000000, // 80 M
    capexInfrastructure: 150000000000, // 150 M
    opexAnnual: 12000000000, // 12 M
    estimatedSellingPricePerSqm: 2800000, // 2.8 jt / m2
    occupancyRatePercentage: 75,
    financialMetrics: {
      roi: 32.4,
      irr: 19.8,
      npv: 84300000000,
      paybackPeriodYears: 3.8
    }
  });
  const [simulatingEstate, setSimulatingEstate] = useState(false);

  // State for Module 7: Investor Dashboard
  const [portfolio, setPortfolio] = useState<InvestorPortfolio>({
    totalAssetsUnderManagement: 7420000000000, // 7.42 T
    historicalYieldPercentage: 16.8,
    allocatedProjects: [
      { projectId: 'PRJ-IKN-01', projectName: 'Kawasan Industri Nusantara', investedAmount: 1800000000000, sharesOutstandingPercentage: 52, currentValuation: 2150000000000, roiToDate: 19.4, status: 'Konstruksi Aktif' },
      { projectId: 'PRJ-PIK-02', projectName: 'Green Logistics Park PIK 2', investedAmount: 950000000000, sharesOutstandingPercentage: 35, currentValuation: 1100000000000, roiToDate: 15.7, status: 'Operasional Sebagian' },
      { projectId: 'PRJ-KND-03', projectName: 'Smelter Nikel & Terminal Kendal', investedAmount: 2200000000000, sharesOutstandingPercentage: 40, currentValuation: 2650000000000, roiToDate: 20.4, status: 'Konstruksi Madya' },
      { projectId: 'PRJ-NGS-04', projectName: 'Batam Nongsa AI Center Hub', investedAmount: 150000000000, sharesOutstandingPercentage: 15, currentValuation: 185000000000, roiToDate: 23.3, status: 'Fase Perencanaan' }
    ]
  });

  // State for Module 8: Smart Village & City Sensors
  const [sensors, setSensors] = useState<SmartSensor[]>([
    { id: 'SENS-PJU-01', name: 'PJU Gerbang Utama', type: 'PJU', locationName: 'Jalan Akses Utama Blok A', coordinates: [-0.426, 116.947], status: 'Normal', value: '75% Efisiensi Daya Listrik (LED)', lastUpdated: 'Baru saja' },
    { id: 'SENS-PJU-02', name: 'PJU Koridor Timur', type: 'PJU', locationName: 'Jalur Hijau Sub-sektor C', coordinates: [-0.428, 116.948], status: 'Waspada', value: '0% Putus Arus Bulb Trip', lastUpdated: '3 menit lalu' },
    { id: 'SENS-IRI-01', name: 'Debit Irigasi Bendungan Sepaku', type: 'Irigasi', locationName: 'Saluran Tersier Kanan', coordinates: [-0.422, 116.942], status: 'Normal', value: 'Debit Air: 14.2 m³/s', lastUpdated: '1 menit lalu' },
    { id: 'SENS-ROB-01', name: 'Sensor Intrusi Rob Pesisir', type: 'RobPesisir', locationName: 'Pantai Barat Sepaku Mandiri', coordinates: [-0.435, 116.938], status: 'Siaga', value: 'Tinggi Pasang: +1.35m (Batas Aman 1.5m)', lastUpdated: 'Baru saja' },
    { id: 'SENS-BAN-01', name: 'Level Banjir Sekunder', type: 'Banjir', locationName: 'Jembatan Hulu Sungai Sepaku', coordinates: [-0.420, 116.940], status: 'Waspada', value: 'Ketinggian Air: 2.1m (Status Kuning)', lastUpdated: '5 detik lalu' },
    { id: 'SENS-JAL-01', name: 'Sensor Keretakan Jalan', type: 'JalanDesa', locationName: 'Jalan Penghubung Desa Bumi', coordinates: [-0.430, 116.945], status: 'Normal', value: 'Kehalusan Grid: 94/100 IRI Index', lastUpdated: '2 jam lalu' }
  ]);

  // Automated updates simulation for the smart sensors
  useEffect(() => {
    const timer = setInterval(() => {
      setSensors(prevSensors => prevSensors.map(sensor => {
        if (Math.random() > 0.6) {
          const statuses: SmartSensor['status'][] = ['Normal', 'Siaga', 'Waspada'];
          const pickedStatus = statuses[Math.floor(Math.random() * statuses.length)];
          let nv = sensor.value;
          if (sensor.type === 'PJU') nv = `${Math.floor(Math.random() * 40 + 60)}% Kecerahan LED`;
          if (sensor.type === 'Banjir') nv = `Ketinggian Air: ${(Math.random() * 1.5 + 1.0).toFixed(2)}m`;
          if (sensor.type === 'Irigasi') nv = `Debit Aliran: ${(Math.random() * 8 + 8).toFixed(1)} m³/s`;
          return {
            ...sensor,
            status: pickedStatus,
            value: nv,
            lastUpdated: 'Baru saja diperbarui'
          };
        }
        return sensor;
      }));
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // System status parameters (Admin panel)
  const [gatewayLogs, setGatewayLogs] = useState<string[]>([
    'SYSTEM: [Bootstrap] Fortuna Construct AI core system initialized.',
    'GATEWAY: Firebase OAuth client session established securely.',
    'POSTGIS: DB Connection pool initialized. Max 50 connections.',
    'AI_ENGINE: Gemini API gateway linked using regional multi-tenant model.'
  ]);

  // Handle Proposal Generation
  const triggerProposalGenerate = async () => {
    setGeneratingProposal(true);
    try {
      const response = await fetch('/api/proposal/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalInput)
      });
      if (!response.ok) throw new Error('Gagal berkomunikasi dengan server.');
      const data = await response.json();
      setProposalOutput(data);
      showToast('Kajian Kelayakan & Struktur Investor Pitch Deck berhasil dibuat oleh AI!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal generate proposal', 'warning');
    } finally {
      setGeneratingProposal(false);
    }
  };

  // Handle RAB Generation
  const triggerRabGenerate = async () => {
    setGeneratingRab(true);
    try {
      const response = await fetch('/api/rab/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rabInput)
      });
      if (!response.ok) throw new Error('Gagal memanggil modul estimasi PUPR & SNI.');
      const data = await response.json();
      setRabOutput(data);
      showToast('Master RAB, Analisis BOQ, & data Kurva-S berhasil dihitung menggunakan pilar standar sipil!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghitung RAB', 'warning');
    } finally {
      setGeneratingRab(false);
    }
  };

  // Analyze Land Protection & Risk
  const triggerLandRiskAnalysis = async (cert: LandCertificate) => {
    setAnalyzingLandRisk(true);
    try {
      const response = await fetch('/api/land/risk-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateNumber: cert.certificateNumber,
          certType: cert.type,
          ownerName: cert.ownerName,
          area: cert.area,
          location: cert.location,
          riskContext: cert.status === 'Disputed' ? 'Ada gugatan batas hak adat ulayat setempat.' : ''
        })
      });
      if (!response.ok) throw new Error('Integrasi BPN kementerian ATR Gagal.');
      const result = await response.json();
      
      setCertificates(prev => prev.map(c => {
        if (c.id === cert.id) {
          return { ...c, riskAnalysis: result };
        }
        return c;
      }));

      // Update selected certificate
      setSelectedCert(prev => {
        if (prev?.id === cert.id) {
          return { ...prev, riskAnalysis: result };
        }
        return prev;
      });

      showToast(`Analisis Risiko Legalitas Agraria UUPA untuk ${cert.certificateNumber} Selesai!`, 'success');
    } catch (err: any) {
      showToast('Gagal memproses analisis risiko legal', 'warning');
    } finally {
      setAnalyzingLandRisk(false);
    }
  };

  // Submit project progress weekly
  const handleProjectReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      const response = await fetch('/api/project/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          physicalProgress: newProgress.physical,
          financialProgress: newProgress.financial,
          workSummary: newProgress.summary,
          constrains: newProgress.constrains
        })
      });
      const aiResponse = await response.json();
      
      const newUpdate: ProjectUpdate = {
        id: `REP-${projectMetadata.history.length + 17}`,
        reportDate: new Date().toISOString().split('T')[0],
        reportType: 'Weekly',
        physicalProgress: newProgress.physical,
        financialProgress: newProgress.financial,
        actualCashflowOut: 98000000000,
        actualCashflowIn: 110000000000,
        workSummary: newProgress.summary,
        constrains: newProgress.constrains,
        materialsUsed: [
          { name: 'Beton Pracetak Box Culvert', quantity: '120 Pcs' },
          { name: 'Asphal Hotmix AC-WC', quantity: '820 Ton' }
        ],
        photoUrls: [],
        aiAnalysis: aiResponse
      };

      setProjectMetadata(prev => ({
        ...prev,
        currentWeek: prev.currentWeek + 1,
        spent: prev.spent + 98000000000,
        history: [newUpdate, ...prev.history]
      }));

      showToast('Weekly Site Report berhasil dimasukkan. AI Engine menganalisis deviasi!', 'success');
    } catch (e) {
      showToast('Error memproses laporan konstruksi', 'warning');
    } finally {
      setSubmittingReport(false);
    }
  };

  // Run Industrial Estate Simulator
  const triggerEstateSim = async () => {
    setSimulatingEstate(true);
    try {
      const response = await fetch('/api/industrial/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(industrialSim)
      });
      const data = await response.json();
      setIndustrialSim(data);
      showToast('Simulasi Model Finansial Regional KEK Berhasil Diperbarui!', 'success');
    } catch (e) {
      showToast('Gagal mensimulasi data keuangan', 'warning');
    } finally {
      setSimulatingEstate(false);
    }
  };

  // Draw simulation on Masterplan GIS
  const handleMapDraw = (type: string) => {
    setDrawingType(type);
    showToast(`Draw Mode Aktif: Klik area Masterplan untuk meletakkan koordinat ${type}.`, 'info');
  };

  const handleMapClickSim = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingType) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Place a mockup polygon
    const randomId = `poly-${Date.now()}`;
    const colors: Record<string, string> = {
      industrial: '#D4AF37',
      road: '#64748B',
      green: '#10B981',
      utility: '#3B82F6'
    };

    const newPoly: GISPolygon = {
      id: randomId,
      name: `Kavling Buatan Baru (${drawingType})`,
      type: drawingType as any,
      coordinates: [[-0.425 - (y / 10000), 116.945 + (x / 10000)]],
      area: Math.round(Math.random() * 45000 + 10000),
      color: colors[drawingType] || '#D4AF37',
      owner: currentUser.companyName,
      status: 'Pengajuan Digital Twin'
    };

    setGisPolygons([...gisPolygons, newPoly]);
    setSelectedPolygon(newPoly);
    setDrawingType(null);
    showToast(`Berhasil menaruh Polygon ${drawingType} pada masterplan koordinat GIS!`, 'success');
  };

  const triggerGisOverlay = (type: string) => {
    if (type === 'buffer') {
      setGisMeasureResult('BUFFER BERHASIL: Membuat zonasi penyangga 50m di radius sub-gardu PLN.');
      showToast('Buffer analysis berhasil disimulasikan pilar GIS!', 'success');
    } else {
      setGisMeasureResult('OVERLAY ANALISIS: 92.5% Lahan di zonasi KIPP ini berstatus Clean & Clear dari tumpang tindih kawasan lindung KLHK.');
      showToast('Kalkulasi overlay digital twin ATR/BPN selesai.', 'success');
    }
  };

  // Simulated download triggers
  const triggerDownloadLog = (format: 'pdf' | 'docx' | 'xlsx', name: string) => {
    showToast(`Mempersiapkan export arsip digital ${format.toUpperCase()} untuk ${name}...`, 'info');
    setTimeout(() => {
      showToast(`Berhasil mengunduh dokumen ${name}.${format} secara aman dan langsung.`, 'success');
    }, 2000);
  };

  return (
    <div id="construct-ai-root" className="min-h-screen bg-[#020817] font-sans text-slate-200 overflow-x-hidden selection:bg-brand-gold selection:text-slate-950 flex flex-col">
      
      {/* Toast Alert banner system */}
      {toast && (
        <div id="construct-toast" className={`fixed top-16 right-4 lg:top-6 lg:right-6 z-50 flex items-center p-4 rounded-xl border shadow-2xl backdrop-blur-xl animate-pulse transition-all max-w-sm ${toast.type === 'success' ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-slate-100' : 'bg-slate-900 border-red-500/50 text-red-100'}`}>
          <div className="mr-3">
            {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" /> : <AlertTriangle className="h-5 w-5 text-red-400" />}
          </div>
          <div className="text-xs font-semibold leading-relaxed">{toast.message}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row pb-12 lg:pb-0">
        
        {/* Sitemenu components */}
        <Navigation 
          currentView={currentView} 
          setCurrentView={(view) => {
            setCurrentView(view);
            // Auto trigger seed if views are first visited
            if (view === 'proposal' && !proposalOutput) {
              triggerProposalGenerate();
            }
            if (view === 'rab' && !rabOutput) {
              triggerRabGenerate();
            }
          }} 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser} 
        />

        {/* Action center viewport */}
        <main className="flex-1 flex flex-col lg:pl-72 min-h-screen">
          
          {/* Top header panel */}
          <header className="hidden lg:flex h-16 items-center justify-between px-8 bg-slate-950/20 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-4">
              <span className="text-xs bg-brand-gold/15 text-[#D4AF37] px-2.5 py-1 rounded border border-brand-gold/30 font-display font-medium tracking-wide">
                SAAS PORTAL PERSONA: <strong className="uppercase">{currentUser.role}</strong>
              </span>
              <div className="w-px h-4 bg-white/10"></div>
              <span className="text-xs text-slate-400 font-mono">
                CONNECTED: Nusantara Cloud Node
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5 text-xs">
                <div id="live-indicator-dot" className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-mono text-slate-300 font-medium">IKN Nusantara - Phase 2 Active</span>
              </div>
              <button 
                id="header-quick-action"
                onClick={() => {
                  setCurrentView('proposal');
                  showToast('Modul AI Proposal Generator Siap!', 'info');
                }}
                className="px-4 py-1.5 bg-[#D4AF37] text-slate-950 font-bold text-xs rounded shadow-lg hover:brightness-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
              >
                PROPOSAL ENGINE
              </button>
            </div>
          </header>

          {/* Core pages router renderer */}
          <div className="flex-1 p-4 lg:p-6 space-y-6">
            
            {/* 1. VIEW LANDING PAGE */}
            {currentView === 'landing' && (
              <div id="view-landing" className="space-y-8 max-w-6xl mx-auto py-4 fade-in-up">
                
                {/* Hero Banner Title Area */}
                <div className="text-center space-y-4 py-8 relative">
                  <div className="absolute inset-0 bg-[#D4AF37]/5 blur-3xl rounded-full scale-75 -z-10"></div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 rounded-full border border-brand-gold/30 text-[10px] uppercase font-mono tracking-wider text-[#D4AF37] mb-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> Platform Infrastruktur Nasional Indonesia
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight">
                    FORTUNA <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFF] to-[#D4AF37] bg-clip-text text-transparent">CONSTRUCT AI</span>
                  </h1>
                  <p className="text-sm lg:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
                    Super App Konstruksi, Pembebasan Lahan (Land Management), Perencanaan Kawasan Industri, GIS Masterplan Digital, Analisis RPJMD, Estimasi RAB SNI, dan Kemitraan Investor Global dalam satu platform SaaS terintegrasi.
                  </p>
                  
                  <div className="pt-4 flex flex-wrap justify-center gap-4">
                    <button 
                      id="btn-get-started"
                      onClick={() => setCurrentView('dashboard')}
                      className="px-6 py-3 bg-[#D4AF37] text-slate-950 font-bold text-xs rounded uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      Mulai Portal Integrasi <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>
                    <button 
                      id="btn-learn-more"
                      onClick={() => setCurrentView('gis')}
                      className="px-6 py-3 bg-slate-900 border border-white/10 text-slate-300 font-bold text-xs rounded uppercase tracking-wider hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Buka Peta GIS Masterplan
                    </button>
                  </div>
                </div>

                {/* Sub-panels: Feature Modules Cards Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="p-3 bg-brand-gold/10 rounded-lg w-fit text-[#D4AF37] mb-4">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold font-display text-white mb-1.5">AI Proposal & Kelaikan</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Hasilkan dokumen FS (Feasibility Study), analisis RPJMD kedaerahan, dan slide deck investasi secara otomatis.
                      </p>
                    </div>
                    <button onClick={() => setCurrentView('proposal')} className="mt-4 text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5 hover:underline text-left">
                      Buka Proposal <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="p-3 bg-brand-gold/10 rounded-lg w-fit text-[#D4AF37] mb-4">
                        <Calculator className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold font-display text-white mb-1.5">AI RAB & Kurva-S</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Kalkulasi volume BOQ sipil secara presisi dengan koefisien AHSP standar PUPR & SNI Indonesia.
                      </p>
                    </div>
                    <button onClick={() => setCurrentView('rab')} className="mt-4 text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5 hover:underline text-left">
                      Buka RAB <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="p-3 bg-brand-gold/10 rounded-lg w-fit text-[#D4AF37] mb-4">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold font-display text-white mb-1.5">GIS Spatial Masterplan</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Peta interaktif 2D/3D digital twin dengan ketersediaan layer tata guna lahan, utilitas primer, dan buffer banjir.
                      </p>
                    </div>
                    <button onClick={() => setCurrentView('gis')} className="mt-4 text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5 hover:underline text-left">
                      Buka Masterplan <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="p-3 bg-brand-gold/10 rounded-lg w-fit text-[#D4AF37] mb-4">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold font-display text-white mb-1.5">Land Legal & Pembebasan</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Lacak sertifikat SHM, HGB, HGU, kelola kompensasi, dan mitigasi risiko sengketa tanah dengan AI.
                      </p>
                    </div>
                    <button onClick={() => setCurrentView('land')} className="mt-4 text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5 hover:underline text-left">
                      Lacak Lahan <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Industrial partnership bar logo */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-center uppercase tracking-widest font-mono text-slate-500 mb-4">
                    Sistem Dipercaya Oleh Pemangku Kebijakan & Kontraktor Nasional Indonesia
                  </div>
                  <div className="flex flex-wrap items-center justify-around gap-6 opacity-60">
                    <span className="text-slate-300 font-display font-semibold transition-opacity hover:opacity-100">Kementerian PUPR</span>
                    <span className="text-slate-300 font-display font-semibold transition-opacity hover:opacity-100">ATR / BPN RI</span>
                    <span className="text-[#D4AF37] font-display font-bold transition-opacity hover:opacity-100">Otorita IKN</span>
                    <span className="text-slate-300 font-display font-semibold transition-opacity hover:opacity-100">Bappeda & Pemda</span>
                    <span className="text-slate-300 font-display font-semibold transition-opacity hover:opacity-100">BUMDes Sejahtera</span>
                  </div>
                </div>

              </div>
            )}

            {/* 2. VIEW ENTERPRISE DASHBOARD */}
            {currentView === 'dashboard' && (
              <div id="view-dashboard" className="space-y-6 fade-in-up">
                
                {/* Greeting row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                       Enterprise Command Center <Building2 className="text-[#D4AF37]" />
                    </h2>
                    <p className="text-xs text-slate-400">
                      Pantau indikator kinerja utama, utilitas anggaran nasional, dan alokasi konsesi pembebasan lahan regional.
                    </p>
                  </div>
                  <div className="bg-[#D4AF37]/15 rounded-lg border border-[#D4AF37]/40 p-2 text-xs flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-[#D4AF37]" />
                    <span className="text-white text-xs font-mono font-bold">{currentUser.fullName} ({currentUser.role})</span>
                  </div>
                </div>

                {/* Grid 4 Stats indicators */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-panel p-4 rounded-xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full -z-10"></div>
                    <div className="text-[10px] text-slate-400 font-mono">TOTAL CAPEX DIKELOLA</div>
                    <div className="text-lg lg:text-2xl font-bold text-white mt-1">IDR 7.42T</div>
                    <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                      <span>▲ +14.2% YoY</span>
                    </div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full -z-10"></div>
                    <div className="text-[10px] text-slate-400 font-mono">LAHAN DIBEBASKAN</div>
                    <div className="text-lg lg:text-2xl font-bold text-white mt-1">842.5 Ha</div>
                    <div className="text-[10px] text-slate-500 mt-1">Sisa Target: 72.3 Ha</div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -z-10"></div>
                    <div className="text-[10px] text-slate-400 font-mono">AVERAGE REAL ROI</div>
                    <div className="text-lg lg:text-2xl font-bold text-emerald-400 mt-1">19.2%</div>
                    <div className="text-[10px] text-[#D4AF37] mt-1">Sektor Menengah ke Atas</div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -z-10"></div>
                    <div className="text-[10px] text-slate-400 font-mono">DEVIASI PROGRESS KURVA-S</div>
                    <div className="text-lg lg:text-2xl font-bold text-[#D4AF37] mt-1">-1.6%</div>
                    <div className="text-[10px] text-slate-400 mt-1">Kategori: Sangat Sehat</div>
                  </div>
                </div>

                {/* Map preview & active warnings block */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Map mockup preview card */}
                  <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between h-96">
                    <div className="p-4 border-b border-white/5 bg-slate-950/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#D4AF37]" />
                        <h3 className="text-xs font-bold font-mono tracking-wide">DIGITAL TWIN GIS SIMULATION MAP</h3>
                      </div>
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/30">
                        IKN REGION - ZONE 1A
                      </span>
                    </div>

                    <div className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center p-4">
                      {/* Interactive map display */}
                      <div className="absolute inset-0 bg-contain bg-center opacity-30 bg-radial-grid"></div>
                      <div className="absolute top-6 left-6 text-slate-500 font-mono text-[9px] space-y-1">
                        <div>LAT: -0.428581</div>
                        <div>LNG: 116.948212</div>
                        <div>ELEV: 48m ASL</div>
                      </div>

                      <div className="z-10 p-4 rounded-xl bg-slate-950/80 border border-[#D4AF37]/30 text-center space-y-2 max-w-sm">
                        <Compass className="w-8 h-8 text-[#D4AF37] mx-auto animate-spin" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Peta GIS Berjalan (Ready)</h4>
                        <p className="text-[10px] text-slate-400">
                          Tekan menu "GIS Viewer" di sidebar untuk menggambar poligon zonasi industri atau melakukan overlay sengketa hukum ATR/BPN.
                        </p>
                        <button onClick={() => setCurrentView('gis')} className="px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-amber-600 text-slate-950 font-bold text-[10px] rounded hover:brightness-110 shadow cursor-pointer">
                          Buka Viewer GIS Penuh
                        </button>
                      </div>

                      {/* Floating Polygons overlay mockup */}
                      <div className="absolute right-12 bottom-12 w-28 h-12 bg-emerald-500/20 border border-emerald-400 rounded-md flex items-center justify-center">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase font-mono">Sertifikat HGB Clear</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Peta Dasar: Mapbox Enterprise Edition v2.4</span>
                      <span>ACTIVE POLYGONS: {gisPolygons.length}</span>
                    </div>
                  </div>

                  {/* AI Alerts & Active System Logs */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">Rekomendasi AI Advisor</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="p-3 rounded bg-red-950/20 border border-red-500/20 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-red-400 flex items-center gap-1">🎯 Konflik Tanah Adat</span>
                            <span className="text-[9px] text-red-300 font-mono">Fase 1 Sepaku</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            Parcel AJB-028-ADAT terdeteksi tumpang tindih 12% wilayah hutan nasional. Segera jalankan mitigasi hukum agraria.
                          </p>
                        </div>

                        <div className="p-3 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#D4AF37] flex items-center gap-1">💡 Optimalisasi Anggaran</span>
                            <span className="text-[9px] text-[#D4AF37]-light font-mono">Bahan PUPR</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            Indeks harga aspal regional turun 2% di Batam. Sangat disarankan migrasi alokasi anggaran logistik sekarang.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-4">
                      <button onClick={() => setCurrentView('admin')} className="w-full py-2 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded font-mono text-[10px] font-bold text-[#D4AF37] tracking-wider transition-all">
                        BUKA ANALISIS LENGKAP ADMIN
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 3. VIEW GIS VIEWER */}
            {currentView === 'gis' && (
              <div id="view-gis" className="space-y-6 fade-in-up">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-white">
                      Digital Twin GIS Masterplan - IKN Nusantara
                    </h2>
                    <p className="text-xs text-slate-400">
                      Gunakan Draw Tool untuk merencanakan tata ruang area perumahan, industri, utilitas air desa, atau hitung batas buffer retensi banjir.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button id="draw-industrial" onClick={() => handleMapDraw('industrial')} className="p-2 px-3 bg-slate-900 border border-[#D4AF37]/45 rounded text-xs font-bold text-[#D4AF37] hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer">
                      + Zona Industri
                    </button>
                    <button id="draw-road" onClick={() => handleMapDraw('road')} className="p-2 px-3 bg-slate-900 border border-slate-600 rounded text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer">
                      + Jalan Utama
                    </button>
                    <button id="draw-green" onClick={() => handleMapDraw('green')} className="p-2 px-3 bg-slate-900 border border-emerald-600 rounded text-xs font-bold text-emerald-400 hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer">
                      + Reforestasi
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  
                  {/* Layer controller & GIS tools menu */}
                  <div className="space-y-4">
                    <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold tracking-wider uppercase font-mono text-[#D4AF37]">Manajemen Layer Peta</h4>
                        <div className="mt-2 space-y-2">
                          {['all', 'industrial', 'green', 'utility'].map(layer => (
                            <label key={layer} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white capitalize">
                              <input 
                                type="radio" 
                                name="layer" 
                                checked={activeGeoLayer === layer}
                                onChange={() => setActiveGeoLayer(layer)}
                                className="accent-[#D4AF37]" 
                              />
                              {layer === 'all' ? 'Tampilkan Semua Layer' : `Layer ${layer}`}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-3">
                        <h4 className="text-xs font-bold tracking-wider uppercase font-mono text-slate-300">Sistem Analisis Ruang (GIS)</h4>
                        <div className="mt-2 flex flex-col gap-2">
                          <button id="btn-buffer" onClick={() => triggerGisOverlay('buffer')} className="w-full text-left py-1.5 px-2 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded text-xs text-brand-gold-light hover:bg-[#D4AF37]/25 font-semibold transition-all">
                            ⚡ Buffer Analysis (50 meter)
                          </button>
                          <button id="btn-overlay" onClick={() => triggerGisOverlay('overlay')} className="w-full text-left py-1.5 px-2 bg-indigo-950/20 border border-indigo-500/30 rounded text-xs text-indigo-300 hover:bg-indigo-950/40 font-semibold transition-all">
                            🌐 Overlay Kawasan Hutan Lindung
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-3">
                        <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2">Upload File Lahan (SHP, GeoJSON, KML)</label>
                        <div className="border border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-brand-gold/70 transition-all">
                          <Upload className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
                          <span className="text-[10px] text-slate-400 font-semibold">Tarik & lepas atau pilih file</span>
                        </div>
                      </div>
                    </div>

                    {/* Result and polygon info display */}
                    {gisMeasureResult && (
                      <div className="glass-panel p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/30 text-xs">
                        <div className="font-bold text-indigo-300 font-mono mb-1">EVALUASI SPASIAL AI BPN</div>
                        <p className="text-slate-300 font-sans leading-relaxed">{gisMeasureResult}</p>
                      </div>
                    )}
                  </div>

                  {/* Main virtual maps interface container */}
                  <div className="lg:col-span-3 h-[500px] rounded-2xl relative border border-[#D4AF37]/35 bg-[#0a1120] overflow-hidden">
                    
                    {/* Active draw warning header */}
                    {drawingType && (
                      <div className="absolute top-2 left-2 z-20 px-3 py-1 bg-[#D4AF37] text-slate-950 font-mono text-[10px] font-bold uppercase rounded border border-[#D4AF37]-light animate-pulse">
                        SISTEM MENUNGGU KLIK ANDA PADA AREA PETA UNTUK MELETAKAN KOORDINAT {drawingType.toUpperCase()}
                      </div>
                    )}

                    {/* Left overlay widget */}
                    <div className="absolute top-4 right-4 z-20 bg-slate-950/90 border border-white/15 p-3 rounded-lg text-xs w-48 space-y-2 pointer-events-auto">
                      <div className="font-bold font-mono text-[10px] text-brand-gold uppercase">Daftar Kavling Aktif:</div>
                      <div className="space-y-1 overflow-y-auto max-h-40">
                        {gisPolygons.map(p => (
                          <button 
                            key={p.id}
                            onClick={() => setSelectedPolygon(p)}
                            className={`w-full text-left p-1 text-[10px] rounded transition-all truncate block ${selectedPolygon?.id === p.id ? 'bg-[#D4AF37]/25 text-[#D4AF37] font-semibold' : 'text-slate-400 hover:bg-white/5'}`}
                          >
                            ▰ {p.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Map canvas element with simple mouse handles */}
                    <div 
                      onClick={handleMapClickSim}
                      className={`w-full h-full relative cursor-crosshair`}
                      style={{ backgroundImage: `radial-gradient(circle, rgba(212,175,55,0.12) 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
                    >
                      {/* Render mockup polygon coordinates visually */}
                      {gisPolygons
                        .filter(p => activeGeoLayer === 'all' || p.type === activeGeoLayer)
                        .map((p, idx) => {
                          const leftOffset = 80 + (idx * 110);
                          const topOffset = 180 + (idx * 60);
                          return (
                            <div 
                              key={p.id}
                              style={{ 
                                left: `${leftOffset}px`, 
                                top: `${topOffset}px`,
                                border: `2px solid ${p.color}`,
                                backgroundColor: `${p.color}18`
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPolygon(p);
                              }}
                              className={`absolute p-2.5 rounded-lg shadow-2xl transition-all cursor-pointer select-none hover:scale-105 ${selectedPolygon?.id === p.id ? 'scale-110 shadow-emerald-500/10 border-white ring-2 ring-emerald-500' : ''}`}
                            >
                              <div className="font-mono text-[10px] text-white font-bold">{p.name}</div>
                              <div className="text-[9px] text-[#D4AF37] font-mono mt-0.5">Luas: {p.area.toLocaleString('id-ID')} m²</div>
                              <span className="text-[8px] bg-white/10 px-1 py-0.2 rounded text-slate-300 uppercase block w-fit mt-1">{p.type}</span>
                            </div>
                          );
                      })}

                      {/* Map coordinate axis and grids */}
                      <div className="absolute bottom-4 left-4 bg-slate-950/90 text-slate-300 p-2 rounded border border-white/10 font-mono text-[10px]">
                        <div>SISTEM SPASIAL: EPSG:3857 (WGS 84 Web Mercator)</div>
                        <div>CENTER: 0.428581 S, 116.948212 E</div>
                      </div>
                    </div>

                    {/* Detail panel of selected polygon overlay */}
                    {selectedPolygon && (
                      <div id="gis-polygon-details" className="absolute bottom-4 right-4 z-20 max-w-sm bg-slate-950/95 border border-[#D4AF37] p-4 rounded-xl text-xs space-y-2 pointer-events-auto">
                        <div className="flex items-center justify-between border-b border-white/5 pb-1 select-none">
                          <span className="font-bold text-[#D4AF37] uppercase font-mono">Detail Bidang Ruang</span>
                          <button onClick={() => setSelectedPolygon(null)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <div className="space-y-1 pt-1 text-slate-300">
                          <div><strong>Nama Bidang:</strong> {selectedPolygon.name}</div>
                          <div><strong>Fungsi Terdaftar:</strong> <span className="capitalize text-[#D4AF37]">{selectedPolygon.type}</span></div>
                          <div><strong>Luas Bidang:</strong> {selectedPolygon.area.toLocaleString('id-ID')} m²</div>
                          <div><strong>Pemilik Hak Guna:</strong> {selectedPolygon.owner || 'Belum Ditentukan'}</div>
                          <div><strong>Lokasi Validasi BPN:</strong> Sektor {String(selectedPolygon.id).split('-')[1] || 'KIPP 1A'}</div>
                          <div><strong>Status Konfirmasi:</strong> <span className="text-green-400 font-bold">{selectedPolygon.status || 'Clean & Clear'}</span></div>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

            {/* 4. VIEW LAND MANAGEMENT */}
            {currentView === 'land' && (
              <div id="view-land" className="space-y-6 fade-in-up">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-white">
                      Land Ownership & Legal Advisor Dashboard
                    </h2>
                    <p className="text-xs text-slate-400 font-sans">
                      Lacak status pembebasan lahan, nilai kompensasi warga, sertifikasi ATR/BPN, serta mitigasi risiko konflik secara tepat.
                    </p>
                  </div>
                  
                  {/* Search and filters certs */}
                  <div className="relative w-full md:w-72">
                    <input 
                      id="search-certificate"
                      type="text" 
                      placeholder="Cari Sertifikat, Pemilik..."
                      value={searchCert}
                      onChange={(e) => setSearchCert(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded px-3 py-1.5 pl-9 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    />
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* List of certificates */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="glass-panel p-4 rounded-xl border border-white/5 bg-slate-950/30">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-3">Arsip Sertifikat Lahan Kawasan</div>
                      
                      <div className="space-y-3">
                        {certificates
                          .filter(c => c.ownerName.toLowerCase().includes(searchCert.toLowerCase()) || c.certificateNumber.toLowerCase().includes(searchCert.toLowerCase()))
                          .map(c => (
                            <div 
                              key={c.id} 
                              onClick={() => setSelectedCert(c)}
                              className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${selectedCert?.id === c.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/5 hover:border-white/15 bg-slate-900/40'}`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-slate-950 ${c.type === 'SHM' ? 'bg-[#D4AF37]' : (c.type === 'HGB' ? 'bg-indigo-300' : 'bg-[#EF4444]')}`}>{c.type}</span>
                                  <span className="font-mono text-xs font-bold text-white">{c.certificateNumber}</span>
                                </div>
                                <div className="text-xs text-slate-300 font-semibold">{c.ownerName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">Luas: {c.area.toLocaleString('id-ID')} m² | {c.location}</div>
                              </div>

                              <div className="space-y-2 text-right">
                                <div className="text-xs font-bold text-white">Rp {c.compensationValue.toLocaleString('id-ID')},-</div>
                                <div className="flex items-center gap-2 justify-end">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.status === 'Clean & Clear' ? 'bg-emerald-500/20 text-emerald-400' : (c.status === 'Disputed' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-300')}`}>
                                    {c.status}
                                  </span>
                                  <span className="text-[10px] text-[#F3E5AB] font-mono">{c.liberationProgress}% Bebas</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Legal risk analysis result and advisor */}
                  <div className="space-y-4">
                    <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-4">
                      {selectedCert ? (
                        <>
                          <div className="border-b border-white/5 pb-2">
                            <h3 className="text-sm font-bold text-white block">Analisis Agraria & Legalitas</h3>
                            <span className="text-[10px] text-[#D4AF37] font-mono block mt-1">Sertifikat: {selectedCert.certificateNumber}</span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div><strong className="text-slate-400">Pemilik Asal:</strong><p className="text-slate-200 mt-0.5">{selectedCert.ownerName}</p></div>
                            <div><strong className="text-slate-400">Total Kompensasi Nilai:</strong><p className="text-white mt-0.5 font-bold">Rp {selectedCert.compensationValue.toLocaleString('id-ID')},-</p></div>
                            <div><strong className="text-slate-400">Progres Administrasi:</strong>
                              <div className="w-full bg-white/10 h-2 rounded mt-1.5 overflow-hidden">
                                <div className="bg-[#D4AF37] h-full" style={{ width: `${selectedCert.liberationProgress}%` }}></div>
                              </div>
                            </div>
                          </div>

                          <button 
                            id="btn-analyze-land-risk"
                            disabled={analyzingLandRisk}
                            onClick={() => triggerLandRiskAnalysis(selectedCert)}
                            className="w-full mt-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:brightness-110 disabled:opacity-40 rounded text-slate-950 font-bold text-xs tracking-wider transition-all cursor-pointer"
                          >
                            {analyzingLandRisk ? 'Menganalisis UU Agraria (UUPA)...' : '⚙️ JALANKAN ANALISIS RISIKO AI BPN'}
                          </button>

                          {selectedCert.riskAnalysis && (
                            <div className="p-3.5 rounded bg-slate-900 border border-[#D4AF37]/30 text-[11px] space-y-2 mt-4 select-all">
                              <div>
                                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded ${selectedCert.riskAnalysis.riskLevel === 'High' ? 'bg-red-500 text-white' : (selectedCert.riskAnalysis.riskLevel === 'Medium' ? 'bg-yellow-500 text-slate-950' : 'bg-emerald-500 text-slate-950')}`}>
                                  RISK LEVEL: {selectedCert.riskAnalysis.riskLevel}
                                </span>
                              </div>
                              <div><strong>Analisis Legal:</strong><p className="text-slate-300 leading-relaxed mt-1">{selectedCert.riskAnalysis.riskSummary}</p></div>
                              <div><strong>Potensi Konflik:</strong><p className="text-slate-300 leading-relaxed mt-1">{selectedCert.riskAnalysis.conflictPotential}</p></div>
                              <div><strong>Rekomendasi Advokat:</strong><p className="text-slate-300 leading-relaxed mt-1">{selectedCert.riskAnalysis.legalAdvice}</p></div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                          <p className="text-xs text-slate-400 font-sans">
                            Klik salah satu arsip sertifikat lahan di sebelah kiri untuk menampilkan analisis hukum pertanahan & kajian risiko BPN digital.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 5. VIEW AI PROPOSAL */}
            {currentView === 'proposal' && (
              <div id="view-proposal" className="space-y-6 fade-in-up">
                
                <div className="border-b border-white/5 pb-4">
                  <h2 className="text-2xl font-bold font-display text-white">
                     AI Proposal & Feasibility Study Generator
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Hasilkan kajian teknis, regulasi RPJMD provinsi setempat, kelayakan investasi rimbun, dan presentasi modal global secara otomatis.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Input Form Column */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <div className="text-xs font-bold font-mono tracking-widest text-[#D4AF37] uppercase">FORM INPUT PARAMETER</div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-300 font-bold mb-1">Nama Proyek Konstruksi</label>
                        <input 
                          id="projectName"
                          type="text" 
                          value={proposalInput.projectName} 
                          onChange={(e) => setProposalInput({ ...proposalInput, projectName: e.target.value })}
                          className="w-full text-xs bg-slate-900 border border-white/15 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-gold text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-300 font-semibold mb-1">Wilayah / Lokasi</label>
                          <select 
                            id="location"
                            value={proposalInput.location} 
                            onChange={(e) => setProposalInput({ ...proposalInput, location: e.target.value })}
                            className="w-full text-xs bg-slate-900 border border-white/15 rounded px-2 py-1.5 text-brand-gold focus:outline-none"
                          >
                            <option value="jakarta">Jakarta SCBD</option>
                            <option value="surabaya">Gresik Jatim</option>
                            <option value="semarang">KEK Kendal</option>
                            <option value="ikn">IKN Nusantara</option>
                            <option value="karawang">Karawang Barat</option>
                            <option value="batam">Batam Nongsa</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 font-semibold mb-1">Jenis Sektor</label>
                          <select 
                            id="projectType"
                            value={proposalInput.projectType} 
                            onChange={(e) => setProposalInput({ ...proposalInput, projectType: e.target.value as any })}
                            className="w-full text-xs bg-slate-900 border border-white/15 rounded px-2 py-1.5 text-white focus:outline-none"
                          >
                            <option value="industrial">Kawasan Industri</option>
                            <option value="infrastructure">Infrastruktur Jalan</option>
                            <option value="commercial">Sektor Komersial</option>
                            <option value="residential">Perumahan Modern</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-300 font-bold mb-1">Luas Lahan (m²)</label>
                          <input 
                            id="landSize"
                            type="number" 
                            value={proposalInput.landSize} 
                            onChange={(e) => setProposalInput({ ...proposalInput, landSize: Number(e.target.value) })}
                            className="w-full text-xs bg-slate-900 border border-white/15 rounded px-2.5 py-1.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 font-bold mb-1">Nisbat Investasi CapEx (IDR)</label>
                          <input 
                            id="investmentValue"
                            type="number" 
                            value={proposalInput.investmentValue} 
                            onChange={(e) => setProposalInput({ ...proposalInput, investmentValue: Number(e.target.value) })}
                            className="w-full text-xs bg-slate-900 border border-white/15 rounded px-2.5 py-1.5 text-white font-mono text-emerald-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4">
                      <button 
                        id="btn-generate-proposal"
                        disabled={generatingProposal}
                        onClick={triggerProposalGenerate}
                        className="w-full py-2.5 bg-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-slate-950 font-bold font-display text-xs rounded shadow-lg uppercase tracking-wider transition-all cursor-pointer pointer-events-auto"
                      >
                        {generatingProposal ? 'Mengkaji Parameter Proyek...' : '🔥 MULAI PROPOSAL GENERATOR'}
                      </button>
                    </div>
                  </div>

                  {/* Output Presentation and Content Display */}
                  <div className="lg:col-span-2 space-y-4">
                    {proposalOutput ? (
                      <div className="glass-panel p-6 rounded-2xl border border-[#D4AF37]/45 tracking-wide space-y-6">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
                          <div>
                            <span className="text-[10px] bg-brand-gold/15 text-[#D4AF37] px-2 py-0.5 rounded font-mono font-bold tracking-wider">DOC_ID: {proposalOutput.id}</span>
                            <h3 className="text-lg font-bold text-white font-display mt-1">{proposalOutput.projectName}</h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <button onClick={() => triggerDownloadLog('pdf', proposalOutput.projectName)} className="p-1 px-2.5 bg-slate-900 border border-red-500/50 hover:bg-slate-800 rounded font-bold font-mono text-[9px] text-red-400 flex items-center gap-1">
                              <Download className="w-3.5 h-3.5" /> PDF
                            </button>
                            <button onClick={() => triggerDownloadLog('docx', proposalOutput.projectName)} className="p-1 px-2.5 bg-slate-900 border border-blue-500/50 hover:bg-slate-800 rounded font-bold font-mono text-[9px] text-blue-400 flex items-center gap-1">
                              <Download className="w-3.5 h-3.5" /> DOCX
                            </button>
                          </div>
                        </div>

                        {/* Executive summary block */}
                        <div>
                          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">1. Ringkasan Eksekutif (Executive Summary)</h4>
                          <p className="text-slate-300 text-xs leading-relaxed mt-2 p-3 bg-white/5 rounded border border-white/5 font-sans select-all">{proposalOutput.executiveSummary}</p>
                        </div>

                        {/* Feasibility study block */}
                        <div>
                          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">2. Studi Kelayakan Keuangan & Teknis</h4>
                          <p className="text-slate-300 text-xs leading-relaxed mt-2 p-3 bg-white/5 rounded border border-white/5 select-all">{proposalOutput.feasibilityStudy}</p>
                        </div>

                        {/* Business plan details */}
                        <div>
                          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">3. Rencana Realisasi & Amortisasi Usaha</h4>
                          <p className="text-slate-300 text-xs leading-relaxed mt-2 p-3 bg-white/5 rounded border border-white/5 select-all">{proposalOutput.businessPlan}</p>
                        </div>

                        {/* RPJMD local compliance */}
                        <div>
                          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">4. Analisis Sinkronisasi RPJMD & RTRW Wilayah setempat</h4>
                          <p className="text-slate-300 text-xs leading-relaxed mt-2 p-3 bg-teal-900/10 border border-teal-500/30 rounded text-teal-200 select-all">{proposalOutput.rpjmdAnalysis}</p>
                        </div>

                        {/* Slides / pitch deck generator visual mockup */}
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">5. Kerangka Presentasi Pitch Deck Investor</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                            {proposalOutput.pitchDeckSlides?.map((slide, i) => (
                              <div key={i} className="p-3 rounded-lg bg-slate-950 border border-white/10 text-xs relative overflow-hidden">
                                <div className="absolute top-2 right-2 text-[#D4AF37] font-mono text-[9px] font-black">SLIDE {i+1}</div>
                                <h5 className="font-bold text-slate-100 mb-2 truncate">{slide.title}</h5>
                                <ul className="space-y-1 text-[10px] text-slate-400 leading-snug">
                                  {slide.points?.map((pt, pIdx) => (
                                    <li key={pIdx}>• {pt}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center flex flex-col justify-center items-center h-full">
                        <FileCheck2 className="w-12 h-12 text-[#D4AF37] mb-3 animate-bounce" />
                        <h3 className="text-sm font-bold text-slate-300">Form Proposal Lahan Kosong</h3>
                        <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                          Tekan tombol "🔥 MULAI PROPOSAL GENERATOR" di sebelah kiri untuk melempar instruksi ke model Gemini 3.5 Flash dan merakit Feasibility Study.
                        </p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* 6. VIEW AI RAB */}
            {currentView === 'rab' && (
              <div id="view-rab" className="space-y-6 fade-in-up">
                
                <div className="border-b border-white/5 pb-4">
                  <h2 className="text-2xl font-bold font-display text-white">
                     AI RAB & Standar Analisis PUPR Generator
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                     Hitung Bill of Quantities (BOQ), analisis harga satuan pekerjaan (AHSP) secara runtut didampingi grafik progress Kurva-S Indonesia.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  
                  {/* Parameter sliders and inputs */}
                  <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-4">
                    <div className="text-xs font-bold text-[#D4AF37] font-mono tracking-widest uppercase">INPUT SIPIL JAWABAN</div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-300 font-bold mb-1">Nama Item Pekerjaan</label>
                        <input 
                          id="rab-jobName"
                          type="text" 
                          value={rabInput.jobName} 
                          onChange={(e) => setRabInput({ ...rabInput, jobName: e.target.value })}
                          className="w-full text-xs bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-gold text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 font-semibold mb-1">Batas Panjang (Meter)</label>
                        <input 
                          id="rab-length"
                          type="number" 
                          value={rabInput.length} 
                          onChange={(e) => setRabInput({ ...rabInput, length: Number(e.target.value) })}
                          className="w-full text-xs bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-300 font-semibold mb-1">Lebar (m)</label>
                          <input 
                            id="rab-width"
                            type="number" 
                            value={rabInput.width} 
                            onChange={(e) => setRabInput({ ...rabInput, width: Number(e.target.value) })}
                            className="w-full text-xs bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-300 font-semibold mb-1">Tebal Rabat (m)</label>
                          <input 
                            id="rab-thickness"
                            type="number" 
                            step="0.01"
                            value={rabInput.thickness} 
                            onChange={(e) => setRabInput({ ...rabInput, thickness: Number(e.target.value) })}
                            className="w-full text-xs bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 font-semibold mb-1">Standar Material Regional</label>
                        <select 
                          id="rab-materialStandard"
                          value={rabInput.materialStandard} 
                          onChange={(e) => setRabInput({ ...rabInput, materialStandard: e.target.value as any })}
                          className="w-full text-xs bg-slate-900 border border-white/10 rounded px-2 py-1.5 text-[#D4AF37] focus:outline-none"
                        >
                          <option value="PUPR-2023">PUPR 2023 (AHSP)</option>
                          <option value="SNI-2024">SNI 2024 (Beton & Baja)</option>
                          <option value="Regional-Bappeda">Bappeda Kaltim Setempat</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                      <button 
                        id="btn-calculate-rab"
                        disabled={generatingRab}
                        onClick={triggerRabGenerate}
                        className="w-full py-2 bg-gradient-to-r from-orange-500 to-[#D4AF37] hover:brightness-110 disabled:opacity-50 rounded text-slate-950 font-bold text-xs tracking-wider transition-all cursor-pointer"
                      >
                        {generatingRab ? 'Mengkalkulasi Biaya PUPR...' : '⚡ HITUNG RAB & BOQ'}
                      </button>
                    </div>
                  </div>

                  {/* BOQ Table and Kurva-S Visual Output */}
                  <div className="lg:col-span-3 space-y-6">
                    {rabOutput ? (
                      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-6">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <span className="text-[10px] bg-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">TOTAL ESTIMASI BIAYA</span>
                            <div className="text-2xl font-bold font-mono text-white mt-1">Rp {rabOutput.totalCost?.toLocaleString('id-ID')},-</div>
                          </div>
                          
                          <button onClick={() => triggerDownloadLog('xlsx', 'RAB-BOQ-sipil')} className="p-1 px-3 bg-slate-900 border border-emerald-500/50 text-emerald-400 font-mono text-xs rounded hover:bg-slate-800 transition-all cursor-pointer">
                            Export Excel (.XLSX)
                          </button>
                        </div>

                        {/* Render BOQ items list in table style */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2">1. Bill of Quantities (BOQ)</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[11px] text-left border-collapse">
                              <thead>
                                <tr className="border-b border-white/10 bg-white/5 text-[#D4AF37]">
                                  <th className="py-2 px-1">Uraian Pekerjaan</th>
                                  <th className="py-2 px-1 text-center">Volume</th>
                                  <th className="py-2 px-1 text-center">Sat</th>
                                  <th className="py-2 px-1 text-right">Harga (Rp)</th>
                                  <th className="py-2 px-1 text-right">Jumlah (Rp)</th>
                                  <th className="py-2 px-1 text-right">Bobot (%)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rabOutput.boq?.map(b => (
                                  <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-2 px-1 text-slate-200">
                                      <div className="font-bold text-slate-300">{b.jobSection}</div>
                                      <p className="text-[10px] text-slate-500">{b.description}</p>
                                    </td>
                                    <td className="py-2 px-1 text-center text-white">{b.volume}</td>
                                    <td className="py-2 px-1 text-center text-slate-300">{b.unit}</td>
                                    <td className="py-2 px-1 text-right text-slate-300">{b.unitPrice?.toLocaleString('id-ID')}</td>
                                    <td className="py-2 px-1 text-right font-bold text-white">{b.totalPrice?.toLocaleString('id-ID')}</td>
                                    <td className="py-2 px-1 text-right text-brand-gold-light font-mono">{b.weightPercentage}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Rendering Kurva-S dynamically in pure SVG format */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-1">2. Kurva S Progres Mingguan</h4>
                          <p className="text-[10px] text-slate-500 mb-3">Persentase kumulatif penyelesaian konstruksi Rencana vs Realisasi Aktif.</p>
                          
                          <div className="w-full h-44 bg-slate-950 border border-white/5 rounded-xl p-3 relative flex flex-col justify-between">
                            <div className="flex-1 flex items-end gap-1 px-2.5">
                              {/* Draw vector lines with bar metrics for realistic curve-s visualization */}
                              {rabOutput.curveSData?.map((data, index) => {
                                return (
                                  <div key={index} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-900 border border-[#D4AF37] px-2 py-1 rounded text-[8px] text-white z-20 pointer-events-none">
                                      <div>Rec: {data.rencanaKumulatif}%</div>
                                      <div>Real: {data.realisasiKumulatif}%</div>
                                    </div>

                                    {/* Double indicators bars */}
                                    <div className="w-full flex gap-0.5 items-end justify-center h-full">
                                      <div className="w-1.5 bg-[#D4AF37]/40 rounded-t" style={{ height: `${data.rencanaKumulatif}%` }}></div>
                                      <div className="w-1.5 bg-emerald-500 rounded-t" style={{ height: `${data.realisasiKumulatif}%` }}></div>
                                    </div>
                                    
                                    <span className="text-[7px] text-slate-500 font-mono mt-1 rotate-45 select-none">{data.week.replace('Minggu ', 'W')}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Legends color indicators */}
                            <div className="flex justify-end gap-4 text-[9px] font-mono pr-4 border-t border-white/5 pt-1.5">
                              <span className="flex items-center gap-1"><div className="w-2.5 h-1.5 bg-brand-gold"></div> Rencana Kumulatif</span>
                              <span className="flex items-center gap-1"><div className="w-2.5 h-1.5 bg-emerald-500"></div> Realisasi Kumulatif</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center">
                        <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <h4 className="text-xs font-bold font-display text-slate-400">Parameter Jalan Beton Belum Dimuat</h4>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                          Tekan parameter "⚡ HITUNG RAB & BOQ" untuk merinci struktur harga satuan, margin upah ahli sipil Bappeda, dan sketsa Kurva-S.
                        </p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* 7. VIEW PROJECT MONITORING */}
            {currentView === 'project' && (
              <div id="view-project" className="space-y-6 fade-in-up">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-white">
                       Construction Live Monitoring Channel
                    </h2>
                    <p className="text-xs text-slate-400">
                       Arsipkan laporan harian, mingguan, bulanan dari site project lapangan dan trigger AI Mitigator untuk mereorganisasi jadwal terlambat.
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-red-500/20 text-red-400 font-mono text-xs rounded border border-red-500/20">
                     ALERT RISK: HIGH PRE-RAIN SEASON JUNE
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Register update form */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <div className="text-xs font-bold font-mono tracking-widest text-[#D4AF37] uppercase">Kirim Laporan Pengawas Baru</div>
                    
                    <form onSubmit={handleProjectReportSubmit} className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-1">Selesai Fisik (%)</label>
                          <input 
                            id="project-physical"
                            type="number" 
                            step="0.01"
                            value={newProgress.physical}
                            onChange={(e) => setNewProgress({...newProgress, physical: Number(e.target.value)})}
                            className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Cair Termin (%)</label>
                          <input 
                            id="project-financial"
                            type="number" 
                            step="0.01"
                            value={newProgress.financial}
                            onChange={(e) => setNewProgress({...newProgress, financial: Number(e.target.value)})}
                            className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1.5 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Uraian Ringkasan Kejadian Lapangan</label>
                        <textarea 
                          id="project-summary text"
                          rows={3}
                          value={newProgress.summary}
                          onChange={(e) => setNewProgress({...newProgress, summary: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-slate-300 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Kendala Utama Lapangan (Pemicu Deviasi)</label>
                        <input 
                          id="project-constrains text"
                          type="text" 
                          value={newProgress.constrains}
                          onChange={(e) => setNewProgress({...newProgress, constrains: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-slate-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">Lampirkan Foto Lokasi</label>
                          <div className="border border-dashed border-white/10 p-2 text-center rounded text-[10px] text-slate-400 cursor-pointer">
                            + Klik Foto .jpg
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">Lampirkan Rekor Video</label>
                          <div className="border border-dashed border-white/10 p-2 text-center rounded text-[10px] text-slate-400 cursor-pointer">
                            + Klik Video .mp4
                          </div>
                        </div>
                      </div>

                      <button 
                        id="btn-submit-report"
                        disabled={submittingReport}
                        type="submit"
                        className="w-full mt-3 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:brightness-110 disabled:opacity-40 rounded text-slate-950 font-bold font-display text-xs tracking-wider uppercase transition-all cursor-pointer"
                      >
                        {submittingReport ? 'Menghitung Resiko Keterlambatan...' : '🚀 KIRIM LAPORAN KE AI GATEWAY'}
                      </button>
                    </form>
                  </div>

                  {/* Physical progress logs timeline with AI analysis insights */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel p-4 rounded-xl border border-white/5">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">HISTORI REKOR DAN AUDIT PROGRESS SITE</div>
                      
                      <div className="space-y-4">
                        {projectMetadata.history.map((h, i) => (
                          <div key={h.id} className="p-4 bg-slate-900/40 rounded-lg border border-white/5 space-y-3">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-white/5 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded font-mono font-bold">{h.reportType}</span>
                                <span className="text-xs font-bold text-white font-mono">{h.reportDate} (ID: {h.id})</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-300">Fisik: <strong className="text-emerald-400">{h.physicalProgress}%</strong></span>
                                <span className="text-xs text-slate-300">Biaya: <strong className="text-[#D4AF37]">{h.financialProgress}%</strong></span>
                              </div>
                            </div>

                            <div className="space-y-1 text-xs">
                              <div><strong className="text-slate-400">Ringkasan Pekerjaan Selesai:</strong><p className="text-slate-300 mt-0.5 font-sans leading-relaxed">{h.workSummary}</p></div>
                              {h.constrains && <div><strong className="text-slate-400">Kendala Lapangan:</strong><p className="text-amber-300 mt-0.5 font-sans leading-relaxed">{h.constrains}</p></div>}
                            </div>

                            {/* AI analysis card attached inside the timeline block */}
                            {h.aiAnalysis && (
                              <div className="p-3.5 rounded bg-indigo-950/20 border border-indigo-500/20 text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-mono text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">✨ AI MITIGATION STATUS: {h.aiAnalysis.progressStatus}</span>
                                  <span className="font-mono text-[9px] text-[#D4AF37]">Deviasi: {h.aiAnalysis.deviationPercentage}%</span>
                                </div>
                                <div className="text-slate-200 mt-1">{h.aiAnalysis.delayRisk}</div>
                                <div className="text-indigo-200 font-mono mt-1.5 text-[10.5px] leading-relaxed select-all"><strong>Rencana Taktis Sipil:</strong> {h.aiAnalysis.mitigationStrategy}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 8. VIEW INVESTOR DASHBOARD */}
            {currentView === 'investor' && (
              <div id="view-investor" className="space-y-6 fade-in-up">
                
                {/* Visual Header suitable for global investors */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-white">
                       Global Sovereign Allocation & Yield Monitor
                    </h2>
                    <p className="text-xs text-slate-400">
                       Akurasi audit akuntansi setara Oracle Primavera. Menampilkan internal rate of return, target leverage, dan sebaran dividen.
                    </p>
                  </div>

                  <button onClick={() => triggerDownloadLog('pdf', 'Financial-Portfolio-Consolidated')} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs rounded shadow-lg uppercase tracking-wider hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1">
                    <Download className="w-4 h-4" /> Download Investor Report (PDF)
                  </button>
                </div>

                {/* Performance stats summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="glass-panel p-5 rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#D4AF37]/5 to-transparent relative overflow-hidden">
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Global Assets Under Management (AUM)</div>
                    <div className="text-3xl font-bold font-mono text-white mt-1">IDR 7.42 Triliun</div>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed mt-2 p-2 bg-slate-950 rounded select-all">
                       Diposisikan pilar modal dari konsorsium domestik dan sovereign wealth fund Asia Timur.
                    </p>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Weighted Historical Yield</div>
                    <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">16.8% Annually</div>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed mt-2 p-2 bg-slate-950 rounded select-all">
                       Unggul 4.2% di atas benchmark sekuritas pertanahan nasional standard.
                    </p>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Zonasi Portofolio Nasional</div>
                    <div className="text-3xl font-bold font-mono text-[#D4AF37] mt-1">4 Kawasan Strategis</div>
                    <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase font-mono">
                      <span>✓ IKN</span><span>• Batam</span><span>• PIK2</span><span>• Kendal</span>
                    </div>
                  </div>

                </div>

                {/* Portfolio detailed allocation table list */}
                <div className="glass-panel p-5 rounded-2xl border border-white/15">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">Sebaran Emiten & Proyek Aliansi</div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-[#D4AF37] font-mono select-none">
                          <th className="py-2.5 px-2">Nama Kawasan / Proyek Mitra</th>
                          <th className="py-2.5 px-2 text-right">Modal Awal Masuk (IDR)</th>
                          <th className="py-2.5 px-2 text-right">Porsi Saham (%)</th>
                          <th className="py-2.5 px-2 text-right">Valuasi Sekarang (IDR)</th>
                          <th className="py-2.5 px-2 text-right">Yield Real (RoI)</th>
                          <th className="py-2.5 px-2 text-right">Status Lapangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio.allocatedProjects.map(p => (
                          <tr key={p.projectId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-2 font-bold text-slate-100">{p.projectName}</td>
                            <td className="py-3 px-2 text-right font-mono text-slate-300">{(p.investedAmount / 1000000000000).toFixed(2)}T</td>
                            <td className="py-3 px-2 text-right font-mono text-indigo-300">{p.sharesOutstandingPercentage}%</td>
                            <td className="py-3 px-2 text-right font-mono text-emerald-300 font-bold">{(p.currentValuation / 1000000000000).toFixed(2)}T</td>
                            <td className="py-3 px-2 text-right font-mono text-[#D4AF37] font-black">+{p.roiToDate}%</td>
                            <td className="py-3 px-2 text-right">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] font-semibold border border-[#D4AF37]/30">
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 9. VIEW INDUSTRIAL ESTATE PLANNER */}
            {currentView === 'industrial' && (
              <div id="view-industrial" className="space-y-6 fade-in-up">
                
                <div className="border-b border-white/5 pb-4">
                  <h2 className="text-2xl font-bold font-display text-white">
                      Digital Industrial Zone & KEK Simulator
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                      Simulasikan kelayakan finansial, amortisasi operasional, Capex Tanah, Capex Utilitas Modular, dan dapatkan yield investasi global secara instan.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Inputs Column */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                    <div className="text-xs font-bold text-[#D4AF37] font-mono tracking-widest uppercase mb-2">Pemberi Nilai / Sliders</div>
                    
                    <div className="space-y-4 text-xs">
                      <div>
                        <div className="flex justify-between font-bold text-slate-300 mb-1">
                          <span>Total Ukuran (Hektar)</span>
                          <span className="text-[#D4AF37]">{industrialSim.totalAreaHectares} Ha</span>
                        </div>
                        <input 
                          id="estate-totalAreaHectares"
                          type="range" 
                          min="10" 
                          max="1000" 
                          value={industrialSim.totalAreaHectares}
                          onChange={(e) => setIndustrialSim({...industrialSim, totalAreaHectares: Number(e.target.value)})}
                          className="w-full accent-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-slate-300 mb-1">
                          <span>Tahapan Pembangunan (Phases)</span>
                          <span className="text-[#D4AF37]">{industrialSim.developmentPhases} Tahap</span>
                        </div>
                        <input 
                          id="estate-developmentPhases"
                          type="range" 
                          min="1" 
                          max="5" 
                          value={industrialSim.developmentPhases}
                          onChange={(e) => setIndustrialSim({...industrialSim, developmentPhases: Number(e.target.value)})}
                          className="w-full accent-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-slate-300 mb-1">
                          <span>Harga Jual Lahan (IDR per m²)</span>
                          <span className="text-[#D4AF37]">Rp {industrialSim.estimatedSellingPricePerSqm.toLocaleString('id-ID')}</span>
                        </div>
                        <input 
                          id="estate-estimatedSellingPricePerSqm"
                          type="range" 
                          min="1000000" 
                          max="10000000" 
                          step="100000"
                          value={industrialSim.estimatedSellingPricePerSqm}
                          onChange={(e) => setIndustrialSim({...industrialSim, estimatedSellingPricePerSqm: Number(e.target.value)})}
                          className="w-full accent-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-slate-300 mb-1">
                          <span>Tingkat Keterisian Tenant (%)</span>
                          <span className="text-[#D4AF37]">{industrialSim.occupancyRatePercentage}%</span>
                        </div>
                        <input 
                          id="estate-occupancyRatePercentage"
                          type="range" 
                          min="5" 
                          max="100" 
                          value={industrialSim.occupancyRatePercentage}
                          onChange={(e) => setIndustrialSim({...industrialSim, occupancyRatePercentage: Number(e.target.value)})}
                          className="w-full accent-[#D4AF37]"
                        />
                      </div>

                      <div className="space-y-2 border-t border-white/5 pt-3">
                        <div>
                          <label className="block text-slate-400 mb-0.5">CapEx Akuisisi Tanah (IDR)</label>
                          <input 
                            id="estate-capexLandAcquisition"
                            type="number" 
                            value={industrialSim.capexLandAcquisition} 
                            onChange={(e) => setIndustrialSim({...industrialSim, capexLandAcquisition: Number(e.target.value)})}
                            className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-0.5">CapEx Infrastruktur Jalan & Modular (IDR)</label>
                          <input 
                            id="estate-capexInfrastructure"
                            type="number" 
                            value={industrialSim.capexInfrastructure} 
                            onChange={(e) => setIndustrialSim({...industrialSim, capexInfrastructure: Number(e.target.value)})}
                            className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4">
                      <button 
                        id="btn-simulate-estate"
                        disabled={simulatingEstate}
                        onClick={triggerEstateSim}
                        className="w-full py-2.5 bg-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-slate-950 font-bold text-xs rounded uppercase tracking-wider transition-all cursor-pointer"
                      >
                        {simulatingEstate ? 'Menghitung Kelayakan KEK...' : '⚙️ JALANKAN PROYEKSI FINANSIAL'}
                      </button>
                    </div>
                  </div>

                  {/* Outputs Financial Metrics Box cards */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-[#D4AF37]/35 tracking-wide space-y-6">
                      <div className="text-xs font-bold font-mono tracking-widest text-[#D4AF37] uppercase">HASIL PROYEKSI KELAYAKAN FINANSIAL</div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-mono">Net Present Value (NPV)</span>
                          <div id="metric-npv" className="text-xl font-bold font-mono text-white">
                             Rp {industrialSim.financialMetrics?.npv?.toLocaleString('id-ID')},-
                          </div>
                          <span className="text-[9px] text-[#D4AF37]">*Menggunakan tingkat diskonto 10%</span>
                        </div>

                        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-mono">Internal Rate of Return (IRR)</span>
                          <div id="metric-irr" className="text-xl font-bold font-mono text-emerald-400">
                             {industrialSim.financialMetrics?.irr}%
                          </div>
                          <span className="text-[9px] text-emerald-300">*Ekspektasi pengembalian modal tinggi</span>
                        </div>

                        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-mono">Return on Investment (ROI)</span>
                          <div id="metric-roi" className="text-xl font-bold font-mono text-indigo-300">
                             {industrialSim.financialMetrics?.roi}%
                          </div>
                          <span className="text-[9px] text-indigo-400">*Berdasarkan target penjualan lahan</span>
                        </div>

                        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-mono">Payback Period (PBP)</span>
                          <div id="metric-pbp" className="text-xl font-bold font-mono text-white">
                             {industrialSim.financialMetrics?.paybackPeriodYears} Tahun
                          </div>
                          <span className="text-[9px] text-slate-500">*Durasi waktu pengembalian modal neto</span>
                        </div>
                      </div>

                      <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1">✔ Ringkasan Kelayakan Usaha AI</h4>
                        <p className="text-slate-300 text-xs leading-relaxed font-sans mt-1.5 select-all">
                           Dengan melebarkan KEK ini seluas {industrialSim.totalAreaHectares} Hektar dengan harga kavling industri Rp {industrialSim.estimatedSellingPricePerSqm.toLocaleString('id-ID')} per m², proyeksi bisnis berstatus <strong className="text-[#D4AF37] uppercase">SANGAT LAYAK (Highly Viable)</strong>. Arus kas masuk secara stabil tercapai karena porsi payback period kurang dari 4.5 tahun yang aman di bawah ambang batas asuransi pertanahan.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 10. VIEW SMART VILLAGE */}
            {currentView === 'smart-village' && (
              <div id="view-smart-village" className="space-y-6 fade-in-up">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-white">
                       Nusantara Smart City & Desa Monitoring
                    </h2>
                    <p className="text-xs text-slate-400">
                       Pemantauan langsung PJU pintar, irigasi, rob air pesisir pantai, dan sensor banjir sungai sepaku secara real time.
                    </p>
                  </div>

                  <span className="text-xs bg-emerald-500/25 border border-emerald-500/35 text-emerald-400 px-2.5 py-1 rounded font-mono font-bold select-none">
                     ONLINE SENSORS: {sensors.length}/{sensors.length}
                  </span>
                </div>

                {/* Sensors Grid with telemetry visual */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sensors.map(s => {
                    const statusColorMap: Record<SmartSensor['status'], { bg: string, text: string, animate: string }> = {
                      'Normal': { bg: 'bg-emerald-500/25', text: 'text-emerald-400', animate: 'bg-green-500' },
                      'Waspada': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', animate: 'bg-yellow-400' },
                      'Siaga': { bg: 'bg-orange-500/20', text: 'text-orange-400', animate: 'bg-orange-400' },
                      'Gagal Fungsi': { bg: 'bg-red-500/20', text: 'text-red-400', animate: 'bg-red-500 animate-ping' }
                    };
                    const sc = statusColorMap[s.status] || statusColorMap['Normal'];
                    
                    return (
                      <div key={s.id} id={`sensor-${s.id}`} className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col justify-between h-44 relative overflow-hidden group">
                        
                        {/* Hover glowing background item */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>

                        <div className="space-y-3 relative">
                          <div className="flex items-center justify-between border-b border-white/5 pb-1 select-none">
                            <span className="text-[10px] font-mono text-slate-400">{s.id}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${sc.animate}`}></span>
                              <span className={`text-[9px] font-bold uppercase font-mono ${sc.text}`}>{s.status}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white transition-colors group-hover:text-[#D4AF37]">{s.name}</h4>
                            <p className="text-[10.5px] text-slate-400 font-mono flex items-center gap-1">📍 {s.locationName}</p>
                          </div>
                        </div>

                        <div className="space-y-1 relative border-t border-white/5 pt-2">
                          <div className="text-xs font-bold text-slate-100 font-mono tracking-wide">
                            {s.value}
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono">
                            Terakhir diupdate: {s.lastUpdated}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Controls and simulations map for city monitoring */}
                <div className="glass-panel p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <h3 className="text-xs font-bold tracking-wider text-slate-300 font-mono uppercase">KONTROL AKSI TELEMETRI BUMDES</h3>
                    <span className="text-[10px] text-slate-500 font-mono">Simulasi Sinyal</span>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button 
                      id="btn-trigger-flood"
                      onClick={() => {
                        setSensors(prev => prev.map(x => x.type === 'Banjir' ? { ...x, status: 'Siaga', value: 'Ketinggian Air: 3.45m FLOOD ALERT' } : x));
                        showToast('Triggered: Banjir Siaga alert sent to local BUMDes network!', 'warning');
                      }}
                      className="p-2 bg-red-500/25 hover:bg-red-500/40 border border-red-500 text-red-100 text-xs font-bold rounded transition-colors"
                    >
                      ⚠️ Kirim Sinyal Banjir Pesisir
                    </button>

                    <button 
                      id="btn-trigger-pju"
                      onClick={() => {
                        setSensors(prev => prev.map(x => x.type === 'PJU' ? { ...x, status: 'Normal', value: '100% Full Luminous Saver Mode' } : x));
                        showToast('Triggered: PJU lights set to Full Brightness!', 'success');
                      }}
                      className="p-2 bg-amber-500/25 hover:bg-amber-500/40 border border-[#D4AF37] text-white text-xs font-bold rounded transition-colors"
                    >
                      💡 Aktifkan Hemat Daya PJU
                    </button>

                    <button 
                      id="btn-trigger-irr"
                      onClick={() => {
                        setSensors(prev => prev.map(x => x.type === 'Irigasi' ? { ...x, status: 'Normal', value: 'Debit Pintu Air: 10.4 m3/s' } : x));
                        showToast('Triggered: Pintu air bendungan ditutup bertahap!', 'success');
                      }}
                      className="p-2 bg-blue-500/25 hover:bg-blue-500/40 border border-blue-500 text-blue-100 text-xs font-bold rounded transition-colors"
                    >
                      💧 Pintu Air Irigasi Normal
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 11. VIEW ADMIN PANEL */}
            {currentView === 'admin' && (
              <div id="view-admin" className="space-y-6 fade-in-up">
                
                <div className="border-b border-white/5 pb-4">
                  <h2 className="text-2xl font-bold font-display text-white">
                     SaaS Administrative Management Panel
                  </h2>
                  <p className="text-xs text-slate-400">
                     Superuser dashboard untuk memonitor kesehatan cluster Kubernetes, database PostGIS, status lisensi SaaS tenant, dan traffic logger.
                  </p>
                </div>

                {/* Multitenant tenancy and system statuses */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  
                  {/* Active tenants & Multi-tenant status licenses */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-4">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Daftar Tenant Perusahaan (SaaS)</div>
                      
                      <div className="space-y-3 font-sans">
                        <div className="p-3 bg-slate-900/60 rounded-lg border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-200">PT Nusantara Karya (Tenant ID: t_0921)</div>
                            <span className="text-[10px] text-slate-400">Kavling Aktif: 24 | Lisensi: Enterprise Gold</span>
                          </div>
                          <span className="text-[10px] bg-[#D4AF37]/25 text-[#D4AF37] px-2 py-0.5 rounded uppercase">UUP-ATR RI</span>
                        </div>

                        <div className="p-3 bg-slate-900/60 rounded-lg border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-200">BUMDes Karya Makmur (Tenant ID: t_3811)</div>
                            <span className="text-[10px] text-slate-400">PJU Pintar: 110 | Lisensi: Regional Govt Free</span>
                          </div>
                          <span className="text-[10px] bg-slate-500/25 text-slate-300 px-2 py-0.5 rounded uppercase">Sesuai RPJMD</span>
                        </div>

                        <div className="p-3 bg-slate-900/60 rounded-lg border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-200">Fortuna Capital Trust (Tenant ID: t_6672)</div>
                            <span className="text-[10px] text-slate-400">Jumlah Modal: Rp 7.4T | Lisensi: Sovereign Tier</span>
                          </div>
                          <span className="text-[10px] bg-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded uppercase">IKN Investor</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational system health panels */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono mb-2">Pintu Gateway & Cluster Database</div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 bg-slate-950 rounded border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Node Kubernetes Cluster</span>
                          <span className="text-emerald-400 font-bold block">✓ 3 Nodes Live</span>
                        </div>

                        <div className="p-3.5 bg-slate-950 rounded border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">PostgreSQL / PostGIS</span>
                          <span className="text-emerald-400 font-bold block">✓ Connected</span>
                        </div>

                        <div className="p-3.5 bg-slate-950 rounded border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Firebase Auth Status</span>
                          <span className="text-emerald-400 font-bold block">✓ Safe (JWT Token)</span>
                        </div>

                        <div className="p-3.5 bg-slate-950 rounded border border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">PUPR AHSP API Database</span>
                          <span className="text-[#D4AF37] font-bold block">Active</span>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-3 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-mono">SEED MASTER SCHEMAS:</span>
                          <button 
                            id="btn-seed-db"
                            onClick={() => {
                              showToast('Database schema successfully seeded using scale-to-zero PostGIS adapter!', 'success');
                              setGatewayLogs([
                                ...gatewayLogs,
                                `POSTGIS: [${new Date().toISOString()}] Database re-seeded. Added 12 new cadastral lines.`
                              ]);
                            }}
                            className="text-[10px] bg-[#D4AF37]/25 text-[#D4AF37] px-2 py-1 rounded border border-[#D4AF37]/45 hover:bg-[#D4AF37]/40 transition-colors"
                          >
                            Seed database
                          </button>
                        </div>
                        
                        <div className="bg-slate-950 p-2.5 rounded font-mono text-[9px] text-[#F3E5AB] leading-snug overflow-y-auto max-h-32">
                          {gatewayLogs.map((log, lIdx) => (
                            <div key={lIdx}>{log}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Bottom Jakarta Time and Live Metadata footer */}
          <footer className="h-12 bg-slate-950/80 border-t border-white/5 px-6 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-500 font-mono mt-auto select-none py-2 gap-2 text-center">
            <div className="flex flex-wrap gap-4 uppercase tracking-wider justify-center">
              <span className="text-emerald-500 font-bold">▲ SAAS SYSTEM CONNECTED</span>
              <span>PING: 14MS</span>
              <span>POSTGIS DB: ACTIVE</span>
              <span>FIREBASE SESS: TRUE</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-300 font-bold">Jakarta Time: 14:22:45 WIB (Waktu Indonesia Barat)</span>
              <div className="hidden md:block w-px h-3 bg-white/10"></div>
              <span>REGIONAL GATEWAY: ASIA-SOUTHEAST1</span>
            </div>
          </footer>

        </main>
      </div>
    
    </div>
  );
}
