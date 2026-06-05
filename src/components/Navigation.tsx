/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  FileText, 
  Calculator, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Menu, 
  X, 
  Home, 
  Landmark, 
  Users, 
  FileCheck2,
  Cpu
} from 'lucide-react';
import { User } from '../types';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

export default function Navigation({ currentView, setCurrentView, currentUser, setCurrentUser }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'landing', label: 'Home Portal', icon: Home },
    { id: 'dashboard', label: 'Enterprise Dashboard', icon: Building2 },
    { id: 'gis', label: 'GIS Masterplan', icon: MapPin },
    { id: 'land', label: 'Land Management', icon: Landmark },
    { id: 'proposal', label: 'AI Proposal Generator', icon: FileText },
    { id: 'rab', label: 'AI RAB & Kurva-S', icon: Calculator },
    { id: 'project', label: 'Construction Monitoring', icon: Eye },
    { id: 'investor', label: 'Investor Deck', icon: DollarSign },
    { id: 'industrial', label: 'Industrial Zone Sim', icon: TrendingUp },
    { id: 'smart-village', label: 'Smart City & Desa', icon: Cpu },
    { id: 'admin', label: 'Admin & SaaS Panel', icon: ShieldCheck },
  ];

  const availableRoles: { role: User['role'], label: string; desc: string }[] = [
    { role: 'contractor', label: 'Kontraktor Sipil', desc: 'Akes RAB & Kurva S (PUPR)' },
    { role: 'developer', label: 'Developer Perumahan / Kawasan', desc: 'Pembebasan lahan & masterplan' },
    { role: 'investor', label: 'Global L.P. Investor', desc: 'Yield portfolio, Net cashflow, ROI' },
    { role: 'government_official', label: 'Pemda / BUMDes', desc: 'Infrastruktur air desa & RPJMD' },
    { role: 'admin', label: 'SaaS Multi-tenant Admin', desc: 'Superuser control & DB health' },
  ];

  const handleRoleChange = (role: User['role']) => {
    const matched = availableRoles.find(x => x.role === role);
    setCurrentUser({
      ...currentUser,
      role,
      fullName: `Ir. ${currentUser.fullName.replace('Ir. ', '')}`,
      companyName: role === 'government_official' ? 'BUMDes Karya Makmur' : (role === 'investor' ? 'Fortuna Capital Trust' : 'Nusantara Karya, PT')
    });
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-brand-navy border-b border-brand-gold/15 lg:hidden">
        <div className="flex items-center space-x-2">
          <div className="p-1 px-2 border rounded-md border-brand-gold bg-brand-gold/10">
            <span className="font-display font-bold text-brand-gold text-sm tracking-widest">F</span>
          </div>
          <span className="font-display font-semibold text-white tracking-tight text-md">FORTUNA CONSTRUCT</span>
          <span className="text-[10px] text-brand-gold uppercase font-mono px-1 rounded bg-brand-gold/10">AI</span>
        </div>
        <button 
          id="mobile-nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 border border-brand-gold/35 rounded text-brand-gold hover:bg-brand-gold/10"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950/95 border-r border-brand-gold/15 flex flex-col pt-16 lg:pt-0 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-0 lg:translate-x-0'}`}>
        {/* Brand Header */}
        <div className="hidden lg:flex items-center px-6 py-6 border-b border-brand-gold/10">
          <div className="mr-3 p-1.5 px-2 border rounded-md border-brand-gold bg-brand-gold/10">
            <span className="font-display font-bold text-brand-gold text-lg tracking-widest">F</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-md tracking-tight leading-tight">FORTUNA CONSTRUCT</h1>
            <p className="text-[10px] text-brand-gold/80 font-mono tracking-wider uppercase">SaaS Enterprise Platform</p>
          </div>
        </div>

        {/* User Persona & Role Switcher */}
        <div className="p-4 mx-4 my-4 rounded-lg bg-brand-navy/60 border border-brand-gold/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-9 w-9 rounded-full bg-brand-gold/25 flex items-center justify-center border border-brand-gold/50 text-brand-light">
              <span className="font-display font-semibold text-brand-gold text-sm">
                {currentUser?.fullName.charAt(0) || 'U'}
              </span>
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-semibold text-slate-100 truncate">{currentUser.fullName}</h2>
              <p className="text-[10px] text-brand-gold font-mono truncate">{currentUser.companyName}</p>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
              Simulasi Akun (SaaS Persona):
            </label>
            <select 
              id="role-switch"
              value={currentUser.role}
              onChange={(e) => handleRoleChange(e.target.value as User['role'])}
              className="w-full text-xs bg-slate-900 text-brand-gold-light border border-brand-gold/30 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-gold pointer-events-auto"
            >
              {availableRoles.map(x => (
                <option key={x.role} value={x.role}>{x.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                id={`nav-${item.id}`}
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2.5 rounded-md text-xs font-medium tracking-wide transition-all ${isActive ? 'bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 text-brand-gold border-l-2 border-brand-gold shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <IconComponent className={`mr-3 h-4.5 w-4.5 ${isActive ? 'text-brand-gold' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Panel footer */}
        <div className="p-4 border-t border-brand-gold/10 text-[10px] text-slate-500 font-mono flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span>DATABASE IP:</span>
            <span className="text-[#F3E5AB]">10.244.1.48 (PostGIS)</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span>FIREBASE SESS:</span>
            <span className="text-[#D4AF37]">Active (JWT Secure)</span>
          </div>
          <div className="text-center text-slate-600 mt-2">
            &copy; 2026 PT Fortuna Construct AI
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden pointer-events-auto"
        />
      )}
    </>
  );
}
