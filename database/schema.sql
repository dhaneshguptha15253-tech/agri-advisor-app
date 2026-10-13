-- =========================================================================
-- AgriAdvisor AI - Production Database Schema for Supabase PostgreSQL
-- =========================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FARMER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    region TEXT NOT NULL,
    default_units TEXT DEFAULT 'acres' CHECK (default_units IN ('acres', 'hectares')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. FARM FIELDS TABLE
CREATE TABLE IF NOT EXISTS public.fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    location_region TEXT NOT NULL,
    area_size NUMERIC(10, 2) NOT NULL,
    soil_type TEXT NOT NULL,
    soil_ph NUMERIC(3, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CROP ADVISORY REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.advisory_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    crop_stage TEXT NOT NULL,
    health_score INT CHECK (health_score BETWEEN 0 AND 100),
    fertilizer_schedule JSONB NOT NULL,
    irrigation_plan JSONB NOT NULL,
    disease_risks JSONB NOT NULL,
    yield_projection JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. VISUAL INSPECTOR LOGS TABLE
CREATE TABLE IF NOT EXISTS public.disease_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    detected_disease TEXT NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    severity_level TEXT NOT NULL CHECK (severity_level IN ('Low', 'Moderate', 'Severe', 'Critical')),
    symptoms JSONB NOT NULL,
    treatment_plan JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON public.fields(user_id);
CREATE INDEX IF NOT EXISTS idx_advisory_user_id ON public.advisory_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_inspections_user_id ON public.disease_inspections(user_id);
CREATE INDEX IF NOT EXISTS idx_advisory_created_at ON public.advisory_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_created_at ON public.disease_inspections(created_at DESC);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) / DATA ISOLATION POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_inspections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert/update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can access own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can access own advisory reports" ON public.advisory_reports;
DROP POLICY IF EXISTS "Users can access own disease inspections" ON public.disease_inspections;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert/update own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- FIELDS POLICIES
CREATE POLICY "Users can access own fields" ON public.fields
    FOR ALL USING (auth.uid() = user_id);

-- ADVISORY REPORTS POLICIES
CREATE POLICY "Users can access own advisory reports" ON public.advisory_reports
    FOR ALL USING (auth.uid() = user_id);

-- DISEASE INSPECTIONS POLICIES
CREATE POLICY "Users can access own disease inspections" ON public.disease_inspections
    FOR ALL USING (auth.uid() = user_id);

-- Trigger to automatically create a profile row when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone_number, region, default_units)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Farmer ' || SUBSTRING(new.id::text, 1, 6)),
        new.raw_user_meta_data->>'phone_number',
        COALESCE(new.raw_user_meta_data->>'region', 'Midwest Agricultural District'),
        COALESCE(new.raw_user_meta_data->>'default_units', 'acres')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
