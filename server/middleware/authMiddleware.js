import { supabaseAdmin, isSupabaseConfigured } from '../config/supabaseAdmin.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or malformed Authorization header. Expected format: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Bearer token is empty.',
      });
    }

    // In local development/demo mode when Supabase isn't connected or for demo sessions
    if (token === 'demo-token' || token.startsWith('demo-') || !isSupabaseConfigured()) {
      req.user = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'farmer.demo@agriadvisor.ai',
        user_metadata: {
          full_name: 'Demo Agronomist',
          region: 'Midwest Agricultural District',
          default_units: 'acres',
        },
      };
      return next();
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or expired authentication token.',
        details: error?.message,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal authentication verification error.',
    });
  }
};
