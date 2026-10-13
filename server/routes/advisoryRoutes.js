import express from 'express';
import { advisoryInputSchema } from '../validators/advisoryValidator.js';
import { generateCropAdvisory } from '../services/geminiService.js';
import { saveAdvisoryReport, getAdvisoryReportById } from '../services/databaseService.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/v1/advisory/generate
 * Generates an agronomic crop advisory using Gemini 2.5 and stores the report
 */
router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    // 1. Validate payload with Zod
    const validatedData = advisoryInputSchema.parse(req.body);

    // 2. Call Gemini 2.5 AI Engine
    const advisoryResult = await generateCropAdvisory(validatedData);

    // 3. Save report to Supabase DB
    const savedRecord = await saveAdvisoryReport(
      req.user.id,
      {
        ...advisoryResult,
        target_crop: validatedData.target_crop,
        crop_stage: validatedData.crop_stage,
      },
      req.body.field_id || null
    );

    return res.status(201).json({
      success: true,
      message: 'Advisory report generated successfully.',
      reportId: savedRecord.id,
      data: {
        ...savedRecord,
        ...advisoryResult,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/advisory/:id
 * Retrieve a single advisory report by ID
 */
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const reportId = req.params.id;
    const report = await getAdvisoryReportById(req.user.id, reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: `Advisory report ${reportId} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
