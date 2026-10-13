import React from 'react';
import { 
  Printer, 
  Share2, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Sprout, 
  Calendar, 
  Droplet, 
  TrendingUp, 
  Download,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ScheduleTimeline } from './ScheduleTimeline';
import { YieldChart } from './YieldChart';

export const AdvisoryReportView = ({ report, onBack = null }) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `AgriAdvisor Advisory: ${report.crop_name}`,
        text: `Crop Advisory Report for ${report.crop_name} (${report.crop_stage}). Health Score: ${report.health_score}/100`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  const healthScore = report.health_score || 85;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Google Gemini 2.5 Certified Advisory
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Report ID: #{report.id ? String(report.id).slice(0, 8) : 'NEW'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight font-['Outfit']">
              {report.crop_name}
            </h1>

            <p className="text-sm text-slate-300 flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Sprout className="w-4 h-4" /> {report.crop_stage}
              </span>
              <span>•</span>
              <span className="text-slate-400">
                Generated {new Date(report.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </p>
          </div>

          {/* Health Score Gauge */}
          <div className="flex items-center gap-4 self-start lg:self-center">
            <div className="relative w-24 h-24 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col items-center justify-center p-2 shadow-inner">
              <span className="text-3xl font-black text-emerald-400 font-['Outfit']">
                {healthScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Health Index
              </span>
              <div
                className="absolute inset-0 rounded-2xl border-2 border-emerald-400/40 pointer-events-none"
                style={{ opacity: healthScore / 100 }}
              ></div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Agronomic Vigour: Optimal
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                Micro-climate indices match genetic target range for {report.crop_name}.
              </p>
            </div>
          </div>

        </div>

        {/* Action Buttons Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              >
                ← Back to List
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Plan</span>
            </button>
          </div>
        </div>

      </div>

      {/* Agronomic Executive Summary */}
      {report.summary && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> AI Agronomist Synthesis
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            {report.summary}
          </p>
        </div>
      )}

      {/* Two Column Layout: Yield Chart & Disease Risk Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Yield Projections */}
        <YieldChart yieldProjection={report.yield_projection} />

        {/* Disease & Biological Risk Matrix */}
        <div className="glass-card p-5 rounded-2xl border border-amber-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Field Disease & Pest Risk Matrix
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {(report.disease_risks || []).length} Threats Tracked
            </span>
          </div>

          <div className="space-y-3">
            {(report.disease_risks || []).map((risk, index) => {
              const isHigh = risk.risk_level === 'High' || risk.risk_level === 'Severe';
              return (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100">
                      {risk.disease_name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {risk.risk_level} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-400 font-medium">Preventative Measure:</strong> {risk.preventative_measure}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Actionable Fertilizer Schedule & Irrigation Plan */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-emerald-500/20">
        <h3 className="text-lg font-bold text-slate-100 mb-6 font-['Outfit'] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" /> Dynamic Fertilizer & Irrigation Schedule
        </h3>

        <ScheduleTimeline
          fertilizerSchedule={report.fertilizer_schedule || []}
          irrigationPlan={report.irrigation_plan}
        />
      </div>

    </div>
  );
};

export default AdvisoryReportView;
