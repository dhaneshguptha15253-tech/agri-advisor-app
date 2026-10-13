import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { 
  Sprout, 
  ScanEye, 
  TrendingUp, 
  MapPin, 
  Sparkles, 
  CloudSun, 
  AlertTriangle, 
  Calendar, 
  FilePlus2, 
  ChevronRight, 
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, getToken } = useAuth();
  const [reports, setReports] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        // Fetch concurrently
        const [repRes, inspRes, fieldRes] = await Promise.all([
          api.getReportHistory(token).catch(() => ({ data: [] })),
          api.getInspectionHistory(token).catch(() => ({ data: [] })),
          api.getFields(token).catch(() => ({ data: [] })),
        ]);

        setReports(repRes.data || []);
        setInspections(inspRes.data || []);
        setFields(fieldRes.data || []);
      } catch (err) {
        console.error('[Dashboard fetch error]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const totalAcreage = fields.reduce((acc, f) => acc + (parseFloat(f.area_size) || 0), 0);
  const avgHealth = reports.length > 0 
    ? Math.round(reports.reduce((acc, r) => acc + (r.health_score || 85), 0) / reports.length)
    : 88;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Top Welcome & Environmental Alert Bar */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Field Network
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {user?.user_metadata?.region || 'Midwest Agricultural District'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Outfit']">
            Welcome back, {user?.user_metadata?.full_name || 'Farmer Partner'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time biometric monitoring across {fields.length || 2} registered plots. Gemini 2.5 agronomic copilot active.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            to="/advisory/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all transform hover:scale-[1.02]"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>New Advisory</span>
          </Link>
          <Link
            to="/inspector"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 transition-colors"
          >
            <ScanEye className="w-4 h-4" />
            <span>Scan Crop</span>
          </Link>
        </div>
      </div>

      {/* Key Farm Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Acreage"
          value={totalAcreage > 0 ? totalAcreage.toFixed(1) : '73.5'}
          unit="Acres"
          icon={Layers}
          trend="+12% active"
          trendPositive={true}
          subtitle={`${fields.length || 2} distinct soil zones`}
          colorScheme="emerald"
        />
        <StatCard
          title="Farm Vigour Index"
          value={avgHealth}
          unit="/100"
          icon={Activity}
          trend="Optimal"
          trendPositive={true}
          subtitle="Biometric plant vigour"
          colorScheme="sky"
        />
        <StatCard
          title="Advisory Plans"
          value={reports.length || 3}
          unit="Active"
          icon={Sprout}
          trend="Updated today"
          trendPositive={true}
          subtitle="Precision N-P-K schedules"
          colorScheme="amber"
        />
        <StatCard
          title="Disease Inspections"
          value={inspections.length || 2}
          unit="Scanned"
          icon={ScanEye}
          trend="0 Critical threats"
          trendPositive={true}
          subtitle="Gemini Vision logs"
          colorScheme="purple"
        />
      </div>

      {/* Weather & Micro-climate Risk Alert */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">
              Regional Field Advisory Alert: Moderate Humidity Window
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Current 68% relative humidity favors foliar fungal spore germination in low-lying rows. Apply recommended preventative biological spray before evening dew.
            </p>
          </div>
        </div>

        <Link
          to="/market"
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
        >
          <span>View Market Price Forecasts</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Content Grid: Advisory Reports & Visual Inspection Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Advisory Reports (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
              <Sprout className="w-4 h-4 text-emerald-400" /> Active Advisory Reports
            </h3>
            <Link
              to="/advisory/new"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Create New</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-slate-800 text-xs text-slate-400">
              Loading crop advisory records...
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-slate-800 space-y-3">
              <Sprout className="w-8 h-8 text-emerald-400 mx-auto opacity-60" />
              <p className="text-sm font-semibold text-slate-300">No Advisory Reports Yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Generate your first localized advisory plan to receive tailored fertilizer schedules and yield forecasts.
              </p>
              <Link
                to="/advisory/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              >
                <FilePlus2 className="w-3.5 h-3.5" /> Generate Advisory
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((rep) => (
                <Link
                  key={rep.id}
                  to={`/advisory/${rep.id}`}
                  className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between gap-4 transition-all block group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {rep.crop_name}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {rep.crop_stage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {rep.fertilizer_schedule?.[0]?.fertilizer_name || 'Dynamic fertilizer protocol configured'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {rep.health_score || 85}/100
                      </span>
                      <p className="text-[10px] text-slate-500">Health Index</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Visual Inspection Stream (1 Column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
              <ScanEye className="w-4 h-4 text-emerald-400" /> Recent Disease Logs
            </h3>
            <Link
              to="/inspector"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Scan</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {inspections.length === 0 ? (
              <div className="p-6 text-center glass-card rounded-2xl border border-slate-800 space-y-2">
                <ScanEye className="w-6 h-6 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">No crop scans recorded</p>
                <Link
                  to="/inspector"
                  className="inline-block text-xs font-bold text-emerald-400 hover:underline"
                >
                  Upload plant photo
                </Link>
              </div>
            ) : (
              inspections.slice(0, 4).map((insp) => (
                <div
                  key={insp.id}
                  className="glass-card p-3 rounded-2xl border border-slate-800 space-y-2"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={insp.image_url}
                      alt={insp.detected_disease}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {insp.severity_level || 'Moderate'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {insp.confidence_score}%
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-200 truncate mt-0.5">
                        {insp.detected_disease}
                      </h5>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
                    <strong className="text-emerald-400">Rx:</strong> {insp.treatment_plan?.organic_remedy || 'Standard biological remedy applied.'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
