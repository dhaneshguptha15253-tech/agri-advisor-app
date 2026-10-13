const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Universal fetch wrapper with automatic JWT headers and error formatting
 */
const request = async (endpoint, options = {}, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const authToken = token || localStorage.getItem('agri_auth_token') || 'demo-token';
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = data?.details;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
};

export const api = {
  // Crop Advisory
  generateAdvisory: (advisoryData, token) =>
    request('/advisory/generate', {
      method: 'POST',
      body: JSON.stringify(advisoryData),
    }, token),

  getAdvisoryReport: (reportId, token) =>
    request(`/advisory/${reportId}`, { method: 'GET' }, token),

  // Multimodal Visual Disease Inspector
  analyzeCropImage: (image_base64, mime_type, crop_context = 'General Plant', token) =>
    request('/inspector/analyze', {
      method: 'POST',
      body: JSON.stringify({ image_base64, mime_type, crop_context }),
    }, token),

  // Regional Market Trends & Harvest Strategy
  predictMarket: (marketData, token) =>
    request('/market/predict', {
      method: 'POST',
      body: JSON.stringify(marketData),
    }, token),

  // History & Records
  getReportHistory: (token) =>
    request('/history/reports', { method: 'GET' }, token),

  getInspectionHistory: (token) =>
    request('/history/inspections', { method: 'GET' }, token),

  getFields: (token) =>
    request('/history/fields', { method: 'GET' }, token),

  createField: (fieldData, token) =>
    request('/history/fields', {
      method: 'POST',
      body: JSON.stringify(fieldData),
    }, token),

  getProfile: (token) =>
    request('/history/profile', { method: 'GET' }, token),

  updateProfile: (profileData, token) =>
    request('/history/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }, token),
};

export default api;
