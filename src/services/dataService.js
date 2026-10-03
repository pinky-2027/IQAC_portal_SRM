import { supabase } from '../supabaseClient';
import { FLABS_DEPARTMENT_DATA } from '../data/iqacData';
import { MGMT_DEPARTMENT_DATA } from '../data/mgmtData';
import { ET_DEPARTMENT_DATA } from '../data/etData';
import { DEPARTMENTS } from '../config/departments';
import { ACADEMIC_YEARS } from '../config/academicYears';

export const getDepartments = () => {
  return DEPARTMENTS;
};

export const getAcademicYears = () => {
  return ACADEMIC_YEARS;
};

export const getFlabsDepartments = () => {
  return Object.values(FLABS_DEPARTMENT_DATA).map(d => ({
    code: d.code,
    name: d.name
  }));
};

/**
 * Checks whether an indicator represents a percentage metric.
 */
export const isPercentageIndicator = (indicator = '') => {
  if (!indicator) return false;
  const lower = String(indicator).toLowerCase();
  return (
    lower.includes('percentage') ||
    lower.includes('percent') ||
    lower.includes('%') ||
    lower.includes('mention in %')
  );
};

/**
 * Normalizes a raw percentage value to a 0–100 scale.
 * Handles:
 *  - null, undefined, '', 'NIL', 'NA', '-' -> returns null
 *  - numbers/strings on 0-1 scale (e.g. 0.98, 0.99, 1.0) -> scaled to (0.98 * 100) = 98.0
 *  - numbers/strings on 0-100 scale (e.g. 99.4, 98.3, 100) -> kept as 99.4
 *  - ensures result is capped at 100% max (0 to 100)
 */
export const normalizePercentageValue = (rawVal) => {
  if (
    rawVal === undefined ||
    rawVal === null ||
    rawVal === '' ||
    rawVal === 'NIL' ||
    rawVal === 'NA' ||
    rawVal === '-'
  ) {
    return null;
  }

  let num = typeof rawVal === 'number' ? rawVal : parseFloat(String(rawVal).replace('%', '').trim());
  if (isNaN(num)) return null;

  if (num > 0 && num <= 1) {
    num = num * 100;
  }

  num = Math.min(100, Math.max(0, num));
  return Number(num.toFixed(1));
};

/**
 * Formats an indicator value for display.
 * If percentage: formats normalized value as "98.6%" out of 100%.
 * If count/other: formats with locale string (e.g. "2,567").
 */
export const formatVal = (indicator = '', rawVal) => {
  if (
    rawVal === undefined ||
    rawVal === null ||
    rawVal === '' ||
    rawVal === 'NIL' ||
    rawVal === 'NA' ||
    rawVal === '-'
  ) {
    return 'NIL';
  }

  const isPct = isPercentageIndicator(indicator);

  if (isPct) {
    const norm = normalizePercentageValue(rawVal);
    if (norm === null) return 'NIL';
    return `${norm}%`;
  }

  if (typeof rawVal === 'number') {
    return rawVal.toLocaleString();
  }

  const parsed = parseFloat(rawVal);
  if (!isNaN(parsed) && String(parsed) === String(rawVal).trim()) {
    return parsed.toLocaleString();
  }

  return String(rawVal);
};

/**
 * Fetch KPI Data for FLABS / Management / E&T / B.Arch
 */
export const getKPIData = async (deptId = 'BCA', yearId = '2024-2025') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const deptKey = Object.keys(FLABS_DEPARTMENT_DATA).find(
        k => k.toLowerCase() === (deptId || '').toLowerCase()
      ) || 'BCA';

      const deptData = FLABS_DEPARTMENT_DATA[deptKey];
      if (deptData) {
        resolve({
          hasData: true,
          institution: 'FLABS',
          department: deptData.name,
          available_departments: Object.keys(FLABS_DEPARTMENT_DATA),
          records: deptData.parameters
        });
      } else {
        resolve({
          hasData: false,
          institution: 'FLABS',
          department: deptId,
          available_departments: Object.keys(FLABS_DEPARTMENT_DATA),
          records: []
        });
      }
    }, 150);
  });
};

