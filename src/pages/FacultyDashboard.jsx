import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Calendar, CheckCircle2, Clock, ArrowRight, FileCheck, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { getFacultySubmissionStatus } from '../data/mockFacultySubmissions';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [years, setYears] = useState([]);
  const [customAcademicYear, setCustomAcademicYear] = useState('2025-26');
  const facultyStatus = getFacultySubmissionStatus(user);

  return (
    <div className="space-y-5 animate-fade-in font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-blue rounded-xl p-5 shadow-2xs text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-brand-gold font-bold text-[10px] uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Faculty Template Submission Portal</span>
          </div>
          <h2 className="text-xl font-bold">Welcome, {user?.full_name || user?.name || 'Faculty Member'}</h2>
          <p className="text-blue-100 text-xs mt-0.5">
            Faculty ID: <span className="font-mono text-white bg-white/20 px-2 py-0.5 rounded">{user?.username || 'FACULTY'}</span> | Institution: <span className="font-bold text-white">{user?.department_name || user?.group || 'Computer Science'}</span>
          </p>
        </div>

        {/* Typed Academic Year Input */}
        <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-brand-gold" />
          <span className="text-xs font-bold text-white">Academic Year:</span>
          <input
            type="text"
            value={customAcademicYear}
            onChange={(e) => setCustomAcademicYear(e.target.value)}
            placeholder="e.g. 2025-26"
            className="w-24 bg-brand-navy text-white text-xs font-bold py-1 px-2.5 rounded-lg border border-white/30 focus:outline-none focus:ring-1 focus:ring-brand-gold font-mono text-center"
          />
        </div>
      </div>

      {/* 48-HOUR EDIT WINDOW STATUS CARD */}
      <div className={`p-4 rounded-xl border text-xs font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs ${
        facultyStatus.isLocked
          ? 'bg-red-50 text-red-900 border-red-200'
          : facultyStatus.isSubmitted
          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
          : 'bg-blue-50 text-brand-navy border-blue-200'
      }`}>
        <div className="flex items-center space-x-3">
          {facultyStatus.isLocked ? (
            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm">
                {facultyStatus.isLocked
                  ? '🔒 Edit Window Expired (Locked)'
                  : facultyStatus.isSubmitted
                  ? '✓ Data Submission Active'
                  : '📝 Data Submission Open'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                facultyStatus.isLocked ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {facultyStatus.isLocked ? 'Disabled' : 'Editable'}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">
              {facultyStatus.isLocked
                ? 'Your 48-hour edit window has expired. Submissions are now locked for institutional reporting.'
                : 'Select any category from the sidebar or click Start Data Submission to submit details for Academic Year ' + customAcademicYear + '.'}
            </p>
          </div>
        </div>

        <button
          disabled={facultyStatus.isLocked}
          onClick={() => navigate('/faculty/templates/1')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer ${
            facultyStatus.isLocked
              ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
              : 'bg-brand-navy hover:bg-brand-blue text-white'
          }`}
        >
          <FileCheck className="w-4 h-4 text-brand-gold" />
          <span>{facultyStatus.isLocked ? 'Submission Locked' : 'Start Data Submission'}</span>
          {!facultyStatus.isLocked && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default FacultyDashboard;
