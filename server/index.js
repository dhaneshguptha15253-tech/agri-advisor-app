import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Route Imports
import advisoryRoutes from './routes/advisoryRoutes.js';
import inspectorRoutes from './routes/inspectorRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

// Middleware Imports
import { errorHandler } from './middleware/errorHandler.js';
import { isGeminiConfigured } from './config/gemini.js';
import { isSupabaseConfigured } from './config/supabaseAdmin.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS Configuration
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Payload size limits for base64 plant leaf images
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Global general API rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimiter);

// Specific Rate Limiter for AI Generation (Max 20 requests per hour per user/IP)
const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    error: 'AI Advisory quota exceeded: Maximum 20 AI advisory requests per hour. Please wait before generating more.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit per authenticated user if available, otherwise by IP
    return req.user?.id || req.ip || 'anonymous';
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'AgriAdvisor AI Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    integrations: {
      gemini_2_5: isGeminiConfigured() ? 'connected' : 'fallback_mode',
      supabase_postgresql: isSupabaseConfigured() ? 'connected' : 'fallback_mode',
    },
  });
});

// Mount Routes
app.use('/api/v1/advisory', aiRateLimiter, advisoryRoutes);
app.use('/api/v1/inspector', aiRateLimiter, inspectorRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/history', historyRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 AgriAdvisor AI Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔒 Allowed Client Origin: ${CLIENT_URL}`);
  console.log(`🌱 Gemini 2.5 Status: ${isGeminiConfigured() ? '✅ Live GenAI' : '⚠️ Fallback Mode (Set GEMINI_API_KEY)'}`);
  console.log(`🗄️ Supabase DB Status: ${isSupabaseConfigured() ? '✅ Connected' : '⚠️ Fallback Cache (Set SUPABASE keys)'}`);
  console.log(`======================================================\n`);
});
