import React, { useState, useEffect } from 'react';
import { 
  Building2, Calendar, Users, GraduationCap, Briefcase, 
  BookOpen, Award, Check, FileX, FileText, Microscope
} from 'lucide-react';
import { getDepartments, getAcademicYears, getKPIData, formatVal } from '../services/dataService';

const DepartmentDashboard = () => {
  const [selectedDept, setSelectedDept] = useState('flabs');
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [kpiResult, setKpiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const departments = getDepartments();
  const years = getAcademicYears();

  useEffect(() => {
    if (selectedDept && selectedYear) {
      fetchData();
    }
  }, [selectedDept, selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getKPIData(selectedDept, selectedYear);
    setKpiResult(result);
    setLoading(false);
  };

  const getYearColKey = (yearId) => {
    const yearMap = {
      '2021-2022': '__EMPTY_1',
      '2022-2023': '__EMPTY_2',
      '2023-2024': '__EMPTY_3',
      '2024-2025': '__EMPTY_4',
      '2025-2026': '__EMPTY_5'
    };
    return yearMap[yearId] || '__EMPTY_4';
  };

  const currentYearObj = years.find(y => y.id === selectedYear) || years[3];
  const currentDeptObj = departments.find(d => d.id === selectedDept) || departments[1];

  const formatKpiValue = (kpiName, rawVal) => {
    return formatVal(kpiName, rawVal);
  };

  const getKpiCategory = (kpiName) => {
    const name = kpiName.toLowerCase();
    if (name.includes('student') || name.includes('intake') || name.includes('pass') || name.includes('placed') || name.includes('higher') || name.includes('field projects')) {
      return { category: 'Student & Academic', icon: GraduationCap, badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    if (name.includes('faculty') || name.includes('phd') || name.includes('fdp')) {
      return { category: 'Faculty Development', icon: Users, badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    }
    if (name.includes('journal') || name.includes('publications') || name.includes('conferences') || name.includes('books') || name.includes('patents') || name.includes('funding')) {
      return { category: 'Research & Innovation', icon: Microscope, badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
    return { category: 'Institutional Quality', icon: Award, badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' };
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in font-sans">
      {/* Compact Header & Controls */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-navy to-brand-blue px-5 py-3.5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Department Performance Analytics</h2>
            <p className="text-blue-100 text-[11px]">Select a department and academic year to inspect recorded IQAC metrics.</p>
          </div>
        </div>
        
        <div className="p-4 bg-white flex flex-col md:flex-row gap-4 items-end">
          {/* Department Selection */}
          <div className="w-full md:w-1/2">
            <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Select Department</label>
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full appearance-none bg-brand-bg border border-gray-200 text-brand-text py-2 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-bold text-xs cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} {dept.id === 'flabs' ? '(Data Available)' : '(Pending Data)'}
                  </option>
                ))}
              </select>
              <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-muted pointer-events-none w-3.5 h-3.5" />
            </div>
          </div>

          {/* Academic Year Selection */}
          <div className="w-full md:w-1/2">
            <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Select Academic Year</label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full appearance-none bg-brand-bg border border-gray-200 text-brand-text py-2 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue font-bold text-xs cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year.id} value={year.id}>{year.label}</option>
                ))}
              </select>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-muted pointer-events-none w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-xl p-8 text-center text-brand-muted border border-gray-200/80 shadow-2xs">
          <div className="animate-spin w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="font-semibold text-xs">Loading IQAC KPI Metrics...</p>
        </div>
      )}

      {/* CASE 1: Department HAS NO data */}
      {!loading && kpiResult && !kpiResult.hasData && (
        <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 py-12 px-6 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3 text-amber-600 border border-amber-100">
            <FileX className="w-6 h-6" />
          </div>
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2">No Records Yet</span>
          <h3 className="text-base font-bold text-brand-navy mb-1">No Records Found for {currentDeptObj.name}</h3>
          <p className="text-brand-muted max-w-sm mx-auto text-xs leading-relaxed mb-4">
            Data for <span className="font-bold text-brand-navy">{currentDeptObj.name}</span> is pending upload. Active data is available for <span className="font-bold text-brand-blue">FLABS</span>.
          </p>
          <button 
            onClick={() => setSelectedDept('flabs')}
            className="px-3.5 py-1.5 bg-brand-navy hover:bg-brand-blue text-white font-semibold text-xs rounded-lg shadow-sm transition-all duration-150 cursor-pointer"
          >
            Switch to FLABS Department Data
          </button>
        </div>
      )}

      {/* CASE 2: Department HAS data (FLABS) -> COMPACT KPI CARDS GRID */}
      {!loading && kpiResult && kpiResult.hasData && (
        <div className="space-y-4 animate-fade-in-up">
          
          {/* Active Context Banner */}
          <div className="bg-white rounded-xl p-3.5 shadow-2xs border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center">
                  <Check className="w-3 h-3 mr-0.5" /> Active Records
                </span>
                <span className="text-[10px] font-medium text-brand-muted">Source: IQAC_KPI_DATA-21-25.xlsx</span>
              </div>
              <h3 className="text-base font-bold text-brand-navy mt-1">
                {currentDeptObj.name} Department <span className="text-gray-400 font-normal">| {currentYearObj.label} Metrics</span>
              </h3>
            </div>
            <div className="bg-brand-bg px-3 py-1.5 rounded-lg border border-gray-200/70 text-right">
              <span className="text-[9px] text-brand-muted font-semibold block uppercase tracking-wider">KPI Indicators</span>
              <span className="text-sm font-bold text-brand-navy">{kpiResult.data.kpi.length - 1} Metrics</span>
            </div>
          </div>

          {/* COMPACT KPI CARDS GRID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold text-brand-navy flex items-center uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-brand-blue" />
                KPI Performance Cards ({currentYearObj.label})
              </h4>
              <span className="text-[10px] font-medium text-brand-muted">Displaying all rows for {selectedYear}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {kpiResult.data.kpi.slice(1).map((row, index) => {
                const kpiName = row['__EMPTY'];
                const colKey = getYearColKey(selectedYear);
                const rawVal = row[colKey];
                const formattedVal = formatKpiValue(kpiName, rawVal);
                const { category, icon: Icon, badgeColor } = getKpiCategory(kpiName);

                return (
                  <div 
                    key={index}
                    className="bg-white rounded-lg p-3 shadow-2xs border border-gray-200/80 hover:shadow-xs hover:border-brand-blue/30 transition-all duration-150 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${badgeColor}`}>
                          {category}
                        </span>
                        <div className="p-1 bg-brand-bg rounded-md text-brand-blue group-hover:bg-brand-navy group-hover:text-white transition-colors">
                          <Icon className="w-3 h-3" />
                        </div>
                      </div>

                      <h5 className="text-[11px] font-semibold text-brand-text leading-tight line-clamp-2 min-h-[1.75rem]">
                        {kpiName}
                      </h5>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-[9px] text-brand-muted font-medium block">Value</span>
                        <span className="text-lg font-bold text-brand-navy leading-none">{formattedVal}</span>
                      </div>
                      <span className="text-[9px] font-semibold text-green-600 bg-green-50 px-1 py-0.5 rounded">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;
