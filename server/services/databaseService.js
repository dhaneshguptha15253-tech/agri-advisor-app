import { supabaseAdmin, isSupabaseConfigured } from '../config/supabaseAdmin.js';
import crypto from 'crypto';

// In-memory fallback repository for local demo development when Supabase credentials are not connected
const fallbackStorage = {
  fields: [
    {
      id: 'f-101',
      user_id: '00000000-0000-0000-0000-000000000001',
      field_name: 'North Valley Cornfield',
      location_region: 'Des Moines, Iowa',
      area_size: 45.0,
      soil_type: 'Loamy',
      soil_ph: 6.8,
      created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
    {
      id: 'f-102',
      user_id: '00000000-0000-0000-0000-000000000001',
      field_name: 'Sunrise Soybean Plot',
      location_region: 'Champaign, Illinois',
      area_size: 28.5,
      soil_type: 'Clay',
      soil_ph: 6.4,
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    }
  ],
  advisories: [
    {
      id: 'adv-001',
      user_id: '00000000-0000-0000-0000-000000000001',
      field_id: 'f-101',
      crop_name: 'Sweet Corn (Golden Bantam)',
      crop_stage: 'Early Vegetative',
      health_score: 88,
      fertilizer_schedule: [
        {
          day_offset: 1,
          stage: 'Early Vegetative',
          fertilizer_name: 'High-Nitrogen Organic Compost / Urea',
          dosage: '25 kg/acre',
          application_method: 'Side-dressing 5cm along furrow lines',
          notes: 'Apply after first scheduled morning irrigation.'
        },
        {
          day_offset: 14,
          stage: 'Early Vegetative',
          fertilizer_name: 'Zinc Sulfate & Soluble Potash',
          dosage: '10 kg/acre',
          application_method: 'Foliar spray during overcast conditions',
          notes: 'Improves leaf chlorophyll index and stalk thickness.'
        }
      ],
      irrigation_plan: {
        frequency: 'Every 3 days',
        water_volume_liters_per_acre: 4800,
        critical_warning: 'Avoid prolonged standing water; corn roots demand well-aerated loamy soil.'
      },
      disease_risks: [
        {
          disease_name: 'Common Rust (Puccinia sorghi)',
          risk_level: 'Moderate',
          preventative_measure: 'Inspect lower leaf collars weekly. Spray Trichoderma bio-agent.'
        }
      ],
      yield_projection: {
        estimated_yield_min_kg: 52000,
        estimated_yield_max_kg: 59000,
        confidence_rating: 'High'
      },
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],
  inspections: [
    {
      id: 'insp-001',
      user_id: '00000000-0000-0000-0000-000000000001',
      image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
      detected_disease: 'Tomato Early Blight (Alternaria solani)',
      confidence_score: 94.2,
      severity_level: 'Moderate',
      symptoms: [
        'Concentric dark ring spots on lower leaves',
        'Yellow chlorotic halos surrounding lesions'
      ],
      treatment_plan: {
        organic_remedy: 'Apply copper hydroxide bactericide or Bacillus subtilis bio-fungicide.',
        chemical_remedy: 'Apply Mancozeb 75% WP at 2g per liter of water.',
        cultural_control: 'Remove infected bottom leaves and avoid sprinkler splash on leaves.'
      },
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],
  profiles: {
    '00000000-0000-0000-0000-000000000001': {
      id: '00000000-0000-0000-0000-000000000001',
      full_name: 'David Agronomist',
      phone_number: '+1 (555) 349-2819',
      region: 'Midwest Agricultural District',
      default_units: 'acres',
      created_at: new Date().toISOString()
    }
  }
};

/**
 * Save Crop Advisory Report
 */
export const saveAdvisoryReport = async (userId, advisoryData, fieldId = null) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from('advisory_reports')
        .insert({
          user_id: userId,
          field_id: fieldId,
          crop_name: advisoryData.target_crop || advisoryData.crop_name,
          crop_stage: advisoryData.crop_stage,
          health_score: advisoryData.health_score || 85,
          fertilizer_schedule: advisoryData.fertilizer_schedule,
          irrigation_plan: advisoryData.irrigation_plan,
          disease_risks: advisoryData.disease_risks,
          yield_projection: advisoryData.yield_projection,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[DatabaseService] Supabase insert failed, saving to fallback cache:', err.message);
    }
  }

  const record = {
    id: `adv-${crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now()}`,
    user_id: userId,
    field_id: fieldId,
    crop_name: advisoryData.target_crop || advisoryData.crop_name,
    crop_stage: advisoryData.crop_stage,
    health_score: advisoryData.health_score || 85,
    fertilizer_schedule: advisoryData.fertilizer_schedule,
    irrigation_plan: advisoryData.irrigation_plan,
    disease_risks: advisoryData.disease_risks,
    yield_projection: advisoryData.yield_projection,
    created_at: new Date().toISOString(),
  };
  fallbackStorage.advisories.unshift(record);
  return record;
};

/**
 * Save Disease Inspection Log
 */
export const saveDiseaseInspection = async (userId, inspectionData, imageUrl) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from('disease_inspections')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          detected_disease: inspectionData.detected_disease,
          confidence_score: inspectionData.confidence_score,
          severity_level: inspectionData.severity_level,
          symptoms: inspectionData.symptoms,
          treatment_plan: inspectionData.treatment_plan,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('[DatabaseService] Supabase insert inspection failed:', err.message);
    }
  }

  const record = {
    id: `insp-${crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now()}`,
    user_id: userId,
    image_url: imageUrl,
    detected_disease: inspectionData.detected_disease,
    confidence_score: inspectionData.confidence_score,
    severity_level: inspectionData.severity_level,
    symptoms: inspectionData.symptoms,
    treatment_plan: inspectionData.treatment_plan,
    created_at: new Date().toISOString(),
  };
  fallbackStorage.inspections.unshift(record);
  return record;
};

