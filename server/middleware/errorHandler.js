import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  console.error('[AgriAdvisor Global Error Handler]:', err);

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed on input data.',
      details: formattedErrors,
    });
  }

  // Handle Gemini API Errors
  if (err.status && err.status >= 400 && err.status < 600) {
    return res.status(err.status).json({
      success: false,
      error: err.message || 'AI Engine service error.',
    });
  }

  // Handle payload too large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Payload Too Large. Please compress the image under 10MB.',
    });
  }

  // Generic fallback error
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error. Please try again.',
  });
};
