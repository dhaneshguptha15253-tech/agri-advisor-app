import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  User, 
  MapPin, 
  Phone, 
  Layers, 
  Plus, 
  ShieldCheck, 
  Save, 
  Check, 
  AlertCircle,
  Sprout,
  Scale
} from 'lucide-react';

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Silt', 'Peaty', 'Chalky', 'Saline'];

export const ProfilePage = () => {
  const { user, getToken } = useAuth();
  
  const [profile, setProfile] = useState({
    full_name: user?.user_metadata?.full_name || 'David Greenfield',
    phone_number: user?.user_metadata?.phone_number || '+1 (555) 349-2819',
    region: user?.user_metadata?.region || 'Midwest Agricultural District',
    default_units: user?.user_metadata?.default_units || 'acres',
  });

  const [fields, setFields] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // New Field Modal / Form State
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({
    field_name: '',
    location_region: user?.user_metadata?.region || 'Midwest Agricultural District',
    area_size: '',
    soil_type: 'Loamy',
    soil_ph: 6.5,
  });
  const [creatingField, setCreatingField] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getToken();
        const [profRes, fieldRes] = await Promise.all([
          api.getProfile(token).catch(() => ({ data: profile })),
          api.getFields(token).catch(() => ({ data: [] })),
        ]);

        if (profRes.data) {
          setProfile((prev) => ({ ...prev, ...profRes.data }));
        }
        if (fieldRes.data) {
          setFields(fieldRes.data);
        }
      } catch (err) {
        console.error('[Profile Load Error]:', err);
      }
    };

    loadData();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);

    try {
      const token = getToken();
      await api.updateProfile(profile, token);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err) {
      console.error('[Update Profile Error]:', err);
      alert('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateField = async (e) => {
    e.preventDefault();
    if (!newField.field_name || !newField.area_size) return;

    setCreatingField(true);
    try {
      const token = getToken();
      const res = await api.createField(
        {
          ...newField,
          area_size: parseFloat(newField.area_size),
          soil_ph: parseFloat(newField.soil_ph),
        },
        token
      );

      if (res?.data) {
        setFields((prev) => [res.data, ...prev]);
        setShowAddField(false);
        setNewField({
          field_name: '',
          location_region: profile.region,
          area_size: '',
          soil_type: 'Loamy',
          soil_ph: 6.5,
        });
      }
    } catch (err) {
      console.error('[Create Field Error]:', err);
      alert('Failed to create field plot.');
    } finally {
      setCreatingField(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-['Outfit']">
          Farmer Profile & Field Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your farming identity, registered geographical plots, and default agronomic units.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Settings (1 Column) */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5 h-fit">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
              {profile.full_name ? profile.full_name[0].toUpperCase() : 'F'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">{profile.full_name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Producer
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={profile.phone_number}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Farming Region</label>
              <input
                type="text"
                value={profile.region}
                onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Measurement Unit</label>
              <select
                value={profile.default_units}
                onChange={(e) => setProfile({ ...profile, default_units: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="acres">Acres (ac)</option>
                <option value="hectares">Hectares (ha)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5"
            >
              {profileSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Registered Farm Fields (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-['Outfit'] flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" /> Registered Farm Fields
              </h3>
              <p className="text-xs text-slate-400">Total {fields.length} parcels under active management.</p>
            </div>

            <button
              onClick={() => setShowAddField(!showAddField)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Field Plot</span>
            </button>
          </div>

          {/* Add Field Inline Form */}
          {showAddField && (
            <div className="glass-card p-5 rounded-2xl border border-emerald-500/40 space-y-4 animate-fadeIn">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Register New Farm Field
              </h4>
              <form onSubmit={handleCreateField} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Field Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., South Orchard Block B"
                    value={newField.field_name}
                    onChange={(e) => setNewField({ ...newField, field_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Location Region *</label>
                  <input
                    type="text"
                    required
                    value={newField.location_region}
                    onChange={(e) => setNewField({ ...newField, location_region: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Area Size ({profile.default_units}) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g., 25"
                    value={newField.area_size}
                    onChange={(e) => setNewField({ ...newField, area_size: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Soil Type *</label>
                  <select
                    value={newField.soil_type}
                    onChange={(e) => setNewField({ ...newField, soil_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  >
                    {SOIL_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddField(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingField}
                    className="px-4 py-1.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  >
                    {creatingField ? 'Creating...' : 'Save Field'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Fields List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div
                key={f.id}
                className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{f.field_name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {f.location_region}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {f.area_size} {profile.default_units}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Soil Texture</span>
                    <p className="font-semibold text-slate-200">{f.soil_type}</p>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Soil pH</span>
                    <p className="font-semibold text-emerald-400">{f.soil_ph || 6.5} pH</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