export const getYearWiseKPI = async (kpiName, deptCode = 'BCA') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const deptData = FLABS_DEPARTMENT_DATA[deptCode] || FLABS_DEPARTMENT_DATA['BCA'];
      if (!deptData) return resolve([]);
      
      const kpiRow = deptData.parameters.find(p => p.indicator === kpiName);
      if (kpiRow && kpiRow.values) {
        resolve([
          { year: '2021-22', value: kpiRow.values['2021-2022'] },
          { year: '2022-23', value: kpiRow.values['2022-2023'] },
          { year: '2023-24', value: kpiRow.values['2023-2024'] },
          { year: '2024-25', value: kpiRow.values['2024-2025'] },
          { year: '2025-26', value: kpiRow.values['2025-2026'] }
        ]);
      } else {
        resolve([]);
      }
    }, 150);
  });
};

const renameIntakeIndicator = (records) => {
  if (!Array.isArray(records)) return [];
  return records.map(r => {
    if (r.indicator && (r.indicator.toLowerCase() === 'total intake' || r.indicator.toLowerCase() === 'intake' || r.indicator.toLowerCase().includes('total intake'))) {
      return { ...r, indicator: 'Total Students Admitted', originalIndicator: r.indicator };
    }
    return r;
  });
};

export const PERFORMANCE_KPIS_LIST = [
  "Students Sanctioned strength",
  "Total Students Admitted",
  "Department Overall Strength (1st Year)",
  "Department Overall Strength (2nd Year)",
  "Department Overall Strength (3rd Year)",
  "Department Overall Strength (4th Year)",
  "Faculty Strength",
  "Faculty student Ratio",
  "Faculty with Ph.D.",
  "Number of Faculty Guiding",
  "Number of Vacancies for this Academic Year",
  "Scholar Enrollment Count",
  "% Faculty ≤ 8 yrs Exp",
  "% Faculty 9–15 yrs Exp",
  "% Faculty >15 yrs Exp",
  "Student Pass Percentage",
  "Placed Students Count",
  "Higher studies Count",
  "students undertaking field projects",
  "MoUs with industry and institutions",
  "PHD Scholars",
  "Value-Added and Certificate Courses",
  "Awards",
  "Journal Publications",
  "Indexed Journal Publications",
  "Conferences",
  "Books / Book Chapters",
  "Patents",
  "Funding (Submitted)",
  "Funding (Granted)",
  "Faculty Development Programmes (FDPs)"
];

/**
 * Target Benchmark Definitions & Evaluator
 */
