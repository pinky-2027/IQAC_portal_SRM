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

/**
 * Unified client KPI loader fallback
 */
export const getLegacyKpiClientData = (institution = 'FLABS', year = '2024-2025', department = null) => {
  const instUpper = (institution || '').toUpperCase().strip ? (institution || '').toUpperCase().strip() : (institution || '').toUpperCase();

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
    const records = MGMT_DEPARTMENT_DATA[deptKey] || [];
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
    const records = ET_DEPARTMENT_DATA[deptKey] || [];
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
    return {
      hasData: true,
      institution: 'FLABS',
      department: deptData.name || deptKey,
      available_departments: Object.keys(FLABS_DEPARTMENT_DATA),
      available_years: ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'],
      records: deptData.parameters
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
