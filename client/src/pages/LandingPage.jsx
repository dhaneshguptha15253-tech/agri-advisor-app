import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  ScanEye, 
  TrendingUp, 
  FlaskConical, 
  Droplets, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Cpu, 
  BarChart3,
  Layers,
  ChevronRight
} from 'lucide-react';

export const LandingPage = () => {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [activeFeatureTab, setActiveFeatureTab] = useState('vision');

  const handleStartDemo = () => {
    loginDemo();
    navigate('/dashboard');
  };

  const featureTabs = [
    {
      id: 'vision',
      title: 'Multimodal Vision Diagnostic',
      icon: ScanEye,
      headline: 'Instant Plant Disease & Pest Identification',
      description: 'Snap or upload a leaf photo. Gemini 2.5 Flash analyzes microscopic symptom contours to diagnose fungal, bacterial, or nutrient disorders with dual organic & chemical remedy protocols.',
      badge: '94.5% Accuracy',
      metrics: ['Early Blight Detection', 'Rust & Powdery Mildew', 'Nutrient Chlorosis'],
    },
    {
      id: 'soil',
      title: 'Smart Soil & Fertilizer Engine',
      icon: FlaskConical,
      headline: 'Precision N-P-K Scheduling by Crop Phenology',
      description: 'Input your soil texture, pH, and macro-nutrient reserves. AgriAdvisor computes dynamic day-by-day fertilizer side-dressings and drip fertigation timing calibrated to growth stage.',
      badge: 'Up to +35% Yield Boost',
      metrics: ['Soil Texture Adaptation', 'pH Neutralization Rules', 'Dosage per Acre'],
    },
    {
      id: 'irrigation',
      title: 'Micro-Climate Irrigation Planner',
      icon: Droplets,
      headline: 'Water Volume Optimization & Warning Alarms',
      description: 'Prevent over-watering diseases and root hypoxia. Receive liters-per-acre guidelines adjusted to soil retention capacity and critical flowering stage warnings.',
      badge: '-22% Water Waste',
      metrics: ['Litres / Acre Calibration', 'Furrow & Drip Protocols', 'Flowering Safeguards'],
    },
    {
      id: 'market',
      title: 'Regional Market Trends & Harvest',
      icon: TrendingUp,
      headline: 'AI-Forecasted Selling Window & Price Realization',
      description: 'Anticipate wholesale price curves and local mandi demand spikes. Time your harvesting windows to capitalize on peak market valuation.',
      badge: 'Smart Monetization',
      metrics: ['4-Week Price Forecast', 'Optimal Harvest Window', 'Post-Harvest Sorting Rx'],
    },
  ];

  const currentTab = featureTabs.find((t) => t.id === activeFeatureTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-lg shadow-emerald-500/5 animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Google Gemini 2.5 Flash & Supabase PostgreSQL</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Outfit'] max-w-4xl mx-auto leading-[1.1]">
            Precision Agronomic Intelligence for Every{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
              Farmer & Field
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Turn raw soil pH, visual leaf photos, and micro-climate metrics into actionable, localized advisory plans. Eliminate fertilizer guesswork, detect crop diseases in real-time, and maximize harvest profit margins.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleStartDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Launch Live Agronomist Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/advisory/new"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Generate Field Advisory</span>
            </Link>
          </div>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-['Outfit']">+32.4%</p>
              <p className="text-xs text-slate-400 mt-0.5">Average Yield Gain</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-['Outfit']">94.5%</p>
              <p className="text-xs text-slate-400 mt-0.5">Disease Diagnostic Accuracy</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Outfit']">-22%</p>
              <p className="text-xs text-slate-400 mt-0.5">Water Resource Savings</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-['Outfit']">&lt;2.1s</p>
              <p className="text-xs text-slate-400 mt-0.5">Gemini 2.5 Flash Latency</p>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Agronomic Capabilities Showcase */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              End-to-End Farming Suite
            </span>
            <h2 className="text-3xl font-extrabold text-slate-100 font-['Outfit']">
              Engineered for Smallholders & Agronomists
            </h2>
            <p className="text-sm text-slate-400">
              Select an intelligent module below to explore how Gemini 2.5 powers precision agronomy.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {featureTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFeatureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Showcase Card */}
          {currentTab && (
            <div className="glass-card rounded-3xl border border-emerald-500/30 p-8 max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {currentTab.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mt-2 font-['Outfit']">
                    {currentTab.headline}
                  </h3>
                </div>

                <button
                  onClick={handleStartDemo}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition-colors"
                >
                  <span>Test in Live App</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {currentTab.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {currentTab.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-200 font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Target Crops & Geography Support */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-['Outfit']">
              Universal Crop & Soil Spectrum
            </h2>
            <p className="text-xs text-slate-400">
              Calibrated across 7 fundamental soil classifications and 6 major commercial crop categories.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Cereals & Corn', count: 'Wheat, Corn, Rice', icon: '🌾' },
              { name: 'Pulses & Legumes', count: 'Soybean, Chickpea, Lentil', icon: '🌱' },
              { name: 'Cash Crops', count: 'Cotton, Sugarcane', icon: '🌿' },
              { name: 'Fruits & Vegetables', count: 'Tomato, Potato, Citrus', icon: '🍅' },
              { name: 'Oilseeds', count: 'Sunflower, Mustard', icon: '🌻' },
              { name: 'Spices & Herbs', count: 'Pepper, Cardamom, Ginger', icon: '🌶️' },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-2 hover:border-emerald-500/40 transition-colors"
              >
                <div className="text-2xl">{cat.icon}</div>
                <h4 className="text-xs font-bold text-slate-200">{cat.name}</h4>
                <p className="text-[10px] text-slate-400">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Sprout className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm font-['Outfit']">AgriAdvisor AI</p>
              <p className="text-[11px] text-slate-400">Production Agritech Advisory Assistant</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link to="/advisory/new" className="hover:text-emerald-400 transition-colors">New Advisory</Link>
            <Link to="/inspector" className="hover:text-emerald-400 transition-colors">Crop Inspector</Link>
            <Link to="/market" className="hover:text-emerald-400 transition-colors">Market Insights</Link>
          </div>

          <p className="text-[11px] text-slate-400">
            © 2026 AgriAdvisor AI. Built with Clean Architecture & Supabase RLS.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