export const KPI_TARGET_BENCHMARKS = {
  "Students Sanctioned strength": { targetDisplay: "Base Capacity", isNeutral: true },
  "Total Intake": { targetDisplay: "≥ Sanctioned Capacity", ruleType: "intake_vs_sanctioned" },
  "Total Students Admitted": { targetDisplay: "≥ Sanctioned Capacity", ruleType: "intake_vs_sanctioned" },
  "Department Overall Strength (1st Year)": { targetDisplay: "1st Yr Strength", isNeutral: true },
  "Department Overall Strength (2nd Year)": { targetDisplay: "2nd Yr Strength", isNeutral: true },
  "Department Overall Strength (3rd Year)": { targetDisplay: "3rd Yr Strength", isNeutral: true },
  "Department Overall Strength (4th Year)": { targetDisplay: "4th Yr Strength", isNeutral: true },
  "Faculty Strength": { targetDisplay: "1:20 Ratio", ruleType: "faculty_ratio" },
  "Faculty student Ratio": { targetDisplay: "1:20 Ratio", ruleType: "faculty_ratio_direct" },
  "Faculty with Ph.D.": { targetDisplay: "≥ 85%", ruleType: "phd_percentage" },
  "Faculty with Ph.D": { targetDisplay: "≥ 85%", ruleType: "phd_percentage" },
  "Number of Faculty Guiding": { targetDisplay: "≥ 3 Guides", ruleType: "min_count", threshold: 3 },
  "Number of Vacancies for this Academic Year": { targetDisplay: "≤ 2 Vacancies", ruleType: "max_count", threshold: 2 },
  "Scholar Enrollment Count": { targetDisplay: "≥ 5 Scholars", ruleType: "min_count", threshold: 5 },
  "% Faculty ≤ 8 yrs Exp": { targetDisplay: "25–30%", ruleType: "range_percentage", min: 25, max: 30 },
  "% Faculty 9–15 yrs Exp": { targetDisplay: "35–40%", ruleType: "range_percentage", min: 35, max: 40 },
  "% Faculty >15 yrs Exp": { targetDisplay: "35–40%", ruleType: "range_percentage", min: 35, max: 40 },
  "Student Pass Percentage": { targetDisplay: "≥ 90%", ruleType: "min_percentage", threshold: 90 },
  "Placed Students Count": { targetDisplay: "≥ 70%", ruleType: "min_percentage", threshold: 70 },
  "Higher studies Count": { targetDisplay: "≥ 15%", ruleType: "min_percentage", threshold: 15 },
  "students undertaking field projects": { targetDisplay: "≥ 10%", ruleType: "min_percentage", threshold: 10 },
  "students undertaking field projects(Mention in %)": { targetDisplay: "≥ 10%", ruleType: "min_percentage", threshold: 10 },
  "MoUs with industry and institutions": { targetDisplay: "≥ 5 Active MoUs", ruleType: "min_count", threshold: 5 },
  "PHD Scholars": { targetDisplay: "≥ 5 Scholars", ruleType: "min_count", threshold: 5 },
  "Value-Added and Certificate Courses": { targetDisplay: "≥ 3 Courses", ruleType: "min_count", threshold: 3 },
  "Awards": { targetDisplay: "≥ 2 Awards", ruleType: "min_count", threshold: 2 },
  "Journal Publications": { targetDisplay: "≥ 10 Papers", ruleType: "min_count", threshold: 10 },
  "Indexed Journal Publications": { targetDisplay: "≥ 60%", ruleType: "min_percentage", threshold: 60 },
  "Conferences": { targetDisplay: "≥ 5 Conferences", ruleType: "min_count", threshold: 5 },
  "Books / Book Chapters": { targetDisplay: "≥ 3 Chapters", ruleType: "min_count", threshold: 3 },
  "Patents": { targetDisplay: "≥ 1 Patent", ruleType: "min_count", threshold: 1 },
  "Funding (Submitted)": { targetDisplay: "≥ 5 Projects", ruleType: "min_count", threshold: 5 },
  "Funding (Granted)": { targetDisplay: "≥ 2 Grants", ruleType: "min_count", threshold: 2 },
  "Faculty Development Programmes (FDPs)": { targetDisplay: "≥ 4 FDPs", ruleType: "min_count", threshold: 4 }
};

export const getKpiTargetAnalysis = (indicatorName = '', rawVal = null, extraContext = {}) => {
  if (!indicatorName) {
    return { status: 'neutral', text: 'Base Metric', badgeClass: 'bg-gray-100 text-gray-700 border-gray-200' };
  }

  const matchedKey = Object.keys(KPI_TARGET_BENCHMARKS).find(
    k => k.toLowerCase() === indicatorName.toLowerCase() || indicatorName.toLowerCase().includes(k.toLowerCase())
  );

  const benchmark = matchedKey ? KPI_TARGET_BENCHMARKS[matchedKey] : null;

  if (!benchmark || benchmark.isNeutral) {
    return {
      status: 'neutral',
      text: 'Base Capacity',
      target: benchmark?.targetDisplay || 'Baseline',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      pillClass: 'bg-slate-100 text-slate-700'
    };
  }

  if (rawVal === undefined || rawVal === null || rawVal === '' || rawVal === 'NIL' || rawVal === 'NA' || rawVal === '-') {
    return {
      status: 'pending',
      text: 'Target Pending ⚠️',
      target: benchmark.targetDisplay,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
      pillClass: 'bg-rose-500 text-white font-extrabold shadow-2xs',
      isAchieved: false
    };
  }

  const { ruleType, threshold, min, max, targetDisplay } = benchmark;
  let isAchieved = false;
  let numericVal = 0;

  if (typeof rawVal === 'number') {
    numericVal = rawVal;
  } else {
    const parsed = parseFloat(String(rawVal).replace('%', '').trim());
    numericVal = isNaN(parsed) ? 0 : parsed;
  }

  if (ruleType === 'intake_vs_sanctioned') {
    const sanctioned = extraContext.sanctioned || 100;
    isAchieved = numericVal >= sanctioned;
  } else if (ruleType === 'faculty_ratio_direct' || ruleType === 'faculty_ratio') {
    if (typeof rawVal === 'string' && rawVal.includes(':')) {
      const parts = rawVal.split(':');
      const ratioNum = parseFloat(parts[1]);
      isAchieved = !isNaN(ratioNum) && ratioNum <= 20;
    } else {
      isAchieved = numericVal <= 20 && numericVal > 0;
    }
  } else if (ruleType === 'phd_percentage') {
    const norm = normalizePercentageValue(rawVal);
    isAchieved = (norm !== null && norm >= 85) || numericVal >= 85;
  } else if (ruleType === 'range_percentage') {
    const norm = normalizePercentageValue(rawVal);
    const valCheck = norm !== null ? norm : numericVal;
    isAchieved = valCheck >= min && valCheck <= max;
  } else if (ruleType === 'min_percentage') {
    const norm = normalizePercentageValue(rawVal);
    const valCheck = norm !== null ? norm : numericVal;
    isAchieved = valCheck >= threshold;
  } else if (ruleType === 'min_count') {
    isAchieved = numericVal >= threshold;
  } else if (ruleType === 'max_count') {
    isAchieved = numericVal <= threshold;
  }

  if (isAchieved) {
    return {
      status: 'achieved',
      text: 'Target Achieved ✓',
      target: targetDisplay,
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold',
      pillClass: 'bg-emerald-500 text-white font-extrabold shadow-2xs',
      isAchieved: true
    };
  } else {
    return {
      status: 'pending',
      text: 'Target Pending ⚠️',
      target: targetDisplay,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
      pillClass: 'bg-rose-500 text-white font-extrabold shadow-2xs',
      isAchieved: false
    };
  }
};

