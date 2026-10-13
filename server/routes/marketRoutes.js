import express from 'express';
import { marketInputSchema } from '../validators/advisoryValidator.js';
import { predictMarketTrends } from '../services/geminiService.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/v1/market/predict
 * Generates market pricing analysis, wholesale forecast, and harvest timing optimization
 */
router.post('/predict', requireAuth, async (req, res, next) => {
  try {
    const validatedData = marketInputSchema.parse(req.body);

    const marketForecast = await predictMarketTrends(validatedData);

    return res.status(200).json({
      success: true,
      data: marketForecast,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
