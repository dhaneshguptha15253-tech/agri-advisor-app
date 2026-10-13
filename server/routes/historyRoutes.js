import express from 'express';
import {
  getAdvisoryReports,
  getDiseaseInspections,
  getUserFields,
  createField,
  getUserProfile,
  updateUserProfile,
} from '../services/databaseService.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all history routes with Supabase JWT middleware
router.use(requireAuth);

/**
 * GET /api/v1/history/reports
 * Fetches user advisory reports
 */
router.get('/reports', async (req, res, next) => {
  try {
    const reports = await getAdvisoryReports(req.user.id);
    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/history/inspections
 * Fetches user disease inspection logs
 */
router.get('/inspections', async (req, res, next) => {
  try {
    const inspections = await getDiseaseInspections(req.user.id);
    return res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/history/fields
 * Get all registered fields for the user
 */
router.get('/fields', async (req, res, next) => {
  try {
    const fields = await getUserFields(req.user.id);
    return res.status(200).json({
      success: true,
      data: fields,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/history/fields
 * Register a new field for the user
 */
router.post('/fields', async (req, res, next) => {
  try {
    const { field_name, location_region, area_size, soil_type, soil_ph } = req.body;
    if (!field_name || !location_region || !area_size || !soil_type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field parameters (field_name, location_region, area_size, soil_type).',
      });
    }

    const field = await createField(req.user.id, {
      field_name,
      location_region,
      area_size,
      soil_type,
      soil_ph,
    });

    return res.status(201).json({
      success: true,
      data: field,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/history/profile
 * Get user farmer profile
 */
router.get('/profile', async (req, res, next) => {
  try {
    const profile = await getUserProfile(req.user.id);
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/history/profile
 * Update user farmer profile
 */
router.put('/profile', async (req, res, next) => {
  try {
    const updated = await updateUserProfile(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