const STORAGE_KEY = 'iqac_hod_performance_kpis_submissions';

export const getStoredKpiSubmissions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveHodPerformanceKpiValues = (instCode, deptCode, year, kpiValuesObj) => {
  const store = getStoredKpiSubmissions();
  const instKey = (instCode || 'FLABS').toUpperCase();
  const deptKey = (deptCode || 'BCA').toUpperCase();
  const key = `${instKey}_${deptKey}_${year}`;
  
  store[key] = {
    instCode: instKey,
    deptCode: deptKey,
    year,
    updatedAt: new Date().toISOString(),
    values: kpiValuesObj
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event('storage'));
  return store[key];
};

export const getHodPerformanceKpiValues = (instCode, deptCode, year) => {
  const store = getStoredKpiSubmissions();
  const instKey = (instCode || 'FLABS').toUpperCase();
  const deptKey = (deptCode || 'BCA').toUpperCase();
  const key = `${instKey}_${deptKey}_${year}`;
  return store[key]?.values || null;
};

/**
 * Merge custom HOD submissions into a records array for a department
 */
const mergeHodCustomSubmissions = (records, institution, department) => {
  if (!Array.isArray(records)) return [];
  const years = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026', '2026-2027'];
  const store = getStoredKpiSubmissions();
  const instKey = (institution || 'FLABS').toUpperCase();
  const deptKey = (department || 'BCA').toUpperCase();

  // Make deep copy of records
  const mergedRecords = records.map(r => ({
    ...r,
    values: r.values ? { ...r.values } : {}
  }));

  years.forEach(yr => {
    const key = `${instKey}_${deptKey}_${yr}`;
    if (store[key] && store[key].values) {
      const customVals = store[key].values;
      Object.keys(customVals).forEach(indName => {
        let rec = mergedRecords.find(r => r.indicator && r.indicator.toLowerCase() === indName.toLowerCase());
        if (!rec) {
          rec = { indicator: indName, values: {} };
          mergedRecords.push(rec);
        }
        if (!rec.values) rec.values = {};
        rec.values[yr] = customVals[indName];
      });
    }
  });

  return mergedRecords;
};

/**
 * Unified client KPI loader fallback
 */
