import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, FileText, Check, Award, GraduationCap, Users, Microscope, FileX, BarChart2, ArrowRight, ChevronRight, Layers, Sparkles, Zap, BookOpen, TrendingUp, Table, Calendar } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { getLegacyKpiClientData } from '../services/dataService';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const detailsRef = useRef(null);

  const userRole = (user?.role || '').toUpperCase();
  const isChairman = userRole === 'CHAIRMAN';

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

  const [selectedInstCode, setSelectedInstCode] = useState(passedInst);
  const [selectedDept, setSelectedDept] = useState(passedDept);
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [kpiLegacyData, setKpiLegacyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasChosenScope, setHasChosenScope] = useState(true);
  const [selectedTrendIndicator, setSelectedTrendIndicator] = useState('Student Pass Percentage');

  const availableYears = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];

  useEffect(() => {
    if (assignedInst) {
      setSelectedInstCode(assignedInst);
      if (!location.state?.department) {
        if (assignedInst === 'ET') setSelectedDept('CSE');
        else if (assignedInst === 'MANAGEMENT') setSelectedDept('MBA');
        else if (assignedInst === 'BARCH') setSelectedDept('B.Arch');
        else setSelectedDept('BCA');
      }
    } else if (location.state?.institution) {
      setSelectedInstCode(location.state.institution);
      if (location.state.department) setSelectedDept(location.state.department);
    }
  }, [assignedInst, location.state]);

  useEffect(() => {
    if (hasChosenScope) {
      loadHistoricalKpiData();
    }
  }, [selectedInstCode, selectedDept, selectedYear, hasChosenScope]);

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

  const handleSelectScope = (instCode, defaultDept) => {
    if (assignedInst && instCode !== assignedInst) return; // Restrict non-chairman
    setSelectedInstCode(instCode);
    setSelectedDept(defaultDept);
    setHasChosenScope(true);

    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatVal = (indicator, rawVal) => {
    if (rawVal === undefined || rawVal === null || rawVal === '') return 'N/A';
    if (typeof rawVal === 'number' && (indicator.toLowerCase().includes('percentage') || indicator.toLowerCase().includes('projects') || rawVal < 1)) {
      return `${(rawVal * 100).toFixed(1)}%`;
    }
    return typeof rawVal === 'number' ? rawVal.toLocaleString() : rawVal.toString();
  };

  const getTopBorderAccent = (idx) => {
    const mod = idx % 3;
    if (mod === 0) return 'border-t-4 border-t-amber-400';
    if (mod === 1) return 'border-t-4 border-t-teal-500';
    return 'border-t-4 border-t-blue-600';
  };

  const etDepartments = [
    'CSE', 'IT', 'LCS', 'MATHS', 'PHYSICS', 'CHEMISTRY', 'EEE',
    'ECE-ECE DS', 'BIOTECH', 'BIOMEDICAL', 'CIVIL', 'MECH',
    'AIMLAI', 'GTDS', 'CS', 'BDACC', 'IOTCSBS'
  ];
  const mgmtDepartments = ['MBA', 'BBA'];

  const flabsDepartments = [
    { code: 'BCA', name: 'BCA (Computer Applications)' },
    { code: 'MCA', name: 'MCA (Computer Applications)' },
    { code: 'CS', name: 'Computer Science (CS)' },
    { code: 'Cyber', name: 'Cyber Security' },
    { code: 'AI&ML', name: 'AI & ML' },
    { code: 'LCS', name: 'LCS (Language & Communication)' },
    { code: 'com-S2', name: 'Commerce Shift 2 & CS' },
    { code: 'commer-S1', name: 'Commerce Shift 1' },
    { code: 'biotech', name: 'Biotechnology' },
    { code: 'Maths', name: 'Mathematics' },
    { code: 'A&F', name: 'Commerce (A&F)' },
    { code: 'viscom', name: 'Visual Communication' },
    { code: 'JMC', name: 'Journalism and Mass Communication' },
    { code: 'FD', name: 'Fashion Designing' }
  ];

  const prepareSingleLineChartData = () => {
    if (!kpiLegacyData || !kpiLegacyData.records) return [];
    const rec = kpiLegacyData.records.find(r => r.indicator === selectedTrendIndicator);
    if (!rec) return [];

    return availableYears.map(yr => {
      const val = rec.values ? rec.values[yr] : rec[yr];
      let numVal = 0;
      if (typeof val === 'number') {
        numVal = (rec.indicator.toLowerCase().includes('percentage') || rec.indicator.toLowerCase().includes('projects') || val < 1)
          ? Number((val * 100).toFixed(1))
          : val;
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

  const getInstitutionDisplayName = (code) => {
    if (code === 'ET') return 'E&T (Engineering & Technology)';
    if (code === 'MANAGEMENT') return 'Management (MBA & BBA)';
    if (code === 'BARCH' || code === 'SEAD') return 'B.Arch (Architecture)';
    return 'FLABS (Faculty of Science & Humanities)';
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">

      {/* TOP LANDING HEADER MATCHING SCREENSHOT */}
      <div className="bg-[#121E31] rounded-2xl p-6 sm:p-8 shadow-md text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
            INSTITUTIONAL PERFORMANCE
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
            {getInstitutionDisplayName(selectedInstCode)} Dashboard
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 font-medium">
            View institutional performance across all {selectedInstCode} departments.
          </p>
        </div>
      </div>

      {/* 4 INSTITUTION LANDING CARDS (ONLY SHOWN FOR CHAIRMAN LOGINS) */}
      {isChairman && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* CARD 1: E&T */}
          <div
            onClick={() => handleSelectScope('ET', 'CSE')}
            className={`bg-white rounded-2xl p-5 shadow-2xs border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${selectedInstCode === 'ET' ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-blue-50/20' : 'border-gray-200/90'
              }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-200">
                  17 Depts
                </span>
              </div>

              <h3 className="text-lg font-bold text-brand-navy mb-1">E&amp;T</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                Engineering &amp; Technology performance metrics
              </p>
            </div>
          </div>

          {/* CARD 2: FLABS */}
          <div
            onClick={() => handleSelectScope('FLABS', 'BCA')}
            className={`bg-white rounded-2xl p-5 shadow-2xs border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${selectedInstCode === 'FLABS' ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-blue-50/20' : 'border-gray-200/90'
              }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Microscope className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200">
                  14 Depts
                </span>
              </div>

              <h3 className="text-lg font-bold text-brand-navy mb-1">FLABS</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                Faculty of Science &amp; Humanities performance metrics
              </p>
            </div>
          </div>

          {/* CARD 3: Management */}
          <div
            onClick={() => handleSelectScope('MANAGEMENT', 'MBA')}
            className={`bg-white rounded-2xl p-5 shadow-2xs border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${selectedInstCode === 'MANAGEMENT' ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-blue-50/20' : 'border-gray-200/90'
              }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[10px] font-bold border border-purple-200">
                  MBA &amp; BBA
                </span>
              </div>

              <h3 className="text-lg font-bold text-brand-navy mb-1">Management</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                Faculty of Management datasets
              </p>
            </div>
          </div>

          {/* CARD 4: B.Arch */}
          <div
            onClick={() => handleSelectScope('BARCH', 'B.Arch')}
            className={`bg-white rounded-2xl p-5 shadow-2xs border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${selectedInstCode === 'BARCH' ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-blue-50/20' : 'border-gray-200/90'
              }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold border border-slate-200">
                  Architecture
                </span>
              </div>

              <h3 className="text-lg font-bold text-brand-navy mb-1">B.Arch</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                School of Architecture performance index
              </p>
            </div>
          </div>

        </div>
      )}

      {/* DYNAMIC DASHBOARD MAIN VIEW (RESTRICTED FOR DEAN & IQAC COORDINATORS) */}
      <div ref={detailsRef} className="space-y-6 animate-fade-in-up pt-2">

        {/* SELECTION BAR (MATCHING FILTER BY YEAR IN SCREENSHOT) */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-200/80 p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">Institutional Scope</span>
              <h3 className="text-base font-bold text-brand-navy flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-brand-gold" />
                {getInstitutionDisplayName(selectedInstCode)}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto min-w-[340px]">
              {/* DYNAMIC DEPARTMENT SELECTOR */}
              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Department</label>
                {selectedInstCode === 'FLABS' ? (
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-brand-bg border border-gray-200 text-brand-navy py-2 px-3 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                  >
                    {flabsDepartments.map(d => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                ) : selectedInstCode === 'ET' ? (
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-brand-bg border border-gray-200 text-brand-navy py-2 px-3 rounded-lg text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    {etDepartments.map(d => (
                      <option key={d} value={d}>{d} Department</option>
                    ))}
                  </select>
                ) : selectedInstCode === 'MANAGEMENT' ? (
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-brand-bg border border-gray-200 text-brand-navy py-2 px-3 rounded-lg text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    {mgmtDepartments.map(d => (
                      <option key={d} value={d}>{d} Program</option>
                    ))}
                  </select>
                ) : (
                  <select disabled className="w-full bg-gray-100 border border-gray-200 text-gray-400 py-2 px-3 rounded-lg text-xs font-semibold">
                    <option>N/A (B.Arch Pending)</option>
                  </select>
                )}
              </div>

              {/* ACADEMIC YEAR SELECTOR */}
              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Filter by year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-brand-navy text-white font-bold py-2 px-3 rounded-xl text-xs focus:outline-none cursor-pointer"
                >
                  <option value="2021-2022">2021-2022</option>
                  <option value="2022-2023">2022-2023</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* PARAMETER DATA CARDS */}
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center text-brand-muted border border-gray-200 shadow-2xs">
            <div className="animate-spin w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="font-bold text-xs">Loading Department Data...</p>
          </div>
        ) : kpiLegacyData && kpiLegacyData.hasData ? (
          <div className="space-y-6">

            {/* YEAR PARAMETER CARDS (MATCHING EXACT SCREENSHOT CARD STYLE) */}
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
                      <span>{selectedYear} Data</span>
                      <span className="text-brand-blue font-bold hover:underline cursor-pointer flex items-center">
                        View details &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PICTORIAL REPRESENTATION (LINE GRAPH ONLY AS REQUESTED) */}
            <div className="bg-white rounded-2xl p-6 shadow-2xs border border-gray-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                <div>
                  <h3 className="text-base font-bold text-brand-navy flex items-center font-sans">
                    <TrendingUp className="w-5 h-5 mr-2 text-brand-blue" />
                    Visual Performance Representation ({kpiLegacyData.department})
                  </h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Multi-year longitudinal trend line graph (2021-2022 to 2025-2026)
                  </p>
                </div>
              </div>

              <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1.5 text-brand-blue" />
                    Parameter Multi-Year Line Graph Trend
                  </h4>

                  <div className="min-w-[240px]">
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
                    <LineChart data={prepareSingleLineChartData()} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="year" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} dy={5} />
                      <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} dx={-5} />
                      <RechartsTooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#123B6D' }}
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
        ) : kpiLegacyData && (kpiLegacyData.isPending || selectedInstCode === 'BARCH' || selectedInstCode === 'SEAD') ? (
          <div className="bg-amber-50/80 rounded-2xl shadow-2xs border border-amber-200 p-10 text-center space-y-3">
            <Building2 className="w-12 h-12 text-amber-600 mx-auto mb-1 animate-pulse" />
            <h4 className="text-lg font-bold text-amber-900">
              Yet to receive data for B.Arch Institution
            </h4>
            <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
              The historical benchmark metrics and visual representation for B.Arch (Architecture) are pending data collection.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xs border border-gray-200/80 p-10 text-center space-y-2">
            <FileX className="w-10 h-10 text-amber-500 mx-auto mb-1" />
            <h4 className="text-base font-bold text-brand-navy">
              Data is not available for {selectedInstCode} ({selectedDept}).
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
