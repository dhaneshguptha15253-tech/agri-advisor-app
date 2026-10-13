import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdvisoryForm } from '../components/AdvisoryForm';
import { AdvisoryReportView } from '../components/AdvisoryReportView';
import { 
  Sprout, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Layers, 
  Lightbulb 
} from 'lucide-react';

export const NewAdvisoryPage = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleSubmitAdvisory = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await api.generateAdvisory(formData, token);

      if (response?.data) {
        setGeneratedReport(response.data);
      } else {
        throw new Error('Invalid advisory response received from server.');
      }
    } catch (err) {
      console.error('[Generate Advisory Error]:', err);
      setError(
        err.message ||
        'Failed to generate advisory plan. Please check inputs and verify server connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      {!generatedReport && (
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Gemini 2.5 Crop Advisory Generation</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-['Outfit']">
            Generate Precision Field Advisory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Input soil test results, target crop variety, and field scale. The Gemini 2.5 agronomic AI model will calculate nutrient uptake kinetics, optimal fertilizer side-dressings, and water schedules.
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <div className="space-y-0.5">
            <p className="font-bold">Advisory Generation Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main View: Either Form or Rendered Report */}
      {generatedReport ? (
        <AdvisoryReportView
          report={generatedReport}
          onBack={() => setGeneratedReport(null)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Wizard Form (3 Columns) */}
          <div className="lg:col-span-3">
            <AdvisoryForm
              onSubmit={handleSubmitAdvisory}
              isLoading={loading}
            />
          </div>

          {/* Agronomic Sidebar Tips (1 Column) */}
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Agronomist Guidance
              </h4>

              <div className="space-y-2.5 text-xs text-slate-300">
                <p>
                  <strong className="text-slate-100">Soil pH Impact:</strong> Macronutrient absorption peaks between pH 6.2 and 7.2. Below 5.8, phosphorus fixes to aluminum/iron.
                </p>
                <p>
                  <strong className="text-slate-100">N-P-K Split:</strong> Nitrogen is highly volatile in sandy soil; schedule frequent smaller doses to reduce runoff.
                </p>
                <p>
                  <strong className="text-slate-100">Flowering Alert:</strong> Avoid high-nitrogen bursts right before flowering to prevent vegetative runaway.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" /> Science Standard
              </span>
              <p className="text-[11px] leading-relaxed">
                Calculations strictly conform to ISO/TC 34 agricultural food products and state extension guidelines.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default NewAdvisoryPage;