export const getLegacyKpiClientData = (institution = 'FLABS', year = '2024-2025', department = null) => {
  const instUpper = (institution || '').toUpperCase();

  if (instUpper === 'BARCH' || instUpper === 'SEAD' || instUpper === 'ARCHITECTURE') {
    return {
      hasData: false,
      isPending: true,
      institution: 'B.Arch',
      department: 'B.Arch',
      available_departments: [],
      message: 'Data is yet to be received for B.Arch Institution.'
    };
  }

  if (instUpper === 'MANAGEMENT' || instUpper === 'FOM' || instUpper === 'MGMT') {
    const deptKey = (department || 'MBA').toUpperCase();
    let records = renameIntakeIndicator(MGMT_DEPARTMENT_DATA[deptKey] || []);
    records = mergeHodCustomSubmissions(records, instUpper, deptKey);
    return {
      hasData: records.length > 0,
      institution: 'Management',
      department: deptKey,
      available_departments: Object.keys(MGMT_DEPARTMENT_DATA),
      available_years: ['2023-2024', '2024-2025', '2025-2026'],
      records: records
    };
  }

  if (instUpper === 'ET' || instUpper === 'E&T' || instUpper === 'FET' || instUpper === 'ENGINEERING') {
    const deptKey = (department || 'CSE').toUpperCase();
    let records = renameIntakeIndicator(ET_DEPARTMENT_DATA[deptKey] || []);
    records = mergeHodCustomSubmissions(records, instUpper, deptKey);
    return {
      hasData: records.length > 0,
      institution: 'E&T',
      department: deptKey,
      available_departments: Object.keys(ET_DEPARTMENT_DATA),
      available_years: ['2023-2024', '2024-2025', '2025-2026'],
      records: records
    };
  }

  // FLABS
  const deptKey = Object.keys(FLABS_DEPARTMENT_DATA).find(
    k => k.toLowerCase() === (department || 'BCA').toLowerCase()
  ) || 'BCA';
  const deptData = FLABS_DEPARTMENT_DATA[deptKey];
  if (deptData) {
    let records = renameIntakeIndicator(deptData.parameters);
    records = mergeHodCustomSubmissions(records, 'FLABS', deptKey);
    return {
      hasData: true,
      institution: 'FLABS',
      department: deptData.name || deptKey,
      available_departments: Object.keys(FLABS_DEPARTMENT_DATA),
      available_years: ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026', '2026-2027'],
      records: records
    };
  }

  return {
    hasData: false,
    institution: 'FLABS',
    department: department,
    available_departments: Object.keys(FLABS_DEPARTMENT_DATA),
    records: []
  };
};

const findMatchingParam = (dParams, baseIndicator) => {
  if (!Array.isArray(dParams)) return null;
  const baseLower = (baseIndicator || '').toLowerCase();
  
  let match = dParams.find(p => p.indicator && p.indicator.toLowerCase() === baseLower);
  if (match) return match;

  if (baseLower.includes('intake') || baseLower.includes('admitted')) {
    match = dParams.find(p => p.indicator && (p.indicator.toLowerCase().includes('intake') || p.indicator.toLowerCase().includes('admitted')));
    if (match) return match;
  }

  if (baseLower.includes('sanctioned')) {
    match = dParams.find(p => p.indicator && p.indicator.toLowerCase().includes('sanctioned'));
    if (match) return match;
  }

  if (baseLower.includes('faculty strength')) {
    match = dParams.find(p => p.indicator && p.indicator.toLowerCase().includes('faculty strength'));
    if (match) return match;
  }

  if (baseLower.includes('pass percentage')) {
    match = dParams.find(p => p.indicator && p.indicator.toLowerCase().includes('pass percentage'));
    if (match) return match;
  }

  if (baseLower.includes('placed')) {
    match = dParams.find(p => p.indicator && p.indicator.toLowerCase().includes('placed'));
    if (match) return match;
  }

  return null;
};

/**
 * Calculate total institution overview (Sum for counts, Mean/Average for percentages across all departments in an institution)
 */
