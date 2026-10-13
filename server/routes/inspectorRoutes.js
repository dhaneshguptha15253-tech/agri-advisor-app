import express from 'express';
import { inspectorInputSchema } from '../validators/advisoryValidator.js';
import { analyzeCropImage } from '../services/geminiService.js';
import { saveDiseaseInspection } from '../services/databaseService.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/v1/inspector/analyze
 * Analyzes crop leaf photo with Gemini 2.5 Multimodal Vision
 */
router.post('/analyze', requireAuth, async (req, res, next) => {
  try {
    // 1. Validate payload with Zod
    const validatedData = inspectorInputSchema.parse(req.body);

    // 2. Call Gemini 2.5 Multimodal Engine
    const diagnosisResult = await analyzeCropImage(
      validatedData.image_base64,
      validatedData.mime_type,
      validatedData.crop_context
    );

    // 3. Form image preview / storage reference
    const imageUrl = validatedData.image_base64.startsWith('http')
      ? validatedData.image_base64
      : `data:${validatedData.mime_type};base64,${validatedData.image_base64.substring(0, 100)}...[preview]`;

    // 4. Save inspection to DB
    const savedInspection = await saveDiseaseInspection(
      req.user.id,
      diagnosisResult,
      imageUrl
    );

    return res.status(200).json({
      success: true,
      message: 'Visual inspection diagnosis completed.',
      data: {
        ...savedInspection,
        ...diagnosisResult,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
