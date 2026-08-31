import React, { useState, useEffect } from 'react';
import { Building2, Calendar, FileText, CheckCircle2, Clock, Eye, AlertCircle, ShieldAlert, X, ExternalLink, FileCheck, TrendingUp, BarChart2, FileX, Award, GraduationCap, Users, Microscope } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { getLegacyKpiClientData } from '../services/dataService';

const HodDashboard = () => {
  const { user } = useAuth();
  
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [kpiLegacyData, setKpiLegacyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTrendIndicator, setSelectedTrendIndicator] = useState('Student Pass Percentage');

  const availableYears = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];

  // Map HOD assigned department and institution from user profile
  const getHodAssignedDetails = () => {
    const rawDept = user?.department_name || user?.group || '';
    const userGrp = (user?.group || user?.role || '').toUpperCase();
    const userName = user?.full_name || 'HOD';

    let instCode = 'FLABS';
    if (userGrp.includes('ET') || userGrp.includes('E&T') || userGrp.includes('ENGIN')) instCode = 'ET';
    else if (userGrp.includes('MGMT') || userGrp.includes('MANAGEMENT') || userGrp.includes('MBA') || userGrp.includes('BBA')) instCode = 'MANAGEMENT';
    else if (userGrp.includes('ARCH') || userGrp.includes('SEAD')) instCode = 'BARCH';

    // Normalize department code for legacy datasets
    let deptCode = 'BCA';
    const lowerDept = rawDept.toLowerCase();

    if (instCode === 'FLABS') {
      if (lowerDept.includes('mca')) deptCode = 'MCA';
      else if (lowerDept.includes('cyber')) deptCode = 'Cyber';
      else if (lowerDept.includes('ai') || lowerDept.includes('ml')) deptCode = 'AI&ML';
      else if (lowerDept.includes('lcs') || lowerDept.includes('language')) deptCode = 'LCS';
      else if (lowerDept.includes('shift 2') || lowerDept.includes('s2')) deptCode = 'com-S2';
      else if (lowerDept.includes('shift 1') || lowerDept.includes('s1')) deptCode = 'commer-S1';
      else if (lowerDept.includes('biotech')) deptCode = 'biotech';
      else if (lowerDept.includes('math')) deptCode = 'Maths';
      else if (lowerDept.includes('a&f') || lowerDept.includes('accounting')) deptCode = 'A&F';
      else if (lowerDept.includes('viscom') || lowerDept.includes('visual')) deptCode = 'viscom';
      else if (lowerDept.includes('jmc') || lowerDept.includes('journalism')) deptCode = 'JMC';
      else if (lowerDept.includes('fashion') || lowerDept.includes('design')) deptCode = 'FD';
      else if (lowerDept.includes('computer science') || lowerDept.includes('cs')) deptCode = 'CS';
      else deptCode = 'BCA';
    } else if (instCode === 'ET') {
      if (lowerDept.includes('it')) deptCode = 'IT';
      else if (lowerDept.includes('lcs')) deptCode = 'LCS';
      else if (lowerDept.includes('math')) deptCode = 'MATHS';
      else if (lowerDept.includes('physic')) deptCode = 'PHYSICS';
      else if (lowerDept.includes('chemist')) deptCode = 'CHEMISTRY';
      else if (lowerDept.includes('eee')) deptCode = 'EEE';
      else if (lowerDept.includes('ece')) deptCode = 'ECE-ECE DS';
      else if (lowerDept.includes('biotech')) deptCode = 'BIOTECH';
      else if (lowerDept.includes('biomed')) deptCode = 'BIOMEDICAL';
      else if (lowerDept.includes('civil')) deptCode = 'CIVIL';
      else if (lowerDept.includes('mech')) deptCode = 'MECH';
      else if (lowerDept.includes('aiml')) deptCode = 'AIMLAI';
      else if (lowerDept.includes('gtds')) deptCode = 'GTDS';
      else if (lowerDept.includes('bdacc')) deptCode = 'BDACC';
      else if (lowerDept.includes('iot')) deptCode = 'IOTCSBS';
      else deptCode = 'CSE';
    } else if (instCode === 'MANAGEMENT') {
      if (lowerDept.includes('bba')) deptCode = 'BBA';
      else deptCode = 'MBA';
    } else {
      deptCode = 'B.Arch';
    }

    return { instCode, deptCode, displayName: rawDept || deptCode, hodName: userName };
  };

  const hodScope = getHodAssignedDetails();

  useEffect(() => {
    loadHodDepartmentData();
  }, [hodScope.instCode, hodScope.deptCode, selectedYear]);

  const loadHodDepartmentData = async () => {
    setLoading(true);
    try {
      if (hodScope.instCode === 'BARCH') {
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
        const res = await apiService.getLegacyKpiData(hodScope.instCode, selectedYear, hodScope.deptCode);
        if (res && res.records && res.records.length > 0) {
          setKpiLegacyData(res);
          if (res.records[0] && res.records[0].indicator) {
            setSelectedTrendIndicator(res.records[0].indicator);
          }
        } else {
          const fallback = getLegacyKpiClientData(hodScope.instCode, selectedYear, hodScope.deptCode);
          setKpiLegacyData(fallback);
          if (fallback.records && fallback.records[0] && fallback.records[0].indicator) {
            setSelectedTrendIndicator(fallback.records[0].indicator);
          }
        }
      } catch (err) {
        const fallback = getLegacyKpiClientData(hodScope.instCode, selectedYear, hodScope.deptCode);
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

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* HOD WELCOME HEADER */}
      <div className="bg-[#121E31] rounded-2xl p-6 sm:p-8 shadow-md text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
            HEAD OF DEPARTMENT (HOD) PORTAL &bull; {hodScope.instCode}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-serif">
            {hodScope.hodName} ({hodScope.displayName})
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 font-medium">
            Single-Department Scoped Performance Dashboard for {hodScope.deptCode} Department
          </p>
        </div>
      </div>

      {/* ACADEMIC YEAR FILTER BAR (LOCKED TO HOD'S DEPARTMENT ONLY) */}
      <div className="bg-white rounded-2xl shadow-2xs border border-gray-200/80 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">Assigned Department Scope</span>
            <h3 className="text-base font-bold text-brand-navy flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-brand-gold" />
              {hodScope.instCode} &bull; {hodScope.displayName} ({hodScope.deptCode})
            </h3>
          </div>

          <div className="min-w-[220px]">
            <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Filter by Academic Year</label>
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

      {/* PARAMETER CARDS & LINE GRAPH FOR HOD'S ASSIGNED DEPARTMENT */}
      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center text-brand-muted border border-gray-200 shadow-2xs">
          <div className="animate-spin w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="font-bold text-xs">Loading {hodScope.deptCode} Department Data...</p>
        </div>
      ) : kpiLegacyData && kpiLegacyData.hasData ? (
        <div className="space-y-6 animate-fade-in-up">
          
          {/* YEAR PARAMETER CARDS */}
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
                    <h4 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 font-serif">
                      {indicator}
                    </h4>
                    <div className="text-2xl sm:text-3xl font-bold font-serif text-brand-navy tracking-tight mb-3">
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

          {/* PICTORIAL REPRESENTATION LINE GRAPH */}
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-gray-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
              <div>
                <h3 className="text-base font-bold text-brand-navy flex items-center font-serif">
                  <TrendingUp className="w-5 h-5 mr-2 text-brand-blue" />
                  Visual Performance Trend ({hodScope.deptCode} Department)
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Multi-year longitudinal trend line graph (2021-2022 to 2025-2026) for {hodScope.displayName}
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
      ) : (
        <div className="bg-amber-50/80 rounded-2xl shadow-2xs border border-amber-200 p-12 text-center space-y-3">
          <FileX className="w-12 h-12 text-amber-600 mx-auto mb-1 animate-bounce" />
          <h4 className="text-lg font-bold text-amber-900 font-serif">
            Sorry, {hodScope.hodName} ({hodScope.displayName}) — Data is not available.
          </h4>
          <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
            The parameter dataset for {hodScope.displayName} has not been recorded in the institution dataset yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default HodDashboard;