export const getInstitutionalOverviewData = (institution = 'ET', year = '2025-2026') => {
  const instUpper = (institution || '').toUpperCase();

  if (instUpper === 'BARCH' || instUpper === 'SEAD' || instUpper === 'ARCHITECTURE') {
    return {
      hasData: false,
      isPending: true,
      institution: 'B.Arch',
      department: 'Institutional Overview',
      message: 'Data is yet to be received for B.Arch Institution.'
    };
  }

  let deptDataObject = null;
  let instName = 'E&T';

  if (instUpper === 'MANAGEMENT' || instUpper === 'FOM' || instUpper === 'MGMT') {
    deptDataObject = MGMT_DEPARTMENT_DATA;
    instName = 'Management';
  } else if (instUpper === 'ET' || instUpper === 'E&T' || instUpper === 'FET' || instUpper === 'ENGINEERING') {
    deptDataObject = ET_DEPARTMENT_DATA;
    instName = 'E&T';
  } else {
    // FLABS
    instName = 'FLABS';
    const flabsObj = {};
    Object.keys(FLABS_DEPARTMENT_DATA).forEach(k => {
      flabsObj[k] = FLABS_DEPARTMENT_DATA[k].parameters;
    });
    deptDataObject = flabsObj;
  }

  if (!deptDataObject) {
    return { hasData: false, institution: instName, department: 'Institutional Overview', records: [] };
  }

  const deptKeys = Object.keys(deptDataObject);
  if (deptKeys.length === 0) {
    return { hasData: false, institution: instName, department: 'Institutional Overview', records: [] };
  }

  const firstDeptParams = Array.isArray(deptDataObject[deptKeys[0]])
    ? deptDataObject[deptKeys[0]]
    : deptDataObject[deptKeys[0]]?.parameters || [];

  const availableYears = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026', '2026-2027'];

  const overviewRecords = firstDeptParams.map(baseParam => {
    if (baseParam.section) {
      return { section: baseParam.section };
    }

    let indicatorName = baseParam.indicator;
    if (indicatorName.toLowerCase() === 'total intake' || indicatorName.toLowerCase() === 'intake' || indicatorName.toLowerCase().includes('total intake')) {
      indicatorName = 'Total Students Admitted';
    }

    const isPct = isPercentageIndicator(baseParam.indicator);

    const yearSums = {};
    const yearBreakdowns = {};

    availableYears.forEach(yr => {
      let sum = 0;
      let validCount = 0;
      const breakdown = [];

      deptKeys.forEach(dk => {
        const dParams = Array.isArray(deptDataObject[dk])
          ? deptDataObject[dk]
          : deptDataObject[dk]?.parameters || [];

        const matchP = findMatchingParam(dParams, baseParam.indicator);

        if (matchP) {
          const rawVal = matchP.values ? matchP.values[yr] : matchP[yr];
          if (isPct) {
            const normVal = normalizePercentageValue(rawVal);
            if (normVal !== null) {
              sum += normVal;
              validCount++;
              breakdown.push({ department: dk, value: normVal });
            } else {
              breakdown.push({ department: dk, value: 'NIL' });
            }
          } else {
            let numVal = 0;
            if (typeof rawVal === 'number') {
              numVal = rawVal;
            } else if (typeof rawVal === 'string') {
              const parsed = parseFloat(rawVal);
              numVal = isNaN(parsed) ? 0 : parsed;
            }
            sum += numVal;
            if (numVal > 0) validCount++;
            breakdown.push({ department: dk, value: numVal });
          }
        } else {
          breakdown.push({ department: dk, value: isPct ? 'NIL' : 0 });
        }
      });

      if (isPct) {
        // Calculate the mathematical mean / average of all valid department percentages
        const avg = validCount > 0 ? Number((sum / validCount).toFixed(1)) : 0;
        yearSums[yr] = avg;
      } else {
        yearSums[yr] = Math.round(sum);
      }
      yearBreakdowns[yr] = breakdown;
    });

    // Generate multi-year department matrix for Level 3 Details Page
    const departmentMatrix = deptKeys.map(dk => {
      const dParams = Array.isArray(deptDataObject[dk])
        ? deptDataObject[dk]
        : deptDataObject[dk]?.parameters || [];

      const matchP = findMatchingParam(dParams, baseParam.indicator);

      const yearsObj = {};
      availableYears.forEach(yr => {
        if (matchP) {
          const rawVal = matchP.values ? matchP.values[yr] : matchP[yr];
          if (isPct) {
            const normVal = normalizePercentageValue(rawVal);
            yearsObj[yr] = normVal !== null ? normVal : 'NIL';
          } else {
            let numVal = 0;
            if (typeof rawVal === 'number') {
              numVal = rawVal;
            } else if (typeof rawVal === 'string') {
              const parsed = parseFloat(rawVal);
              numVal = isNaN(parsed) ? 0 : parsed;
            }
            yearsObj[yr] = numVal;
          }
        } else {
          yearsObj[yr] = isPct ? 'NIL' : 0;
        }
      });

      return {
        department: dk,
        years: yearsObj
      };
    });

    return {
      indicator: indicatorName,
      originalIndicator: baseParam.indicator,
      isPercentage: isPct,
      values: yearSums,
      breakdown: yearBreakdowns,
      departmentMatrix: departmentMatrix
    };
  });

  return {
    hasData: true,
    isOverview: true,
    institution: instName,
    department: 'All Departments (Institutional Overview)',
    available_departments: deptKeys,
    records: overviewRecords
  };
};
