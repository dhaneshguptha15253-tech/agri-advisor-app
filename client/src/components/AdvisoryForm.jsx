import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  Layers, 
  Gauge, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Silt', 'Peaty', 'Chalky', 'Saline'];
const CROP_STAGES = [
  'Seedling/Germination',
  'Early Vegetative',
  'Late Vegetative',
  'Flowering/Tillering',
  'Fruit/Grain Development',
  'Maturation/Harvest',
];
const NUTRIENT_LEVELS = ['Low', 'Medium', 'High'];
const BUDGET_LEVELS = ['Low', 'Moderate', 'High'];

const PRESETS = [
  {
    label: 'Iowa Cornfield',
    data: {
      farm_name: 'Midwest Pioneer Acreage',
      target_crop: 'Sweet Corn (Zea mays)',
      location_region: 'Des Moines, Iowa',
      soil_type: 'Loamy',
      soil_ph: 6.8,
      nitrogen_level: 'Medium',
      phosphorus_level: 'High',
      potassium_level: 'Medium',
      crop_stage: 'Early Vegetative',
      field_area_acres: 35,
      budget_level: 'Moderate',
    }
  },
  {
    label: 'Salinas Valley Tomato',
    data: {
      farm_name: 'Pacific Green Farms',
      target_crop: 'Processing Tomato (Roma)',
      location_region: 'Salinas, California',
      soil_type: 'Sandy',
      soil_ph: 6.5,
      nitrogen_level: 'Low',
      phosphorus_level: 'Medium',
      potassium_level: 'Medium',
      crop_stage: 'Flowering/Tillering',
      field_area_acres: 18,
      budget_level: 'High',
    }
  },
  {
    label: 'Kansas Winter Wheat',
    data: {
      farm_name: 'High Plains Agri',
      target_crop: 'Hard Red Winter Wheat',
      location_region: 'Wichita, Kansas',
      soil_type: 'Silt',
      soil_ph: 7.1,
      nitrogen_level: 'Medium',
      phosphorus_level: 'Low',
      potassium_level: 'High',
      crop_stage: 'Late Vegetative',
      field_area_acres: 80,
      budget_level: 'Moderate',
    }
  },
];