/**
 * Get User Advisory Reports History
 */
export const getAdvisoryReports = async (userId) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from('advisory_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.error('[DatabaseService] Error fetching reports:', err.message);
    }
  }
  return fallbackStorage.advisories;
};

/**
 * Get Specific Advisory Report By ID
 */
export const getAdvisoryReportById = async (userId, reportId) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from('advisory_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.error('[DatabaseService] Error fetching report by ID:', err.message);
    }
  }
  return fallbackStorage.advisories.find((r) => r.id === reportId) || fallbackStorage.advisories[0];
};

/**
 * Get User Disease Inspections History
 */
export const getDiseaseInspections = async (userId) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from('disease_inspections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.error('[DatabaseService] Error fetching inspections:', err.message);
    }
  }
  return fallbackStorage.inspections;
};

/**
 * Get User Fields
 */
export const getUserFields = async (userId) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from('fields')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.error('[DatabaseService] Error fetching fields:', err.message);
    }
  }
  return fallbackStorage.fields;
};

/**
 * Create Farm Field
 */
export const createField = async (userId, fieldData) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from('fields')
        .insert({
          user_id: userId,
          field_name: fieldData.field_name,
          location_region: fieldData.location_region,
          area_size: fieldData.area_size,
          soil_type: fieldData.soil_type,
          soil_ph: fieldData.soil_ph,
        })
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.error('[DatabaseService] Error creating field:', err.message);
    }
  }

  const newField = {
    id: `f-${Date.now()}`,
    user_id: userId,
    field_name: fieldData.field_name,
    location_region: fieldData.location_region,
    area_size: parseFloat(fieldData.area_size) || 10,
    soil_type: fieldData.soil_type,
    soil_ph: parseFloat(fieldData.soil_ph) || 6.5,
    created_at: new Date().toISOString(),
  };
  fallbackStorage.fields.unshift(newField);
  return newField;
};

/**
 * Get Profile
 */
export const getUserProfile = async (userId) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.error('[DatabaseService] Error fetching profile:', err.message);
    }
  }
  return fallbackStorage.profiles[userId] || {
    id: userId,
    full_name: 'Farmer Partner',
    phone_number: '+1 (555) 349-2819',
    region: 'Central Agricultural Belt',
    default_units: 'acres',
  };
};

/**
 * Update Profile
 */
export const updateUserProfile = async (userId, profileData) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone_number: profileData.phone_number,
          region: profileData.region,
          default_units: profileData.default_units,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.error('[DatabaseService] Error updating profile:', err.message);
    }
  }

  fallbackStorage.profiles[userId] = {
    ...fallbackStorage.profiles[userId],
    ...profileData,
    updated_at: new Date().toISOString(),
  };
  return fallbackStorage.profiles[userId];
};
