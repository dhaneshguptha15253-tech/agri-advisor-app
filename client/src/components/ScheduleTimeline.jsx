import React, { useState } from 'react';
import { 
  Calendar, 
  Droplet, 
  FlaskConical, 
  CheckCircle2, 
  Circle, 
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';

export const ScheduleTimeline = ({ fertilizerSchedule = [], irrigationPlan = null }) => {
  const [completedTasks, setCompletedTasks] = useState({});

  const toggleTask = (index) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Irrigation Highlight Banner */}
      {irrigationPlan && (
        <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-100">Irrigation Protocol</h4>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                  {irrigationPlan.frequency}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Target Volume: <span className="text-sky-400 font-semibold">{irrigationPlan.water_volume_liters_per_acre?.toLocaleString()} L/acre</span> per application cycle.
              </p>
            </div>
          </div>

          {irrigationPlan.critical_warning && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span className="font-medium">{irrigationPlan.critical_warning}</span>
            </div>
          )}
        </div>
      )}

      {/* Step-by-Step Fertilizer Application Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-emerald-400" /> Actionable Fertilizer Schedule
          </h4>
          <span className="text-xs text-slate-400">
            {Object.values(completedTasks).filter(Boolean).length} of {fertilizerSchedule.length} tasks completed
          </span>
        </div>

        <div className="relative pl-6 border-l-2 border-emerald-500/30 space-y-6">
          {fertilizerSchedule.map((item, idx) => {
            const isDone = Boolean(completedTasks[idx]);
            return (
              <div key={idx} className="relative group">
                
                {/* Timeline node marker */}
                <button
                  onClick={() => toggleTask(idx)}
                  className={`absolute -left-[33px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-900 border-2 border-emerald-500/50 text-slate-400 hover:border-emerald-400 hover:scale-105'
                  }`}
                  title={isDone ? 'Mark as pending' : 'Mark as done'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
                  )}
                </button>

                {/* Timeline Card */}
                <div
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    isDone
                      ? 'bg-slate-900/40 border border-slate-800/80 opacity-75'
                      : 'glass-card border border-emerald-500/20'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> Day +{item.day_offset}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{item.stage}</span>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                      Dosage: {item.dosage}
                    </span>
                  </div>

                  <h5 className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    {item.fertilizer_name}
                  </h5>

                  <p className="text-xs text-slate-300 mt-1">
                    <strong className="text-slate-400 font-medium">Application Method:</strong> {item.application_method}
                  </p>

                  {item.notes && (
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{item.notes}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ScheduleTimeline;
