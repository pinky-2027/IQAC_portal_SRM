import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FileBarChart, TrendingUp, Table, Filter, Building2, Check, BarChart2, Calendar, FileX, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { apiService } from '../services/apiService';
import { getLegacyKpiClientData, formatVal, isPercentageIndicator, normalizePercentageValue } from '../services/dataService';

const Reports = () => {
  const location = useLocation();
  const stateInst = location.state?.institution || 'FLABS';
  const stateDept = location.state?.department || 'BCA';

  const [selectedInstCode, setSelectedInstCode] = useState(stateInst);
  const [selectedDept, setSelectedDept] = useState(stateDept);
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [kpiLegacyData, setKpiLegacyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const availableYears = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];

  useEffect(() => {
    if (selectedInstCode === 'MANAGEMENT') {
      if (!['MBA', 'BBA'].includes(selectedDept)) setSelectedDept('MBA');
    } else if (selectedInstCode === 'ET') {
      if (!etDepartments.includes(selectedDept)) setSelectedDept('CSE');
    } else if (selectedInstCode === 'FLABS') {
      if (!flabsDepartments.some(d => d.code === selectedDept)) setSelectedDept('BCA');
    }
  }, [selectedInstCode]);

  useEffect(() => {
    loadHistoricalKpiData();
  }, [selectedInstCode, selectedDept]);

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
        } else {
          setKpiLegacyData(getLegacyKpiClientData(selectedInstCode, selectedYear, selectedDept));
        }
      } catch (err) {
        setKpiLegacyData(getLegacyKpiClientData(selectedInstCode, selectedYear, selectedDept));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const prepareChartData = (rec) => {
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
        year: yr.replace('20', "'"),
        value: numVal
      };
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in font-sans pb-10">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-blue rounded-xl p-5 shadow-2xs text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-gold font-bold text-[10px] uppercase tracking-wider mb-1">
            <FileBarChart className="w-4 h-4" />
            <span>IQAC Executive Visual Analytics &amp; Year-Wise Comparative Reports</span>
          </div>
          <h2 className="text-xl font-bold">Year-Wise Visual Parameter Analysis &amp; Trend Charts</h2>
          <p className="text-blue-100 text-xs mt-0.5 max-w-xl">
            Visual comparison charts across Academic Years for {selectedInstCode} ({selectedDept}).
          </p>
        </div>
      </div>

      {/* SELECTION FILTER BAR */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Select Institution</label>
          <select
            value={selectedInstCode}
            onChange={(e) => setSelectedInstCode(e.target.value)}
            className="w-full bg-brand-bg border border-gray-200 text-brand-navy py-2 px-3 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
          >
            <option value="ET">E&amp;T (17 Departments)</option>
            <option value="FLABS">FLABS (14 Departments)</option>
            <option value="MANAGEMENT">Management (MBA &amp; BBA)</option>
            <option value="BARCH">B.Arch (Yet to receive data)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Select Department</label>
          {selectedInstCode === 'FLABS' ? (
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-brand-bg border border-gray-200 text-brand-navy py-2 px-3 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
            >
              {flabsDepartments.map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          ) : selectedInstCode === 'ET' ? (
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-brand-bg border border-gray-200 text-brand-navy py-2 px-3 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
            >
              {etDepartments.map(d => (
                <option key={d} value={d}>{d} Department</option>
              ))}
            </select>
          ) : selectedInstCode === 'MANAGEMENT' ? (
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-brand-bg border border-gray-200 text-brand-navy py-2 px-3 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
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
      </div>

      {/* VISUAL CHARTS & ANALYTICS */}
      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center text-brand-muted border border-gray-200 shadow-2xs">
          <div className="animate-spin w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="font-bold text-xs">Generating Visual Analytics for {selectedInstCode} ({selectedDept})...</p>
        </div>
      ) : kpiLegacyData && kpiLegacyData.hasData ? (
        <div className="space-y-5 animate-fade-in-up">
          
          {/* SECTION 1: VISUAL PARAMETER BAR CHARTS */}
          <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 p-5">
            <div className="pb-3 mb-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-brand-navy flex items-center">
                  <BarChart2 className="w-4 h-4 mr-2 text-brand-blue" />
                  Year-Wise Visual Parameter Comparison ({kpiLegacyData.institution} — {kpiLegacyData.department})
                </h3>
                <p className="text-[11px] text-brand-muted mt-0.5">Multi-year comparison charts across academic years for each KPI indicator</p>
              </div>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200 flex items-center">
                <Check className="w-3 h-3 mr-1" /> Active Analytics
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {kpiLegacyData.records.filter(r => !r.section).map((rec, idx) => {
                const chartData = prepareChartData(rec);
                return (
                  <div key={idx} className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 flex flex-col justify-between hover:shadow-xs transition-all">
                    <div>
                      <h4 className="text-xs font-bold text-brand-navy leading-tight mb-2 truncate" title={rec.indicator}>
                        {rec.indicator}
                      </h4>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="year" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <RechartsTooltip
                              contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 'bold' }}
                              itemStyle={{ color: '#123B6D' }}
                            />
                            <Bar dataKey="value" name="Value" fill="#1E5AA8" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: COMPREHENSIVE MULTI-YEAR DATA TABLE */}
          <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-brand-navy flex items-center">
                  <Table className="w-4 h-4 mr-2 text-brand-blue" />
                  Multi-Year Comparative Parameter Matrix ({kpiLegacyData.department})
                </h3>
                <p className="text-[11px] text-brand-muted mt-0.5">Side-by-side numerical view across Academic Years</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-brand-navy text-white font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5 border-b border-white/10 sticky left-0 bg-brand-navy z-10 w-1/3">KPI Parameter Indicator</th>
                    {availableYears.map(yr => (
                      <th key={yr} className="px-4 py-2.5 border-b border-white/10 text-right">{yr}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {kpiLegacyData.records.map((row, idx) => {
                    if (row.section) {
                      return (
                        <tr key={idx} className="bg-brand-navy/90 text-white font-bold">
                          <td colSpan={availableYears.length + 1} className="px-4 py-2 text-xs">
                            {row.section}
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-4 py-2 font-semibold text-brand-navy sticky left-0 bg-white/95 backdrop-blur-sm z-10 border-r border-gray-100 truncate max-w-xs sm:max-w-md">
                          {row.indicator}
                        </td>
                        {availableYears.map(yr => {
                          const rawVal = row.values ? row.values[yr] : row[yr];
                          const displayVal = formatVal(row.indicator, rawVal);

                          return (
                            <td key={yr} className="px-4 py-2 text-right text-brand-navy font-bold font-sans">
                              {displayVal}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : kpiLegacyData && (kpiLegacyData.isPending || selectedInstCode === 'BARCH' || selectedInstCode === 'SEAD') ? (
        <div className="bg-amber-50/80 rounded-xl shadow-2xs border border-amber-200 p-10 text-center animate-fade-in space-y-3">
          <Clock className="w-12 h-12 text-amber-600 mx-auto mb-1 animate-pulse" />
          <h4 className="text-lg font-bold text-amber-900">
            Yet to receive data for B.Arch Institution
          </h4>
          <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
            The historical benchmark metrics and visual analytics for B.Arch (Architecture) are pending data collection and will be displayed as soon as received.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 p-10 text-center animate-fade-in space-y-2">
          <FileX className="w-10 h-10 text-amber-500 mx-auto mb-1" />
          <h4 className="text-base font-bold text-brand-navy">
            Visual Analytics not available for {selectedInstCode} ({selectedDept}).
          </h4>
          <p className="text-xs text-brand-muted max-w-md mx-auto">
            The dataset for {selectedInstCode} ({selectedDept}) has not been uploaded to the Academic Data Archive yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
