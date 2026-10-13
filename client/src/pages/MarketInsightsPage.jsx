import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Layers, 
  BarChart2,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const MarketInsightsPage = () => {
  const { getToken } = useAuth();
  const [cropName, setCropName] = useState('Sweet Corn (Zea mays)');
  const [region, setRegion] = useState('Midwest Agricultural District');
  const [cropStage, setCropStage] = useState('Late Vegetative');
  const [harvestWeeks, setHarvestWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [error, setError] = useState(null);

  const handlePredictMarket = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const res = await api.predictMarket({
        crop_name: cropName,
        location_region: region,
        crop_stage: cropStage,
        estimated_harvest_weeks: parseInt(harvestWeeks, 10),
      }, token);

      if (res?.data) {
        setMarketData(res.data);
      } else {
        throw new Error('Failed to load market forecast.');
      }
    } catch (err) {
      console.error('[Market Predict Error]:', err);
      setError(err.message || 'Market forecast service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePredictMarket();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Regional Market Matrix & Harvest Timing</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-['Outfit']">
          Crop Market Intelligence & Harvest Optimization
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Leverage real-time agricultural mandi and terminal wholesale trends to time crop harvesting for peak farm-gate profitability.
        </p>
      </div>

      {/* Query Selector Bar */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800">
        <form onSubmit={handlePredictMarket} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Crop</label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Region / Wholesale Hub</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Growth Stage</label>
            <select
              value={cropStage}
              onChange={(e) => setCropStage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="Early Vegetative">Early Vegetative</option>
              <option value="Late Vegetative">Late Vegetative</option>
              <option value="Flowering/Tillering">Flowering/Tillering</option>
              <option value="Fruit/Grain Development">Fruit/Grain Development</option>
              <option value="Maturation/Harvest">Maturation/Harvest</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Harvest Window</label>
            <select
              value={harvestWeeks}
              onChange={(e) => setHarvestWeeks(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value={2}>In 2 Weeks</option>
              <option value={4}>In 4 Weeks</option>
              <option value={6}>In 6 Weeks</option>
              <option value={8}>In 8 Weeks</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>Forecast Trends</span>
              </>
            )}
          </button>

        </form>
      </div>

      {marketData && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Current Terminal Spot Price
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-emerald-400 font-['Outfit']">
                  ${marketData.current_market_price_per_kg?.toFixed(2) || '2.15'}
                </span>
                <span className="text-xs text-slate-400">/ kg wholesale</span>
              </div>
              <p className="text-[11px] text-slate-400">Hub: {marketData.region}</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-sky-500/20 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Projected 4-Week Trend
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-sky-300 font-['Outfit']">
                  {marketData.projected_price_trend}
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Favorable timing window
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Recommended Harvest Window
              </span>
              <div className="text-sm font-bold text-amber-300 font-['Outfit'] mt-1">
                {marketData.recommended_harvest_window}
              </div>
              <p className="text-[11px] text-slate-400">Avoid post-harvest price glut</p>
            </div>

          </div>

          {/* Area Chart: Price Forecast Curve */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
                  <BarChart2 className="w-4 h-4 text-emerald-400" /> Projected Wholesale Price & Demand Index
                </h3>
                <p className="text-xs text-slate-400">Estimated value progression ($/kg) across upcoming weeks.</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                Gemini 2.5 Market Synthesis
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData.price_forecast_chart || []}>
                  <defs>
                    <linearGradient id="priceGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 0.2', 'dataMax + 0.2']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    name="Price ($/kg)"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#priceGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Drivers & Monetization Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Regional Market Drivers
              </h4>
              <ul className="space-y-2">
                {(marketData.market_drivers || []).map((driver, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Recommended Monetization Strategy
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {marketData.selling_strategy}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default MarketInsightsPage;
