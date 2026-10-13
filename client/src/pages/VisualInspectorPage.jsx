import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ImageUploader } from '../components/ImageUploader';
import { DiseaseCard } from '../components/DiseaseCard';
import { 
  ScanEye, 
  Sparkles, 
  AlertCircle, 
  History, 
  ShieldCheck, 
  ArrowRight,
  Layers
} from 'lucide-react';

export const VisualInspectorPage = () => {
  const { getToken } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchInspectionHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = getToken();
      const res = await api.getInspectionHistory(token);
      setHistory(res.data || []);
    } catch (err) {
      console.error('[History Fetch Error]:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchInspectionHistory();
  }, []);

  const handleRunDiagnosis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const token = getToken();
      const response = await api.analyzeCropImage(
        selectedImage.base64,
        selectedImage.mimeType,
        selectedImage.cropContext || 'General Plant Specimen',
        token
      );

      if (response?.data) {
        setDiagnosisResult(response.data);
        // Refresh history
        fetchInspectionHistory();
      } else {
        throw new Error('No diagnosis returned by AI vision system.');
      }
    } catch (err) {
      console.error('[Diagnosis Error]:', err);
      setError(
        err.message || 'Failed to analyze crop photo. Please verify image clarity and try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Crop Pathology Inspector</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-['Outfit']">
          Visual Crop Health & Disease Diagnostic
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Upload or capture photos of infected plant foliage, stems, or fruits. Google Gemini 2.5 Flash Vision evaluates chlorotic patterns, lesions, and necrosis to generate dual-mode organic and chemical treatment schedules.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <div>
            <p className="font-bold">Diagnostic Analysis Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Upload & Analysis vs Diagnosis View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Selector & Analyze Action (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ScanEye className="w-4 h-4 text-emerald-400" /> Select Specimen
            </h3>

            <ImageUploader
              onImageSelected={(imgData) => {
                setSelectedImage(imgData);
                if (!imgData) setDiagnosisResult(null);
              }}
              isAnalyzing={isAnalyzing}
            />

            {selectedImage && (
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={handleRunDiagnosis}
                className="w-full py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Diagnosing with Gemini 2.5 Multimodal...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Run AI Disease Diagnosis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <p className="font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Image Quality Best Practices:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Capture close-up of leaf margins and lesion transitions.</li>
              <li>Avoid high-glare direct sunlight or blurry motions.</li>
              <li>Include both healthy and diseased tissue on the specimen.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Diagnosis Result or History (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {diagnosisResult ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Instant Diagnostic Output
                </span>
                <button
                  onClick={() => setDiagnosisResult(null)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear Result
                </button>
              </div>

              <DiseaseCard
                diagnosis={diagnosisResult}
                imagePreview={selectedImage?.base64}
              />
            </div>
          ) : (
            <div className="glass-card p-8 rounded-3xl border border-dashed border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <ScanEye className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-base font-bold text-slate-200 font-['Outfit']">
                Awaiting Specimen Upload
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Choose an image from your device or select one of the test specimens on the left to see instant Gemini 2.5 diagnosis and treatment remedies.
              </p>
            </div>
          )}

          {/* Past Inspection History */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" /> Inspection History Log
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {history.length} Scans Archived
              </span>
            </div>

            {loadingHistory ? (
              <p className="text-xs text-slate-400">Loading inspection history...</p>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-500">No previous inspections logged yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card p-3 rounded-2xl border border-slate-800 space-y-2 hover:border-emerald-500/30 transition-all cursor-pointer"
                    onClick={() => {
                      setDiagnosisResult(item);
                      setSelectedImage({ base64: item.image_url });
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt={item.detected_disease}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                            {item.severity_level}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.confidence_score}%
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-200 truncate mt-0.5">
                          {item.detected_disease}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default VisualInspectorPage;
