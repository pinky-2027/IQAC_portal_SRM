import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Calendar, CheckCircle2, Clock, ArrowRight, FileCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('4'); // Default 2024-25
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFacultyProgress();
  }, [selectedYear]);

  const loadFacultyProgress = async () => {
    setLoading(true);
    try {
      const [yearsData, progressData] = await Promise.all([
        apiService.getAcademicYears(),
        apiService.getFacultyProgress(Number(selectedYear))
      ]);
      setYears(yearsData);
      setProgress(progressData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completedStepsCount = progress?.steps?.filter(s => s.is_completed).length || 0;
  const totalStepsCount = progress?.steps?.length || 7;
  const overallPercentage = Math.round((completedStepsCount / totalStepsCount) * 100);

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-blue rounded-xl p-5 shadow-2xs text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-brand-gold font-bold text-[10px] uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Faculty Template Submission Portal</span>
          </div>
          <h2 className="text-xl font-bold">Welcome, {user?.full_name || 'Faculty Member'}</h2>
          <p className="text-blue-100 text-xs mt-0.5">
            Faculty ID: <span className="font-mono text-white bg-white/20 px-2 py-0.5 rounded">{user?.username}</span> | Institution: <span className="font-bold text-white">{user?.department_name || 'FLABS'}</span>
          </p>
        </div>

        {/* Academic Year Selector */}
        <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-brand-gold" />
          <span className="text-xs font-bold text-white">Academic Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-brand-navy text-white text-xs font-bold py-1 px-2.5 rounded-lg border border-white/30 focus:outline-none cursor-pointer"
          >
            {years.map((y) => (
              <option key={y.id} value={y.id}>{y.year_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* OVERALL SUBMISSION PROGRESS CARD */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-brand-navy">Overall IQAC Submission Progress</span>
            <span className="text-xs font-bold text-brand-blue">{completedStepsCount} of {totalStepsCount} Steps Completed ({overallPercentage}%)</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${overallPercentage}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={() => navigate('/faculty/templates/1')}
          className="px-5 py-2.5 bg-brand-navy hover:bg-brand-blue text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer flex-shrink-0"
        >
          <FileCheck className="w-4 h-4 text-brand-gold" />
          <span>{completedStepsCount === 0 ? 'Start Data Submission' : 'Continue Workflow'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* SEVEN TEMPLATE STEPS GRID */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center">
          <FileCheck className="w-4 h-4 mr-1.5 text-brand-blue" />
          Seven IQAC Data Templates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {progress?.steps?.map((step) => (
            <div 
              key={step.step_number}
              className={`bg-white rounded-xl p-4 border transition-all duration-150 flex flex-col justify-between ${
                step.is_completed 
                  ? 'border-emerald-200 shadow-2xs hover:border-emerald-400' 
                  : 'border-gray-200/80 hover:border-brand-blue/40 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-brand-navy text-white text-[9px] font-bold rounded uppercase tracking-wider">
                    Step {step.step_number}
                  </span>

                  {step.is_completed ? (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Completed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Pending
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-brand-navy mb-1">{step.template_name}</h4>
                <p className="text-[11px] text-brand-muted line-clamp-2">Excel Sheet: <span className="font-semibold text-brand-text">{step.sheet_name}</span></p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-brand-muted">
                  {step.updated_at ? `Saved ${new Date(step.updated_at).toLocaleDateString()}` : 'Not saved yet'}
                </span>
                <button
                  onClick={() => navigate(`/faculty/templates/${step.step_number}`)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    step.is_completed 
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-brand-navy hover:bg-brand-blue text-white shadow-xs'
                  }`}
                >
                  {step.is_completed ? 'Edit Step' : 'Fill Data'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