export const AdvisoryForm = ({ onSubmit, isLoading = false }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    farm_name: 'Sunrise Family Field',
    target_crop: 'Sweet Corn (Zea mays)',
    location_region: 'Des Moines, Iowa',
    soil_type: 'Loamy',
    soil_ph: 6.8,
    nitrogen_level: 'Medium',
    phosphorus_level: 'Medium',
    potassium_level: 'Medium',
    crop_stage: 'Early Vegetative',
    field_area_acres: 25,
    budget_level: 'Moderate',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const applyPreset = (presetData) => {
    setFormData(presetData);
    setErrors({});
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.target_crop || formData.target_crop.trim().length < 2) {
        newErrors.target_crop = 'Please specify target crop name (min 2 chars).';
      }
      if (!formData.location_region || formData.location_region.trim().length < 2) {
        newErrors.location_region = 'Please enter farm location or district.';
      }
    }

    if (currentStep === 2) {
      if (formData.soil_ph !== null && formData.soil_ph !== '') {
        const ph = parseFloat(formData.soil_ph);
        if (isNaN(ph) || ph < 3.0 || ph > 10.0) {
          newErrors.soil_ph = 'Soil pH must be between 3.0 and 10.0';
        }
      }
    }

    if (currentStep === 3) {
      const acres = parseFloat(formData.field_area_acres);
      if (isNaN(acres) || acres <= 0) {
        newErrors.field_area_acres = 'Field area must be greater than 0.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      onSubmit({
        ...formData,
        soil_ph: formData.soil_ph ? parseFloat(formData.soil_ph) : null,
        field_area_acres: parseFloat(formData.field_area_acres),
      });
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-6 md:p-8 space-y-8">
      
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">Quick-Fill Field Profiles:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset.data)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Step Progress Tracker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-emerald-400 font-mono">Step {step} of 4</span>
          <span className="text-slate-400">
            {step === 1 && 'Crop & Farm Location'}
            {step === 2 && 'Soil Texture & Soil pH'}
            {step === 3 && 'Growth Stage & Nutrients'}
            {step === 4 && 'Synthesis & Generation'}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STEP 1: Crop & Location */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-800/60 pb-3">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
                <Sprout className="w-5 h-5 text-emerald-400" /> Farm Identity & Target Crop
              </h3>
              <p className="text-xs text-slate-400">Identify the regional geography and plant variety.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Farm / Field Name
                </label>
                <input
                  type="text"
                  value={formData.farm_name}
                  onChange={(e) => handleChange('farm_name', e.target.value)}
                  placeholder="e.g., North Valley Plot #3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Location / Region / District <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location_region}
                    onChange={(e) => handleChange('location_region', e.target.value)}
                    placeholder="e.g., Des Moines, Iowa"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-slate-100 focus:outline-none transition-colors ${
                      errors.location_region ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                    }`}
                  />
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
                {errors.location_region && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.location_region}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Crop Variety <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.target_crop}
                  onChange={(e) => handleChange('target_crop', e.target.value)}
                  placeholder="e.g., Sweet Corn (Golden Bantam), Roma Tomato, Soybean..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-slate-100 focus:outline-none transition-colors ${
                    errors.target_crop ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                  }`}
                />
                {errors.target_crop && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.target_crop}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Soil Profile & pH */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-800/60 pb-3">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
                <Layers className="w-5 h-5 text-emerald-400" /> Soil Profile & Chemistry
              </h3>
              <p className="text-xs text-slate-400">Configure physical soil texture and electrochemical pH.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Soil Texture Type <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SOIL_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('soil_type', type)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                        formData.soil_type === type
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-emerald-400" /> Soil pH Level
                  </label>
                  <span className="text-sm font-bold text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    {formData.soil_ph ?? 6.5} pH
                  </span>
                </div>

                <input
                  type="range"
                  min="3.0"
                  max="10.0"
                  step="0.1"
                  value={formData.soil_ph ?? 6.5}
                  onChange={(e) => handleChange('soil_ph', parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>3.0 (Acidic)</span>
                  <span className="text-emerald-400 font-semibold">6.0 - 7.0 (Optimal)</span>
                  <span>10.0 (Alkaline)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Nutrients & Growth Stage */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-800/60 pb-3">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
                <Calendar className="w-5 h-5 text-emerald-400" /> Crop Stage & Field Scale
              </h3>
              <p className="text-xs text-slate-400">Specify current phenological development and N-P-K reserves.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Current Growth Stage <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.crop_stage}
                  onChange={(e) => handleChange('crop_stage', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {CROP_STAGES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* N-P-K Levels */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Soil Macro-Nutrient Reserves (N-P-K)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['nitrogen_level', 'phosphorus_level', 'potassium_level'].map((nutrient) => {
                    const label = nutrient === 'nitrogen_level' ? 'Nitrogen (N)' : nutrient === 'phosphorus_level' ? 'Phosphorus (P)' : 'Potassium (K)';
                    return (
                      <div key={nutrient} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-300 block">{label}</span>
                        <select
                          value={formData[nutrient]}
                          onChange={(e) => handleChange(nutrient, e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-emerald-400 font-semibold focus:outline-none focus:border-emerald-500 text-center"
                        >
                          {NUTRIENT_LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Area & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Field Area (Acres) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.field_area_acres}
                    onChange={(e) => handleChange('field_area_acres', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  {errors.field_area_acres && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.field_area_acres}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Budget Tier
                  </label>
                  <select
                    value={formData.budget_level}
                    onChange={(e) => handleChange('budget_level', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {BUDGET_LEVELS.map((b) => (
                      <option key={b} value={b}>{b} Budget</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & AI Synthesis */}
        {step === 4 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-800/60 pb-3">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-['Outfit']">
                <Sparkles className="w-5 h-5 text-emerald-400" /> Review Field Metrics & Generate Plan
              </h3>
              <p className="text-xs text-slate-400">Confirm parameters prior to querying Google Gemini 2.5.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">Target Crop</span>
                <p className="font-bold text-slate-200 truncate">{formData.target_crop}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">Location</span>
                <p className="font-bold text-slate-200 truncate">{formData.location_region}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">Soil Texture & pH</span>
                <p className="font-bold text-emerald-400">{formData.soil_type} / {formData.soil_ph} pH</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400">Area & Stage</span>
                <p className="font-bold text-slate-200">{formData.field_area_acres} ac / {formData.crop_stage}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-4 h-4" /> Ready for Agronomic Synthesis:
              </p>
              <p className="text-slate-300">
                Gemini 2.5 Flash will calculate nutrient depletion curves, generate a timed fertilizer protocol, compute irrigation frequency, and forecast harvest yield confidence.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Synthesizing with Gemini 2.5...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Generate Full Crop Advisory</span>
                </>
              )}
            </button>
          )}
        </div>

      </form>

    </div>
  );
};

export default AdvisoryForm;
