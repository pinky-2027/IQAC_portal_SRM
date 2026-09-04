import { supabase } from '../supabaseClient';
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('iqac_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiService = {
  // Auth
  async login(username, password, departmentId = null) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, department_id: departmentId ? Number(departmentId) : null })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed');
    return data;
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Session expired');
    return await res.json();
  },

  // Institutions (formerly departments)
  async getInstitutions() {
    const res = await fetch(`${API_BASE_URL}/departments`);
    if (!res.ok) throw new Error('Failed to fetch institutions');
    return await res.json();
  },

  async getDepartments() {
    return this.getInstitutions();
  },

  async getAcademicYears() {
    const res = await fetch(`${API_BASE_URL}/academic-years`);
    if (!res.ok) throw new Error('Failed to fetch academic years');
    return await res.json();
  },

  async getTemplates() {
    const res = await fetch(`${API_BASE_URL}/templates`);
    if (!res.ok) throw new Error('Failed to fetch templates');
    return await res.json();
  },

  async getTemplateByStep(stepNumber) {
    const res = await fetch(`${API_BASE_URL}/templates/${stepNumber}`);
    if (!res.ok) throw new Error('Failed to fetch template schema');
    return await res.json();
  },

  // Faculty Workflow
  async getFacultyProgress(academicYearId) {
    const res = await fetch(`${API_BASE_URL}/faculty/progress?academic_year_id=${academicYearId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch progress');
    return await res.json();
  },

  async getFacultyStepSubmission(stepNumber, academicYearId) {
    const res = await fetch(`${API_BASE_URL}/faculty/submission/${stepNumber}?academic_year_id=${academicYearId}`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async saveFacultyStep(academicYearId, templateId, stepNumber, dataJson, isContinue = false) {
    const res = await fetch(`${API_BASE_URL}/faculty/save-step`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        academic_year_id: Number(academicYearId),
        template_id: Number(templateId),
        step_number: Number(stepNumber),
        data_json: dataJson,
        is_continue: isContinue
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to save template step');
    return data;
  },

  async submitAllFacultyTemplates(academicYearId) {
    const res = await fetch(`${API_BASE_URL}/faculty/submit-all?academic_year_id=${academicYearId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to submit templates');
    return data;
  },

  // HOD API
  async getHodSubmissions(academicYearId = null) {
    const url = academicYearId 
      ? `${API_BASE_URL}/hod/submissions?academic_year_id=${academicYearId}` 
      : `${API_BASE_URL}/hod/submissions`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch HOD institution submissions');
    return await res.json();
  },

  async getHodOverviewMatrix(academicYearId) {
    const res = await fetch(`${API_BASE_URL}/hod/overview-matrix?academic_year_id=${academicYearId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch HOD matrix');
    return await res.json();
  },

  // Admin API
  async getAdminDashboardStats(academicYearId = null) {
    const url = academicYearId 
      ? `${API_BASE_URL}/admin/dashboard-stats?academic_year_id=${academicYearId}` 
      : `${API_BASE_URL}/admin/dashboard-stats`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch admin dashboard stats');
    return await res.json();
  },

  async getAdminSubmissions(departmentId = null, academicYearId = null) {
    let query = [];
    if (departmentId) query.push(`department_id=${departmentId}`);
    if (academicYearId) query.push(`academic_year_id=${academicYearId}`);
    const qStr = query.length ? `?${query.join('&')}` : '';

    const res = await fetch(`${API_BASE_URL}/admin/submissions${qStr}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch submissions');
    return await res.json();
  },

  async getLegacyKpiData(institution = 'FLABS', year = '2024-2025', department = null) {
    let url = `${API_BASE_URL}/admin/kpi-data?institution=${encodeURIComponent(institution)}&year=${encodeURIComponent(year)}`;
    if (department) {
      url += `&department=${encodeURIComponent(department)}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch KPI data');
    return await res.json();
  }
};
