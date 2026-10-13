import { z } from 'zod';

export const advisoryInputSchema = z.object({
  farm_name: z.string().optional().default('Main Farm Plot'),
  target_crop: z.string().min(2, 'Crop name is required (at least 2 characters)'),
  location_region: z.string().min(2, 'Location/Region is required (at least 2 characters)'),
  crop_stage: z.enum([
    'Seedling/Germination',
    'Early Vegetative',
    'Late Vegetative',
    'Flowering/Tillering',
    'Fruit/Grain Development',
    'Maturation/Harvest',
  ], {
    errorMap: () => ({ message: 'Please select a valid crop growth stage' }),
  }),
  soil_type: z.enum([
    'Clay',
    'Sandy',
    'Loamy',
    'Silt',
    'Peaty',
    'Chalky',
    'Saline',
  ], {
    errorMap: () => ({ message: 'Please select a valid soil type' }),
  }),
  soil_ph: z.number().min(3.0, 'Soil pH must be >= 3.0').max(10.0, 'Soil pH must be <= 10.0').optional().nullable(),
  nitrogen_level: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  phosphorus_level: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  potassium_level: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  field_area_acres: z.number().positive('Field area must be greater than 0 acres'),
  budget_level: z.enum(['Low', 'Moderate', 'High']).optional().default('Moderate'),
});

export const inspectorInputSchema = z.object({
  image_base64: z.string().min(10, 'Base64 image string is required'),
  mime_type: z.string().regex(/^image\/(jpeg|png|webp|jpg)$/i, 'Invalid image format. Supported formats: JPEG, PNG, WEBP'),
  crop_context: z.string().optional().default('General Crop/Plant'),
});

export const marketInputSchema = z.object({
  crop_name: z.string().min(2, 'Crop name is required'),
  location_region: z.string().min(2, 'Location/Region is required'),
  crop_stage: z.string().optional().default('Late Vegetative'),
  estimated_harvest_weeks: z.number().min(1).max(52).optional().default(4),
});
