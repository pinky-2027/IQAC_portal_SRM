import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, Calendar, Save, CheckCircle2, AlertCircle, TrendingUp, 
  Award, GraduationCap, Users, BookOpen, FileText, Check, ShieldCheck, RefreshCw, Eye
} from 'lucide-react';
import { 
  PERFORMANCE_KPIS_LIST, 
  getHodPerformanceKpiValues, 
  saveHodPerformanceKpiValues, 
  getLegacyKpiClientData, 
  formatVal,
  isPercentageIndicator,
  getKpiTargetAnalysis
} from '../services/dataService';

const HodPerformanceKpis = () => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [isSaved, setIsSaved] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const availableYears = ['2026-2027', '2025-2026', '2024-2025', '2023-2024', '2022-2023', '2021-2022'];

  // Map HOD assigned department and institution from user profile
  const getHodAssignedDetails = () => {
    const rawDept = user?.department_name || user?.group || '';
    const userGrp = (user?.group || user?.role || '').toUpperCase();
    const userName = user?.full_name || user?.name || 'HOD';

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
    loadDepartmentKpiForm();
  }, [hodScope.instCode, hodScope.deptCode, selectedYear]);

  const loadDepartmentKpiForm = () => {
    setLoading(true);
    setIsSaved(false);
    
    // Check if custom HOD values exist in localStorage for this year
    const storedValues = getHodPerformanceKpiValues(hodScope.instCode, hodScope.deptCode, selectedYear);
    
    // Load baseline dataset records
    const legacyRes = getLegacyKpiClientData(hodScope.instCode, selectedYear, hodScope.deptCode);
    const records = legacyRes?.records || [];

    const initialMap = {};

    PERFORMANCE_KPIS_LIST.forEach(kpiName => {
      if (storedValues && storedValues[kpiName] !== undefined && storedValues[kpiName] !== null) {
        initialMap[kpiName] = storedValues[kpiName];
      } else {
        // Find matching indicator row in legacy records
        const rec = records.find(r => r.indicator && r.indicator.toLowerCase() === kpiName.toLowerCase());
        if (rec) {
          const rawVal = rec.values ? rec.values[selectedYear] : rec[selectedYear];
          initialMap[kpiName] = (rawVal === 'NIL' || rawVal === undefined || rawVal === null) ? '' : rawVal;
        } else {
          initialMap[kpiName] = '';
        }
      }
    });

    setFormData(initialMap);
    setLoading(false);
  };

  const handleInputChange = (kpiName, val) => {
    setFormData(prev => ({
      ...prev,
      [kpiName]: val
    }));
    setIsSaved(false);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Convert empty fields to numbers or NIL if appropriate
    const processedMap = {};
    PERFORMANCE_KPIS_LIST.forEach(kpiName => {
      const val = formData[kpiName];
      if (val === '' || val === null || val === undefined) {
        processedMap[kpiName] = 0;
      } else {
        const num = parseFloat(val);
        processedMap[kpiName] = isNaN(num) ? val : num;
      }
    });

    const res = saveHodPerformanceKpiValues(hodScope.instCode, hodScope.deptCode, selectedYear, processedMap);
    setIsSaved(true);
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  // Group the KPIs into categories including experience brackets, student year-wise strength & new parameters
  const kpiGroups = [
    {
      title: "1. Student Intake & Department Overall Strength (Year-wise)",
      icon: GraduationCap,
      color: "border-l-4 border-l-brand-blue",
      items: [
        { name: "Students Sanctioned strength", type: "number", hint: "Approved annual capacity" },
        { name: "Total Students Admitted", type: "number", hint: "Total admitted students count for current intake" },
        { name: "Department Overall Strength (1st Year)", type: "number", hint: "1st Year enrolled student strength" },
        { name: "Department Overall Strength (2nd Year)", type: "number", hint: "2nd Year enrolled student strength" },
        { name: "Department Overall Strength (3rd Year)", type: "number", hint: "3rd Year enrolled student strength (UG)" },
        { name: "Department Overall Strength (4th Year)", type: "number", hint: "4th Year enrolled student strength (Engineering)" },
        { name: "Student Pass Percentage", type: "percentage", hint: "Pass percentage e.g. 98.5 or 0.98 (Target ≥90%)" },
        { name: "Placed Students Count", type: "number", hint: "Number of students campus placed (Target ≥70%)" },
        { name: "Higher studies Count", type: "number", hint: "Students pursuing higher education" },
        { name: "students undertaking field projects", type: "number", hint: "Students in field/internship projects" }
      ]
    },
    {
      title: "2. Faculty, Doctorate Strength & Vacancies",
      icon: Users,
      color: "border-l-4 border-l-amber-500",
      items: [
        { name: "Faculty Strength", type: "number", hint: "Total sanctioned teaching faculty" },
        { name: "Faculty student Ratio", type: "text", hint: "Target 1:20 Ratio (e.g. 1:18 or 18)" },
        { name: "Faculty with Ph.D.", type: "percentage", hint: "Faculty holding Ph.D. (Target ≥85%)" },
        { name: "Number of Faculty Guiding", type: "number", hint: "Faculty guiding research scholars (Target ≥3)" },
        { name: "Number of Vacancies for this Academic Year", type: "number", hint: "Faculty vacancies for this year (Target ≤2)" },
        { name: "Scholar Enrollment Count", type: "number", hint: "Research scholars enrolled (Target ≥5)" },
        { name: "% Faculty ≤ 8 yrs Exp", type: "percentage", hint: "Experience ≤8 years (Target 25-30%)" },
        { name: "% Faculty 9–15 yrs Exp", type: "percentage", hint: "Experience 9-15 years (Target 35-40%)" },
        { name: "% Faculty >15 yrs Exp", type: "percentage", hint: "Experience >15 years (Target 35-40%)" },
        { name: "PHD Scholars", type: "number", hint: "Ph.D. scholars currently enrolled" },
        { name: "Faculty Development Programmes (FDPs)", type: "number", hint: "FDPs organized or attended" }
      ]
    },
    {
      title: "3. Research, Publications & Patents",
      icon: BookOpen,
      color: "border-l-4 border-l-emerald-500",
      items: [
        { name: "Journal Publications", type: "number", hint: "Total journal papers published" },
        { name: "Indexed Journal Publications", type: "number", hint: "Scopus / Web of Science indexed" },
        { name: "Conferences", type: "number", hint: "Conference papers presented" },
        { name: "Books / Book Chapters", type: "number", hint: "Books or chapters published" },
        { name: "Patents", type: "number", hint: "Patents filed or granted" },
        { name: "MoUs with industry and institutions", type: "number", hint: "Active MoUs established" }
      ]
    },
    {
      title: "4. Grants, Courses & Awards",
      icon: Award,
      color: "border-l-4 border-l-purple-500",
      items: [
        { name: "Value-Added and Certificate Courses", type: "number", hint: "Value-added courses conducted" },
        { name: "Awards", type: "number", hint: "Faculty & department awards won" },
        { name: "Funding (Submitted)", type: "number", hint: "Research funding proposals submitted" },
        { name: "Funding (Granted)", type: "number", hint: "Research funding grants awarded" }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      
      {/* HEADER BANNER */}
      <div className="bg-[#121E31] rounded-2xl p-6 sm:p-8 shadow-md text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-extrabold bg-amber-400 text-brand-navy px-2.5 py-0.5 rounded-md uppercase tracking-widest">
              HOD Dedicated Feature
            </span>
            <span className="text-xs text-gray-300 font-bold">&bull; {hodScope.instCode}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
            Performance KPIs Form — {hodScope.displayName}
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 font-medium max-w-2xl">
            Annual Key Performance Indicators (KPIs) data entry for {hodScope.deptCode} Department. Only HOD login can submit and update this data.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
          <Calendar className="w-4 h-4 text-amber-400" />
          <div className="text-left">
            <label className="block text-[9px] font-bold text-gray-300 uppercase tracking-wider">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-brand-navy text-white font-extrabold py-1 px-2.5 rounded-lg text-xs outline-none border border-white/20 cursor-pointer"
            >
              {availableYears.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SUBMISSION NOTICE / STATUS BANNER */}
      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between text-emerald-900 shadow-sm animate-fade-in-down">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Performance KPIs Saved &amp; Published Successfully!</h4>
              <p className="text-xs text-emerald-700 font-medium">
                The 20 Performance KPIs for {hodScope.displayName} ({selectedYear}) have been recorded and are now active in IQAC Coordinator, Dean, and Chairman portals.
              </p>
            </div>
          </div>
          {lastSavedTime && (
            <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-lg">
              Saved at {lastSavedTime}
            </span>
          )}
        </div>
      )}

      {/* INSTRUCTIONS BADGE */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 text-xs text-brand-navy flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm">HOD Performance KPIs Entry Guidelines ({selectedYear})</p>
          <p className="text-gray-600 leading-relaxed">
            Fill in the values for each of the 20 Key Performance Indicators below for your department for <strong className="text-brand-navy">{selectedYear}</strong>. 
            Once saved, these indicators populate the executive matrix views for the IQAC Coordinator, Dean, and Chairman logins. You can update these values once per academic year or whenever revised metrics are available.
          </p>
        </div>
      </div>

      {/* FORM BODY */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-2xs space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-blue animate-spin mx-auto" />
          <p className="text-xs font-bold text-brand-navy">Loading {selectedYear} KPI Data for {hodScope.deptCode}...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmitForm} className="space-y-6">
          
          {/* 4 KPI CATEGORY CARDS */}
          {kpiGroups.map((group, gIdx) => {
            const GroupIcon = group.icon;
            return (
              <div key={gIdx} className={`bg-white rounded-2xl shadow-2xs border border-gray-200/80 p-6 space-y-4 ${group.color}`}>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-brand-navy flex items-center font-sans">
                    <GroupIcon className="w-5 h-5 mr-2 text-brand-blue" />
                    {group.title}
                  </h3>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded">
                    {group.items.length} Indicators
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.items.map((item, iIdx) => {
                    const kpiName = item.name;
                    const val = formData[kpiName] !== undefined ? formData[kpiName] : '';
                    const targetAnalysis = getKpiTargetAnalysis(kpiName, val, {
                      sanctioned: formData['Students Sanctioned strength'] || 100
                    });

                    return (
                      <div key={iIdx} className="space-y-1.5 bg-gray-50/60 p-3.5 rounded-xl border border-gray-200/60 hover:bg-white hover:shadow-2xs transition-all">
                        <div className="flex justify-between items-start">
                          <label className="block text-xs font-bold text-gray-800 font-sans leading-tight">
                            {kpiName}
                          </label>
                          {targetAnalysis.status !== 'neutral' && (
                            <span className={`text-[9px] px-2 py-0.5 rounded-full border ${targetAnalysis.badgeClass} flex-shrink-0 flex items-center font-extrabold shadow-2xs`}>
                              {targetAnalysis.text}
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type={item.type === 'number' ? 'number' : 'text'}
                            step="any"
                            value={val}
                            onChange={(e) => handleInputChange(kpiName, e.target.value)}
                            placeholder={`Enter ${kpiName}`}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-bold text-brand-navy focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-400 font-medium">{item.hint}</span>
                          {targetAnalysis.target && (
                            <span className="text-brand-blue font-bold">
                              Target: {targetAnalysis.target}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* FORM FOOTER ACTION BAR */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
            <div className="flex items-center space-x-2 text-xs text-gray-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Target Scope: <strong className="text-brand-navy">{hodScope.displayName}</strong> ({selectedYear})</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={loadDepartmentKpiForm}
                className="w-1/2 sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-50 transition-all cursor-pointer"
              >
                Reset Form
              </button>

              <button
                type="submit"
                className="w-1/2 sm:w-auto px-6 py-2.5 bg-brand-blue hover:bg-brand-navy text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save &amp; Submit Performance KPIs</span>
              </button>
            </div>
          </div>

        </form>
      )}

    </div>
  );
};

export default HodPerformanceKpis;
