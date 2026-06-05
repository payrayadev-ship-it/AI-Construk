/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'contractor' | 'developer' | 'investor' | 'government_official';
  fullName: string;
  companyName: string;
}

// ==========================================
// MODUL 1: AI PROPOSAL GENERATOR
// ==========================================
export interface ProposalInput {
  projectName: string;
  location: string;
  landSize: number; // in sq meters
  investmentValue: number; // in IDR
  projectType: 'commercial' | 'residential' | 'industrial' | 'infrastructure';
}

export interface ProposalOutput {
  id: string;
  projectName: string;
  location: string;
  landSize: number;
  investmentValue: number;
  executiveSummary: string;
  feasibilityStudy: string;
  businessPlan: string;
  rpjmdAnalysis: string;
  pitchDeckSlides: {
    title: string;
    points: string[];
  }[];
  createdAt: string;
}

// ==========================================
// MODUL 2: AI RAB GENERATOR (Indonesia Standards)
// ==========================================
export interface RabInput {
  jobName: string;
  length: number; // meters
  width: number; // meters
  thickness?: number; // meters (e.g. concrete slab)
  location: string;
  materialStandard: 'SNI-2024' | 'PUPR-2023' | 'Regional-Bappeda';
}

export interface AHSPItem {
  code: string;
  description: string;
  unit: string;
  unitPrice: number;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  totalUnitPrice: number;
}

export interface BOQItem {
  id: string;
  jobSection: string;
  description: string;
  coefficient: number;
  volume: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  weightPercentage: number;
}

export interface ScheduleItem {
  week: number;
  plannedPercentage: number;
  actualPercentage: number;
}

export interface RabOutput {
  id: string;
  jobName: string;
  standard: string;
  totalCost: number;
  boq: BOQItem[];
  ahsp: AHSPItem[];
  schedule: ScheduleItem[];
  curveSData: {
    week: string;
    rencanaKumulatif: number;
    realisasiKumulatif: number;
  }[];
  createdAt: string;
}

// ==========================================
// MODUL 3: GIS MASTERPLAN
// ==========================================
export interface GISPolygon {
  id: string;
  name: string;
  type: 'industrial' | 'residential' | 'green' | 'utility' | 'road' | 'buffer';
  coordinates: [number, number][]; // lat, lng
  area: number; // m2
  color: string;
  owner?: string;
  status?: string;
}

export interface GISUtility {
  id: string;
  name: string;
  type: 'drainage' | 'electrical' | 'fiber' | 'water';
  coordinates: [number, number][]; // polyline
  status: 'active' | 'planned' | 'maintenance';
}

// ==========================================
// MODUL 4: LAND MANAGEMENT
// ==========================================
export interface LandCertificate {
  id: string;
  certificateNumber: string;
  type: 'SHM' | 'HGB' | 'HGU' | 'AJB';
  ownerName: string;
  area: number; // m2
  location: string;
  status: 'Clean & Clear' | 'Disputed' | 'In Negotiation' | 'Acquired';
  liberationProgress: number; // 0 - 100%
  compensationValue: number; // IDR
  riskAnalysis?: {
    riskLevel: 'Low' | 'Medium' | 'High';
    riskSummary: string;
    conflictPotential: string;
    legalAdvice: string;
  };
}

// ==========================================
// MODUL 5: PROJECT MONITORING (Daily, Weekly, Monthly)
// ==========================================
export interface ProjectUpdate {
  id: string;
  reportDate: string;
  reportType: 'Daily' | 'Weekly' | 'Monthly';
  physicalProgress: number; // %
  financialProgress: number; // %
  actualCashflowOut: number; // IDR
  actualCashflowIn: number; // IDR
  workSummary: string;
  constrains: string;
  materialsUsed: { name: string; quantity: string }[];
  photoUrls: string[];
  aiAnalysis?: {
    progressStatus: string;
    delayRisk: string;
    deviationPercentage: number;
    mitigationStrategy: string;
  };
}

export interface ProjectMetadata {
  id: string;
  name: string;
  budget: number;
  spent: number;
  plannedDurationWeeks: number;
  currentWeek: number;
  history: ProjectUpdate[];
}

// ==========================================
// MODUL 6: KAWASAN INDUSTRI (Industrial Estate Simulator)
// ==========================================
export interface IndustrialEstateSim {
  id: string;
  name: string;
  totalAreaHectares: number;
  developmentPhases: number;
  capexLandAcquisition: number; // IDR
  capexInfrastructure: number; // IDR
  opexAnnual: number; // IDR
  estimatedSellingPricePerSqm: number; // IDR
  occupancyRatePercentage: number; // %
  financialMetrics?: {
    roi: number; // %
    irr: number; // %
    npv: number; // IDR
    paybackPeriodYears: number;
  };
}

// ==========================================
// MODUL 7: INVESTOR DASHBOARD
// ==========================================
export interface InvestorPortfolio {
  totalAssetsUnderManagement: number;
  historicalYieldPercentage: number;
  allocatedProjects: {
    projectId: string;
    projectName: string;
    investedAmount: number;
    sharesOutstandingPercentage: number;
    currentValuation: number;
    roiToDate: number;
    status: string;
  }[];
}

// ==========================================
// MODUL 8: SMART CITY & VILLAGE MONITORING INDONESIA
// ==========================================
export interface SmartSensor {
  id: string;
  name: string;
  type: 'PJU' | 'Irigasi' | 'RobPesisir' | 'Banjir' | 'JalanDesa';
  locationName: string;
  coordinates: [number, number];
  status: 'Normal' | 'Siaga' | 'Waspada' | 'Gagal Fungsi';
  value: string; // e.g., "75% Brightness", "Debit 12 m3/s", "Tinggi Air 1.2m"
  lastUpdated: string;
}
