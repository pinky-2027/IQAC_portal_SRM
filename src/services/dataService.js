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
    const records = renameIntakeIndicator(MGMT_DEPARTMENT_DATA[deptKey] || []);
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
    const records = renameIntakeIndicator(ET_DEPARTMENT_DATA[deptKey] || []);
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
    const records = renameIntakeIndicator(deptData.parameters);
    return {
      hasData: true,
      institution: 'FLABS',
      department: deptData.name || deptKey,
      available_departments: Object.keys(FLABS_DEPARTMENT_DATA),
      available_years: ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'],
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
 * Calculate total institution overview (Sum across all departments in an institution)
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

  const availableYears = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];

  const overviewRecords = firstDeptParams.map(baseParam => {
    if (baseParam.section) {
      return { section: baseParam.section };
    }

    let indicatorName = baseParam.indicator;
    if (indicatorName.toLowerCase() === 'total intake' || indicatorName.toLowerCase() === 'intake' || indicatorName.toLowerCase().includes('total intake')) {
      indicatorName = 'Total Students Admitted';
    }

    const yearSums = {};
    const yearBreakdowns = {};

    availableYears.forEach(yr => {
      let sum = 0;
      let count = 0;
      const breakdown = [];

      deptKeys.forEach(dk => {
        const dParams = Array.isArray(deptDataObject[dk])
          ? deptDataObject[dk]
          : deptDataObject[dk]?.parameters || [];

        const matchP = findMatchingParam(dParams, baseParam.indicator);

        if (matchP) {
          const val = matchP.values ? matchP.values[yr] : matchP[yr];
          let numVal = 0;
          if (typeof val === 'number') {
            numVal = val;
          } else if (typeof val === 'string') {
            const parsed = parseFloat(val);
            numVal = isNaN(parsed) ? 0 : parsed;
          }
          sum += numVal;
          if (numVal > 0) count++;
          breakdown.push({ department: dk, value: numVal });
        } else {
          breakdown.push({ department: dk, value: 0 });
        }
      });

      if (baseParam.indicator.toLowerCase().includes('percentage')) {
        const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;
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
          const val = matchP.values ? matchP.values[yr] : matchP[yr];
          let numVal = 0;
          if (typeof val === 'number') {
            numVal = val;
          } else if (typeof val === 'string') {
            const parsed = parseFloat(val);
            numVal = isNaN(parsed) ? 0 : parsed;
          }
          yearsObj[yr] = numVal;
        } else {
          yearsObj[yr] = 0;
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
