import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, FileText, Check, Award, GraduationCap, Users, Microscope, FileX, BarChart2, ArrowRight, ChevronRight, Layers, Sparkles, Zap, BookOpen, TrendingUp, Table, Calendar, ArrowLeft, Eye } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { getLegacyKpiClientData, getInstitutionalOverviewData, formatVal, isPercentageIndicator, normalizePercentageValue } from '../services/dataService';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const detailsRef = useRef(null);

  const userRole = (user?.role || '').toUpperCase();
  const isChairman = userRole === 'CHAIRMAN';
  const isDeanOrCoordinator = ['COLLEGE_DEAN', 'ADMIN', 'IQAC_COORDINATOR', 'DEAN'].includes(userRole);
  const isOverviewRole = isChairman || isDeanOrCoordinator;

  const getUserAssignedInst = () => {
    if (isChairman) return null; // Chairman sees all
    const grp = (user?.group || user?.department_name || '').toUpperCase();
    if (grp.includes('E&T') || grp.includes('ET') || grp.includes('ENGIN')) return 'ET';
    if (grp.includes('MGMT') || grp.includes('MANAGEMENT') || grp.includes('MBA') || grp.includes('BBA')) return 'MANAGEMENT';
    if (grp.includes('ARCH') || grp.includes('SEAD')) return 'BARCH';
    return 'FLABS'; // Default for FLABS deans / coordinators
  };

  const assignedInst = getUserAssignedInst();

  const passedInst = assignedInst || location.state?.institution || 'ET';
  const passedDept = location.state?.department || (passedInst === 'FLABS' ? 'BCA' : passedInst === 'MANAGEMENT' ? 'MBA' : passedInst === 'BARCH' ? 'B.Arch' : 'CSE');

  // State Management
  const [selectedInstCode, setSelectedInstCode] = useState(passedInst);
  const [selectedDept, setSelectedDept] = useState(passedDept);
  const [selectedYear, setSelectedYear] = useState('2025-2026'); // Global Year Filter
  const [viewLevel, setViewLevel] = useState('overview'); // 'overview' (Level 2) | 'details' (Level 3) | 'dept_single'
  const [selectedParamRecord, setSelectedParamRecord] = useState(null); // Level 3 parameter
  
  const [kpiLegacyData, setKpiLegacyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTrendIndicator, setSelectedTrendIndicator] = useState('Student Pass Percentage');

  const availableYears = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];

  // Synchronize sidebar navigation click with right-hand dashboard view
  useEffect(() => {
    if (location.state?.institution) {
      setSelectedInstCode(location.state.institution);
      if (location.state.department) {
        setSelectedDept(location.state.department);
        setViewLevel('dept_single');
        setSelectedParamRecord(null);
      } else {
        // Institution header clicked in sidebar -> Always reset to Institutional Overview (Level 2)
        setViewLevel('overview');
        setSelectedParamRecord(null);
      }
    } else if (assignedInst) {
      setSelectedInstCode(assignedInst);
      if (location.state?.department) {
        setSelectedDept(location.state.department);
        setViewLevel('dept_single');
        setSelectedParamRecord(null);
      } else {
        setViewLevel('overview');
        setSelectedParamRecord(null);
      }
    }
  }, [assignedInst, location.state]);

  useEffect(() => {
    loadHistoricalKpiData();
  }, [selectedInstCode, selectedDept, selectedYear, isOverviewRole, viewLevel, location.state]);

  const loadHistoricalKpiData = async () => {
    setLoading(true);
    try {
      if (selectedInstCode === 'BARCH' || selectedInstCode === 'SEAD') {
        setKpiLegacyData({
          hasData: false,
          isPending: true,
          institution: 'B.Arch',
          department: 'B.Arch',
          message: 'Data is yet to be received for B.Arch Institution.'
        });
        setLoading(false);
        return;
      }

      // Single department view selected via sidebar
      if (viewLevel === 'dept_single' && selectedDept) {
        const deptData = getLegacyKpiClientData(selectedInstCode, selectedYear, selectedDept);
        setKpiLegacyData(deptData);
        if (deptData.records && deptData.records[0] && deptData.records[0].indicator) {
          setSelectedTrendIndicator(deptData.records[0].indicator);
        }
        setLoading(false);
        return;
      }

      if (isOverviewRole) {
        // Institutional Overview Mode (Level 2 & Level 3)
        const overview = getInstitutionalOverviewData(selectedInstCode, selectedYear);
        setKpiLegacyData(overview);
        if (overview.records && overview.records[0] && overview.records[0].indicator) {
          if (!selectedParamRecord) {
            setSelectedTrendIndicator(overview.records[0].indicator);
          }
        }
        setLoading(false);
        return;
      }

      // Other roles
      try {
        const res = await apiService.getLegacyKpiData(selectedInstCode, selectedYear, selectedDept);
        if (res && res.records && res.records.length > 0) {
          setKpiLegacyData(res);
          if (res.records[0] && res.records[0].indicator) {
            setSelectedTrendIndicator(res.records[0].indicator);
          }
        } else {
          const fallback = getLegacyKpiClientData(selectedInstCode, selectedYear, selectedDept);
          setKpiLegacyData(fallback);
          if (fallback.records && fallback.records[0] && fallback.records[0].indicator) {
            setSelectedTrendIndicator(fallback.records[0].indicator);
          }
        }
      } catch (err) {
        const fallback = getLegacyKpiClientData(selectedInstCode, selectedYear, selectedDept);
        setKpiLegacyData(fallback);
        if (fallback.records && fallback.records[0] && fallback.records[0].indicator) {
          setSelectedTrendIndicator(fallback.records[0].indicator);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Institution Selection Handler (Level 1 / Level 2 Switch)
  const handleSelectInstitution = (instCode) => {
    if (assignedInst && instCode !== assignedInst) return; // Restrict non-chairman
    setSelectedInstCode(instCode);
    setViewLevel('overview');
    setSelectedParamRecord(null);
    
    // Reset location state department to ensure overview loads cleanly
    navigate('/admin/dashboard', { state: { institution: instCode } });

    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Open Parameter Department-wise Details (Level 3)
  const handleOpenParameterDetails = (record) => {
    setSelectedParamRecord(record);
    setViewLevel('details');
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Return to Level 2 Overview
  const handleBackToOverview = () => {
    setViewLevel('overview');
    setSelectedParamRecord(null);
    navigate('/admin/dashboard', { state: { institution: selectedInstCode } });
  };

  const getTopBorderAccent = (idx) => {
    const mod = idx % 3;
    if (mod === 0) return 'border-t-4 border-t-amber-400';
    if (mod === 1) return 'border-t-4 border-t-teal-500';
    return 'border-t-4 border-t-blue-600';
  };

  const prepareOverviewLineChartData = () => {
    if (!kpiLegacyData || !kpiLegacyData.records) return [];
    const rec = kpiLegacyData.records.find(r => r.indicator === selectedTrendIndicator);
    if (!rec) return [];

    const isPct = isPercentageIndicator(rec.indicator);

    return availableYears.map(yr => {
      const val = rec.values ? rec.values[yr] : rec[yr];
      let numVal = 0;
      if (isPct) {
        const norm = normalizePercentageValue(val);
        numVal = norm !== null ? norm : 0;
      } else if (typeof val === 'number') {
        numVal = val;
      } else if (typeof val === 'string') {
        const parsed = parseFloat(val);
        numVal = isNaN(parsed) ? 0 : parsed;
      }
      return {
        year: yr,
        value: numVal
      };
    });
  };

  const prepareDeptComparisonBarChartData = (record) => {
    if (!record || !record.departmentMatrix) return [];
    const isPct = isPercentageIndicator(record.indicator);

    return record.departmentMatrix.map(item => {
      const rawVal = item.years[selectedYear];
      let numVal = 0;
      if (isPct) {
        const norm = normalizePercentageValue(rawVal);
        numVal = norm !== null ? norm : 0;
      } else if (typeof rawVal === 'number') {
        numVal = rawVal;
      } else if (typeof rawVal === 'string') {
        const parsed = parseFloat(rawVal);
        numVal = isNaN(parsed) ? 0 : parsed;
      }
      return {
        department: item.department,
        value: numVal
      };
    });
  };

  const getInstitutionDisplayName = (code) => {
    if (code === 'ET' || code === 'E&T') return 'E&T (Engineering & Technology)';
    if (code === 'MANAGEMENT') return 'Management (MBA & BBA)';
    if (code === 'BARCH' || code === 'SEAD') return 'B.Arch (Architecture)';
    return 'FLABS (Faculty of Science & Humanities)';
  };

  const isTrendPct = isPercentageIndicator(selectedTrendIndicator);
  const isParamPct = isPercentageIndicator(selectedParamRecord?.indicator);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* PAGE HEADER */}
      <div className="bg-gradient-to-r from-brand-navy via-blue-900 to-brand-blue rounded-2xl p-6 shadow-md text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-gold font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Internal Quality Assurance Cell (IQAC) &bull; Executive Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
            {viewLevel === 'dept_single' 
              ? `${selectedDept} Department Dashboard`
              : `${getInstitutionDisplayName(selectedInstCode)} Overview Dashboard`}
          </h1>
          <p className="text-blue-100 text-xs mt-1 max-w-2xl font-medium">
            {viewLevel === 'dept_single'
              ? `Department performance indicators, multi-year trends, and historical metrics for ${selectedDept}.`
              : `Aggregated multi-year institutional quality indicators and department-level analysis.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-brand-gold" />
            <span className="text-xs font-bold">Academic Year:</span>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-brand-navy/90 text-white font-bold text-xs rounded-lg px-2 py-1 outline-none border border-white/20 cursor-pointer"
            >
              {[...availableYears].reverse().map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* LEVEL 1: 4 INSTITUTION SELECTION CARDS (ALWAYS AVAILABLE FOR CHAIRMAN ONLY) */}
      {isChairman && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. E&T */}
          <div 
            onClick={() => handleSelectInstitution('ET')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs flex flex-col justify-between space-y-3 ${
              selectedInstCode === 'ET'
                ? 'bg-gradient-to-br from-brand-navy to-brand-blue text-white border-brand-blue ring-2 ring-brand-gold shadow-md'
                : 'bg-white text-gray-800 border-gray-200 hover:border-brand-blue hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${selectedInstCode === 'ET' ? 'bg-white/15 text-brand-gold' : 'bg-amber-50 text-amber-600'}`}>
                <Layers className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedInstCode === 'ET' ? 'bg-brand-gold text-brand-navy' : 'bg-gray-100 text-gray-600'}`}>
                17 Depts
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm font-serif">E&amp;T (Engineering)</h3>
              <p className={`text-[11px] mt-0.5 font-medium ${selectedInstCode === 'ET' ? 'text-blue-100' : 'text-gray-500'}`}>
                Faculty of Engineering &amp; Technology
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t border-current/10">
              <span>View Institution</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* 2. FLABS */}
          <div 
            onClick={() => handleSelectInstitution('FLABS')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs flex flex-col justify-between space-y-3 ${
              selectedInstCode === 'FLABS'
                ? 'bg-gradient-to-br from-brand-navy to-brand-blue text-white border-brand-blue ring-2 ring-brand-gold shadow-md'
                : 'bg-white text-gray-800 border-gray-200 hover:border-brand-blue hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${selectedInstCode === 'FLABS' ? 'bg-white/15 text-brand-gold' : 'bg-blue-50 text-brand-blue'}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedInstCode === 'FLABS' ? 'bg-brand-gold text-brand-navy' : 'bg-gray-100 text-gray-600'}`}>
                14 Depts
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm font-serif">FLABS (Science &amp; Hum.)</h3>
              <p className={`text-[11px] mt-0.5 font-medium ${selectedInstCode === 'FLABS' ? 'text-blue-100' : 'text-gray-500'}`}>
                Faculty of Science &amp; Humanities
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t border-current/10">
              <span>View Institution</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* 3. Management */}
          <div 
            onClick={() => handleSelectInstitution('MANAGEMENT')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs flex flex-col justify-between space-y-3 ${
              selectedInstCode === 'MANAGEMENT'
                ? 'bg-gradient-to-br from-brand-navy to-brand-blue text-white border-brand-blue ring-2 ring-brand-gold shadow-md'
                : 'bg-white text-gray-800 border-gray-200 hover:border-brand-blue hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${selectedInstCode === 'MANAGEMENT' ? 'bg-white/15 text-brand-gold' : 'bg-emerald-50 text-emerald-600'}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedInstCode === 'MANAGEMENT' ? 'bg-brand-gold text-brand-navy' : 'bg-gray-100 text-gray-600'}`}>
                2 Programs
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm font-serif">Management (FOM)</h3>
              <p className={`text-[11px] mt-0.5 font-medium ${selectedInstCode === 'MANAGEMENT' ? 'text-blue-100' : 'text-gray-500'}`}>
                MBA &amp; BBA Programs
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t border-current/10">
              <span>View Institution</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* 4. B.Arch */}
          <div 
            onClick={() => handleSelectInstitution('BARCH')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs flex flex-col justify-between space-y-3 ${
              selectedInstCode === 'BARCH'
                ? 'bg-gradient-to-br from-brand-navy to-brand-blue text-white border-brand-blue ring-2 ring-brand-gold shadow-md'
                : 'bg-white text-gray-800 border-gray-200 hover:border-brand-blue hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${selectedInstCode === 'BARCH' ? 'bg-white/15 text-brand-gold' : 'bg-purple-50 text-purple-600'}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedInstCode === 'BARCH' ? 'bg-brand-gold text-brand-navy' : 'bg-amber-100 text-amber-800'}`}>
                Pending Data
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm font-serif">B.Arch (Architecture)</h3>
              <p className={`text-[11px] mt-0.5 font-medium ${selectedInstCode === 'BARCH' ? 'text-blue-100' : 'text-gray-500'}`}>
                School of Environment &amp; Arch.
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t border-current/10">
              <span>View Institution</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      )}

      {/* DASHBOARD BODY / LEVEL 2 / LEVEL 3 VIEWS */}
      <div ref={detailsRef} className="space-y-6">
        
        {loading ? (
          <div className="bg-white rounded-2xl p-12 shadow-2xs border border-gray-200 flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full"></div>
            <span className="text-xs font-bold text-brand-navy">Loading KPI Records...</span>
          </div>
        ) : kpiLegacyData && kpiLegacyData.hasData ? (
          viewLevel === 'overview' || viewLevel === 'dept_single' ? (
            /* VIEW LEVEL 2: INSTITUTION OVERVIEW (OR SINGLE DEPT) */
            <div className="space-y-6 animate-fade-in">
              
              {/* INSTITUTION OVERVIEW HEADER BANNER */}
              <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {viewLevel === 'dept_single' ? 'Single Department View' : 'Institutional Level 2 Overview'}
                    </span>
                    <span className="text-xs font-bold text-gray-500">Selected Year: {selectedYear}</span>
                  </div>
                  <h2 className="text-xl font-bold text-brand-navy font-serif">
                    {viewLevel === 'dept_single' 
                      ? `${selectedDept} Department Quality Metrics`
                      : `${getInstitutionDisplayName(selectedInstCode)} Overview`}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {viewLevel === 'dept_single'
                      ? `Displaying specific indicators for ${selectedDept}.`
                      : `Displaying mathematical sum for counts and average (mean) for percentage metrics across all departments in ${getInstitutionDisplayName(selectedInstCode)}.`}
                  </p>
                </div>

                {viewLevel === 'overview' && (
                  <div className="text-right flex-shrink-0 bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Departments</span>
                    <span className="text-base font-extrabold text-brand-blue font-mono">
                      {kpiLegacyData.available_departments ? kpiLegacyData.available_departments.length : '—'}
                    </span>
                  </div>
                )}
              </div>

              {/* DEPARTMENT PARAMETER CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {kpiLegacyData.records.map((rec, idx) => {
                  if (rec.section) {
                    return (
                      <div key={idx} className="col-span-1 md:col-span-3 bg-brand-navy text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        <span>{rec.section}</span>
                      </div>
                    );
                  }

                  const indicator = rec.indicator;
                  const rawVal = rec.values ? rec.values[selectedYear] : rec[selectedYear];
                  const formattedVal = formatVal(indicator, rawVal);
                  const topAccent = getTopBorderAccent(idx);
                  const isPct = isPercentageIndicator(indicator);

                  const labelText = viewLevel === 'dept_single'
                    ? `${selectedDept} ${isPct ? 'Value' : 'Total'}`
                    : `Institutional ${isPct ? 'Average (Mean)' : 'Total Sum'}`;

                  return (
                    <div 
                      key={idx} 
                      className={`bg-white rounded-2xl p-4 sm:p-5 shadow-2xs border border-gray-200/90 hover:shadow-md transition-all flex flex-col justify-between ${topAccent}`}
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 font-sans">
                          {indicator}
                        </h4>
                        <div className="text-2xl sm:text-3xl font-extrabold font-sans text-brand-navy tracking-tight mb-3">
                          {formattedVal}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                        <span>{selectedYear} &bull; {labelText}</span>
                        {viewLevel === 'overview' && (
                          <button
                            onClick={() => handleOpenParameterDetails(rec)}
                            className="text-brand-blue font-bold hover:underline cursor-pointer flex items-center"
                          >
                            View Details &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LINE GRAPH: MULTI-YEAR TREND */}
              <div className="bg-white rounded-2xl p-6 shadow-2xs border border-gray-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-brand-navy flex items-center font-sans">
                      <TrendingUp className="w-5 h-5 mr-2 text-brand-blue" />
                      {viewLevel === 'dept_single' ? `${selectedDept} Department` : 'Institutional Overview'} Multi-Year Trend Graph
                    </h3>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Longitudinal trend (2021-2022 to 2025-2026) for {viewLevel === 'dept_single' ? selectedDept : getInstitutionDisplayName(selectedInstCode)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1.5 text-brand-blue" />
                      Parameter Trend Selection
                    </h4>

                    <div className="min-w-[260px]">
                      <select
                        value={selectedTrendIndicator}
                        onChange={(e) => setSelectedTrendIndicator(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-brand-navy text-xs font-bold py-1.5 px-3 rounded-lg focus:outline-none cursor-pointer"
                      >
                        {kpiLegacyData.records.filter(r => !r.section).map(r => (
                          <option key={r.indicator} value={r.indicator}>{r.indicator}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareOverviewLineChartData()} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="year" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} dy={5} />
                        <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} dx={-5} />
                        <RechartsTooltip
                          contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#123B6D' }}
                          formatter={(value) => [isTrendPct ? `${value}%` : (typeof value === 'number' ? value.toLocaleString() : value), selectedTrendIndicator]}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name={selectedTrendIndicator}
                          stroke="#1E5AA8"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#1E5AA8', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, fill: '#D6A84F', stroke: '#fff', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* VIEW LEVEL 3: PARAMETER DEPARTMENT-WISE DETAILS */
            <div className="space-y-6 animate-fade-in">
              
              {/* LEVEL 3 HEADER & BACK BUTTON */}
              <div className="bg-white rounded-2xl p-6 shadow-2xs border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold bg-blue-100 text-brand-blue px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Department-Wise Breakdown
                    </span>
                    <span className="text-xs font-bold text-gray-500">Academic Year: {selectedYear}</span>
                  </div>
                  <h2 className="text-xl font-bold text-brand-navy font-serif">
                    {selectedParamRecord?.indicator} — {getInstitutionDisplayName(selectedInstCode)} Details
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Viewing department-level contribution data across all departments in {getInstitutionDisplayName(selectedInstCode)} for {selectedYear}.
                  </p>
                </div>

                <button
                  onClick={handleBackToOverview}
                  className="px-4 py-2 bg-brand-navy hover:bg-brand-blue text-white rounded-xl text-xs font-bold transition-all flex items-center cursor-pointer shadow-2xs flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back to {selectedInstCode === 'ET' ? 'E&T' : selectedInstCode} Overview
                </button>
              </div>

              {/* LEVEL 3 DEPARTMENT MATRIX DATA TABLE */}
              <div className="bg-white rounded-2xl shadow-2xs border border-gray-200/80 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-brand-navy flex items-center font-sans">
                    <Table className="w-4 h-4 mr-2 text-brand-blue" />
                    Department-Wise Breakdown Table ({selectedParamRecord?.indicator})
                  </h3>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded">
                    Inherited Year: {selectedYear}
                  </span>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-brand-navy text-white text-[10px] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Department</th>
                        <th className={`px-4 py-3 text-right ${selectedYear === '2021-2022' ? 'bg-brand-blue' : ''}`}>2021-22</th>
                        <th className={`px-4 py-3 text-right ${selectedYear === '2022-2023' ? 'bg-brand-blue' : ''}`}>2022-23</th>
                        <th className={`px-4 py-3 text-right ${selectedYear === '2023-2024' ? 'bg-brand-blue' : ''}`}>2023-24</th>
                        <th className={`px-4 py-3 text-right ${selectedYear === '2024-2025' ? 'bg-brand-blue' : ''}`}>2024-25</th>
                        <th className={`px-4 py-3 text-right ${selectedYear === '2025-2026' ? 'bg-brand-blue' : ''}`}>2025-26</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {selectedParamRecord?.departmentMatrix?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="px-4 py-2.5 text-gray-400 text-[11px]">{idx + 1}</td>
                          <td className="px-4 py-2.5 font-bold text-brand-navy">{item.department}</td>
                          <td className={`px-4 py-2.5 text-right font-bold text-gray-700 ${selectedYear === '2021-2022' ? 'bg-blue-50 text-brand-blue' : ''}`}>
                            {formatVal(selectedParamRecord.indicator, item.years['2021-2022'])}
                          </td>
                          <td className={`px-4 py-2.5 text-right font-bold text-gray-700 ${selectedYear === '2022-2023' ? 'bg-blue-50 text-brand-blue' : ''}`}>
                            {formatVal(selectedParamRecord.indicator, item.years['2022-2023'])}
                          </td>
                          <td className={`px-4 py-2.5 text-right font-bold text-gray-700 ${selectedYear === '2023-2024' ? 'bg-blue-50 text-brand-blue' : ''}`}>
                            {formatVal(selectedParamRecord.indicator, item.years['2023-2024'])}
                          </td>
                          <td className={`px-4 py-2.5 text-right font-bold text-gray-700 ${selectedYear === '2024-2025' ? 'bg-blue-50 text-brand-blue' : ''}`}>
                            {formatVal(selectedParamRecord.indicator, item.years['2024-2025'])}
                          </td>
                          <td className={`px-4 py-2.5 text-right font-extrabold text-brand-blue ${selectedYear === '2025-2026' ? 'bg-blue-100/70' : ''}`}>
                            {formatVal(selectedParamRecord.indicator, item.years['2025-2026'])}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold border-t border-gray-200">
                      <tr>
                        <td colSpan="2" className="px-4 py-3 text-brand-navy uppercase text-[10px]">
                          {isParamPct ? 'Institutional Average (Mean)' : 'Institutional Total Sum / Aggregate'}
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-brand-navy">
                          {formatVal(selectedParamRecord?.indicator, selectedParamRecord?.values['2021-2022'])}
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-brand-navy">
                          {formatVal(selectedParamRecord?.indicator, selectedParamRecord?.values['2022-2023'])}
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-brand-navy">
                          {formatVal(selectedParamRecord?.indicator, selectedParamRecord?.values['2023-2024'])}
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-brand-navy">
                          {formatVal(selectedParamRecord?.indicator, selectedParamRecord?.values['2024-2025'])}
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-brand-blue text-sm">
                          {formatVal(selectedParamRecord?.indicator, selectedParamRecord?.values['2025-2026'])}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* LEVEL 3 DEPARTMENT COMPARISON BAR CHART */}
              <div className="bg-white rounded-2xl p-6 shadow-2xs border border-gray-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-brand-navy flex items-center font-sans">
                    <BarChart2 className="w-4 h-4 mr-2 text-brand-blue" />
                    Department Comparison Chart ({selectedParamRecord?.indicator} &bull; {selectedYear})
                  </h3>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareDeptComparisonBarChartData(selectedParamRecord)} margin={{ top: 10, right: 20, left: -15, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="department" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-25} textAnchor="end" />
                      <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} dx={-5} />
                      <RechartsTooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#123B6D' }}
                        formatter={(value) => [isParamPct ? `${value}%` : (typeof value === 'number' ? value.toLocaleString() : value), selectedParamRecord?.indicator]}
                      />
                      <Bar dataKey="value" name={selectedParamRecord?.indicator} fill="#1E5AA8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )
        ) : kpiLegacyData && (kpiLegacyData.isPending || selectedInstCode === 'BARCH' || selectedInstCode === 'SEAD') ? (
          /* B.ARCH PENDING STATE */
          <div className="bg-amber-50/80 rounded-2xl shadow-2xs border border-amber-200 p-10 text-center space-y-3">
            <Building2 className="w-12 h-12 text-amber-600 mx-auto mb-1 animate-pulse" />
            <h4 className="text-lg font-bold text-amber-900 font-sans">
              Data is yet to be received for B.Arch Institution
            </h4>
            <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
              The historical benchmark metrics and visual representation for B.Arch (Architecture) are pending data collection.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xs border border-gray-200/80 p-10 text-center space-y-2">
            <FileX className="w-10 h-10 text-amber-500 mx-auto mb-1" />
            <h4 className="text-base font-bold text-brand-navy">
              Data is not available for {getInstitutionDisplayName(selectedInstCode)}.
            </h4>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
