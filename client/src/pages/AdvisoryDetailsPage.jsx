import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdvisoryReportView } from '../components/AdvisoryReportView';
import { AlertCircle, ArrowLeft, Sprout } from 'lucide-react';

export const AdvisoryDetailsPage = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await api.getAdvisoryReport(id, token);
        if (response?.data) {
          setReport(response.data);
        } else {
          throw new Error('Report data not found');
        }
      } catch (err) {
        console.error('[Fetch Report Details Error]:', err);
        setError(err.message || `Unable to load advisory report #${id}.`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading agronomic advisory telemetry...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-100 font-['Outfit']">Report Not Found</h3>
        <p className="text-xs text-slate-400">{error || 'This advisory report does not exist or has expired.'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AdvisoryReportView
        report={report}
        onBack={() => navigate('/dashboard')}
      />
    </div>
  );
};

export default AdvisoryDetailsPage;
