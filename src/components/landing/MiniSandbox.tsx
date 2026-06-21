// src/components/landing/MiniSandbox.tsx
'use client';
import { useState } from 'react';
import { Car, Utensils, Plane, Flame, ShieldAlert, CheckCircle } from 'lucide-react';
import Globe3D from './Globe3D';

const COMMUTE_OPTIONS = [
  { id: 'car_petrol', label: 'Petrol Car', co2: 4.6, icon: Car },
  { id: 'car_electric', label: 'Electric Car', co2: 1.5, icon: Car },
  { id: 'public_transit', label: 'Public Transit', co2: 1.0, icon: Car },
  { id: 'bike_walk', label: 'Bike / Walk', co2: 0.1, icon: Car },
];

const DIET_OPTIONS = [
  { id: 'meat_lover', label: 'Meat Lover', co2: 3.3, icon: Utensils },
  { id: 'meat_regular', label: 'Regular Meat', co2: 2.5, icon: Utensils },
  { id: 'flexitarian', label: 'Flexitarian', co2: 1.7, icon: Utensils },
  { id: 'vegan', label: 'Vegan / Plant', co2: 0.7, icon: Utensils },
];

const TRAVEL_OPTIONS = [
  { id: 'flights_6_plus', label: '6+ Flights', co2: 5.5, icon: Plane },
  { id: 'flights_3_5', label: '3-5 Flights', co2: 2.8, icon: Plane },
  { id: 'flights_1_2', label: '1-2 Flights', co2: 1.0, icon: Plane },
  { id: 'never', label: 'No Flights', co2: 0.0, icon: Plane },
];

// Helper to determine aura color mapping
function getAuraDetails(score: number) {
  if (score <= 2.3) {
    return {
      name: 'Paris-Compliant Green',
      color: 'from-emerald-400 to-green-500',
      globeColor: 'rgb(16, 185, 129)',
      shadowColor: 'rgba(16, 185, 129, 0.4)',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      desc: 'Excellent. Your footprint aligns with keeping global warming below 1.5°C.',
      icon: CheckCircle
    };
  }
  if (score <= 4.7) {
    return {
      name: 'Global Average Emerald',
      color: 'from-teal-400 to-emerald-500',
      globeColor: 'rgb(20, 184, 166)',
      shadowColor: 'rgba(20, 184, 166, 0.4)',
      borderColor: 'border-teal-500/30',
      textColor: 'text-teal-400',
      desc: 'Moderate. You match the global average footprint, but exceed target levels.',
      icon: CheckCircle
    };
  }
  if (score <= 8.0) {
    return {
      name: 'Cyber Sapphire',
      color: 'from-blue-400 to-indigo-500',
      globeColor: 'rgb(59, 130, 246)',
      shadowColor: 'rgba(59, 130, 246, 0.4)',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      desc: 'Elevated. Your lifestyle footprint aligns with high-consuming regions.',
      icon: ShieldAlert
    };
  }
  if (score <= 14.0) {
    return {
      name: 'Industrial Amber',
      color: 'from-amber-400 to-orange-500',
      globeColor: 'rgb(245, 158, 11)',
      shadowColor: 'rgba(245, 158, 11, 0.4)',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      desc: 'High. Aligning with extreme emissions regions. Shifts are highly encouraged.',
      icon: Flame
    };
  }
  return {
    name: 'Crimson Carbon',
    color: 'from-rose-500 to-red-600',
    globeColor: 'rgb(239, 68, 68)',
    shadowColor: 'rgba(239, 68, 68, 0.4)',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    desc: 'Critical. Your footprint is unsustainable, requiring immediate mitigation.',
    icon: Flame
  };
}

export default function MiniSandbox() {
  const [commute, setCommute] = useState('car_petrol');
  const [diet, setDiet] = useState('meat_regular');
  const [travel, setTravel] = useState('flights_1_2');

  const commuteCO2 = COMMUTE_OPTIONS.find(o => o.id === commute)?.co2 ?? 0;
  const dietCO2 = DIET_OPTIONS.find(o => o.id === diet)?.co2 ?? 0;
  const travelCO2 = TRAVEL_OPTIONS.find(o => o.id === travel)?.co2 ?? 0;

  // Add baseline energy and consumption to mimic real scores
  const totalScore = Math.round((commuteCO2 + dietCO2 + travelCO2 + 2.0) * 10) / 10;
  const aura = getAuraDetails(totalScore);
  const AuraIcon = aura.icon;

  return (
    <div className="w-full glass-card border border-white/5 bg-neutral-900/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl flex flex-col lg:flex-row gap-8 items-stretch justify-between relative overflow-hidden">
      {/* Background ambient light */}
      <div 
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full filter blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: aura.shadowColor }}
      />
      
      {/* Selector Side */}
      <div className="flex-1 space-y-6 text-left">
        <div>
          <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Interactive Sandbox Preview</span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1 font-display">
            Simulate Daily Habits
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Toggle your choices to watch your Carbon Twin&apos;s aura morph in real-time.
          </p>
        </div>

        {/* Commute Selector */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-neutral-500" />
            Daily Commuting
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMMUTE_OPTIONS.map((opt) => {
              const active = commute === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCommute(opt.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                    active 
                      ? 'bg-white/10 border-white/20 text-white shadow-md' 
                      : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold text-[10px]">{opt.label}</span>
                  <span className="font-mono text-[9px] text-neutral-500">{opt.co2} t/yr</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diet Selector */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-neutral-500" />
            Dietary Choices
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIET_OPTIONS.map((opt) => {
              const active = diet === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDiet(opt.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                    active 
                      ? 'bg-white/10 border-white/20 text-white shadow-md' 
                      : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold text-[10px]">{opt.label}</span>
                  <span className="font-mono text-[9px] text-neutral-500">{opt.co2} t/yr</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel Selector */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-neutral-500" />
            Flights & Aviation
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TRAVEL_OPTIONS.map((opt) => {
              const active = travel === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTravel(opt.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                    active 
                      ? 'bg-white/10 border-white/20 text-white shadow-md' 
                      : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold text-[10px]">{opt.label}</span>
                  <span className="font-mono text-[9px] text-neutral-500">{opt.co2} t/yr</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Result Twin Orb Side */}
      <div className="lg:w-80 flex flex-col justify-center items-center p-6 bg-white/5 border border-white/5 rounded-2xl relative overflow-hidden">
        {/* 3D Globe */}
        <div className="w-56 h-56 flex items-center justify-center relative">
          <Globe3D color={aura.globeColor} shadowColor={aura.shadowColor} size={220} />
        </div>

        {/* Aura Identity Card info */}
        <div className="mt-6 text-center space-y-3 w-full">
          <div className="flex justify-around items-center bg-black/40 border border-white/5 rounded-2xl py-3 px-4 w-full">
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">Carbon score</p>
              <p className="text-2xl font-black text-white mt-0.5">{totalScore}<span className="text-xs font-normal text-neutral-400 ml-0.5">t</span></p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">Aura Class</p>
              <span className={`text-xs font-black uppercase tracking-wider ${aura.textColor} block mt-1`}>{aura.name.split(' ').pop()}</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mt-2">
            <AuraIcon className={`w-3.5 h-3.5 ${aura.textColor}`} />
            <span className={`text-[10px] font-black uppercase tracking-wider ${aura.textColor}`}>{aura.name}</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed max-w-[240px] mx-auto">
            {aura.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
