import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Leaf, 
  FlaskRound, 
  Sprout, 
  CheckCheck, 
  Copy, 
  Sparkles,
  Layers
} from 'lucide-react';

export const DiseaseCard = ({ diagnosis, imagePreview = null }) => {
  const [activeTab, setActiveTab] = useState('organic');
  const [copied, setCopied] = useState(false);

  if (!diagnosis) return null;

  const severityColors = {
    Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    Moderate: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Severe: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    Critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse-subtle',
  };

  const severityBadgeClass =
    severityColors[diagnosis.severity_level] || severityColors.Moderate;

  const handleCopyPrescription = () => {
    const text = `AgriAdvisor AI Plant Health Rx:
Disease: ${diagnosis.detected_disease} (${diagnosis.severity_level} Severity - ${diagnosis.confidence_score}% Confidence)
Symptoms:
${(diagnosis.symptoms || []).map((s) => `• ${s}`).join('\n')}

Organic Treatment:
${diagnosis.treatment_plan?.organic_remedy || 'N/A'}

Chemical Treatment:
${diagnosis.treatment_plan?.chemical_remedy || 'N/A'}

Cultural Control:
${diagnosis.treatment_plan?.cultural_control || 'N/A'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl border border-emerald-500/30 overflow-hidden shadow-xl space-y-0">
      
      {/* Top Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {imagePreview ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 shadow-md">
              <img
                src={imagePreview}
                alt="Analyzed crop specimen"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityBadgeClass}`}>
                {diagnosis.severity_level} Severity
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {diagnosis.confidence_score}% Confidence
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Gemini 2.5 Flash Vision
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-100 mt-1 font-['Outfit']">
              {diagnosis.detected_disease}
            </h3>
          </div>
        </div>

        <button
          onClick={handleCopyPrescription}
          className="self-start md:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Rx' : 'Copy Treatment Rx'}</span>
        </button>
      </div>

      <div className="p-5 space-y-5">
        
        {/* Symptoms Section */}
        {diagnosis.symptoms && diagnosis.symptoms.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Identified Pathological Symptoms
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {diagnosis.symptoms.map((symptom, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                  <span>{symptom}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Treatment Protocol Tabs */}
        <div>
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
            <button
              onClick={() => setActiveTab('organic')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'organic'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Organic & Biological Remedy
            </button>
            <button
              onClick={() => setActiveTab('chemical')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'chemical'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FlaskRound className="w-3.5 h-3.5 text-sky-400" /> Chemical Intervention
            </button>
            <button
              onClick={() => setActiveTab('cultural')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'cultural'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-amber-400" /> Cultural & Field Control
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            {activeTab === 'organic' && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400">Biological Shielding Plan:</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {diagnosis.treatment_plan?.organic_remedy || 'Apply organic neem extract and Trichoderma viride bio-agent.'}
                </p>
              </div>
            )}

            {activeTab === 'chemical' && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-sky-400">Targeted Chemical Formulation:</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {diagnosis.treatment_plan?.chemical_remedy || 'Standard fungicide application according to state extension guidelines.'}
                </p>
              </div>
            )}

            {activeTab === 'cultural' && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400">Farm Sanitation & Water Management:</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {diagnosis.treatment_plan?.cultural_control || 'Improve plant aeration, thin diseased canopy, and prevent soil splash.'}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DiseaseCard;
