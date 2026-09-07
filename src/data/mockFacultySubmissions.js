export const MOCK_FACULTY_SUBMISSIONS = [
  {
    id: 'sub_1',
    facultyId: 'fac_ent_01',
    facultyName: 'Dr. Rajesh Kumar',
    institution: 'E&T',
    department: 'CSE',
    academicYear: '2024-25',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'submitted',
    steps: [
      { stepNumber: 1, isCompleted: true, data: { research_papers: '3', citations: '15' } },
      { stepNumber: 2, isCompleted: true, data: { projects_completed: '1', grant_amount: '500000' } },
      { stepNumber: 3, isCompleted: true, data: { awards: 'Best Teacher Award 2024' } },
      { stepNumber: 4, isCompleted: true, data: { events_organized: '2' } },
      { stepNumber: 5, isCompleted: true, data: { phd_students_guided: '4' } },
      { stepNumber: 6, isCompleted: true, data: { consulting_revenue: '200000' } },
      { stepNumber: 7, isCompleted: true, data: { patents_filed: '1', patents_published: '1' } }
    ]
  },
  {
    id: 'sub_2',
    facultyId: 'fac_mgmt_01',
    facultyName: 'Prof. Kavitha Shankar',
    institution: 'Management',
    department: 'MBA',
    academicYear: '2024-25',
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    status: 'submitted',
    steps: [
      { stepNumber: 1, isCompleted: true, data: { research_papers: '2', citations: '8' } },
      { stepNumber: 2, isCompleted: true, data: { projects_completed: '0', grant_amount: '0' } },
      { stepNumber: 3, isCompleted: true, data: { awards: 'NIL' } },
      { stepNumber: 4, isCompleted: true, data: { events_organized: '1' } },
      { stepNumber: 5, isCompleted: true, data: { phd_students_guided: '2' } },
      { stepNumber: 6, isCompleted: true, data: { consulting_revenue: '50000' } },
      { stepNumber: 7, isCompleted: true, data: { patents_filed: '0', patents_published: '0' } }
    ]
  },
  {
    id: 'sub_3',
    facultyId: 'fac_flabs_bca',
    facultyName: 'Dr. Prakash Raj',
    institution: 'FLABS',
    department: 'BCA',
    academicYear: '2024-25',
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    status: 'submitted',
    steps: [
      { stepNumber: 1, isCompleted: true, data: { research_papers: '1', citations: '2' } },
      { stepNumber: 2, isCompleted: true, data: { projects_completed: '1', grant_amount: '100000' } },
      { stepNumber: 3, isCompleted: true, data: { awards: 'NIL' } },
      { stepNumber: 4, isCompleted: true, data: { events_organized: '3' } },
      { stepNumber: 5, isCompleted: true, data: { phd_students_guided: '0' } },
      { stepNumber: 6, isCompleted: true, data: { consulting_revenue: '0' } },
      { stepNumber: 7, isCompleted: true, data: { patents_filed: '0', patents_published: '0' } }
    ]
  },
  {
    id: 'sub_4',
    facultyId: 'fac_flabs_mca',
    facultyName: 'Prof. Meena Kumari',
    institution: 'FLABS',
    department: 'MCA',
    academicYear: '2024-25',
    submittedAt: new Date(Date.now() - 49 * 60 * 60 * 1000).toISOString(), // 49 hours ago (expired edit window)
    status: 'submitted',
    steps: [
      { stepNumber: 1, isCompleted: true, data: { research_papers: '4', citations: '20' } },
      { stepNumber: 2, isCompleted: true, data: { projects_completed: '2', grant_amount: '800000' } },
      { stepNumber: 3, isCompleted: true, data: { awards: 'Excellence in Research' } },
      { stepNumber: 4, isCompleted: true, data: { events_organized: '4' } },
      { stepNumber: 5, isCompleted: true, data: { phd_students_guided: '5' } },
      { stepNumber: 6, isCompleted: true, data: { consulting_revenue: '300000' } },
      { stepNumber: 7, isCompleted: true, data: { patents_filed: '2', patents_published: '1' } }
    ]
  }
];

const STORAGE_KEY = 'iqac_faculty_submissions_store';

export const getLiveFacultySubmissions = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse saved submissions', e);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_FACULTY_SUBMISSIONS));
  } catch (e) {}
  return MOCK_FACULTY_SUBMISSIONS;
};

export const updateFacultySubmission = (userOrId, updatedStepData, academicYear = '2024-25') => {
  const submissions = getLiveFacultySubmissions();
  const userName = typeof userOrId === 'object' ? (userOrId.full_name || userOrId.name || userOrId.username) : userOrId;
  const userInst = typeof userOrId === 'object' ? (userOrId.department_name || userOrId.group || 'FLABS') : 'FLABS';
  const userDept = typeof userOrId === 'object' ? (userOrId.department || userOrId.department_name || 'MCA') : 'MCA';

  let existingIndex = submissions.findIndex(s => 
    s.facultyId === userName || 
    (userName && s.facultyName && s.facultyName.toLowerCase() === userName.toLowerCase())
  );

  const nowIso = new Date().toISOString();

  if (existingIndex >= 0) {
    const existing = submissions[existingIndex];
    submissions[existingIndex] = {
      ...existing,
      submittedAt: nowIso,
      steps: updatedStepData || existing.steps
    };
  } else {
    submissions.push({
      id: `sub_${Date.now()}`,
      facultyId: userName,
      facultyName: userName,
      institution: userInst,
      department: userDept,
      academicYear: academicYear,
      submittedAt: nowIso,
      status: 'submitted',
      steps: updatedStepData || []
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    window.dispatchEvent(new Event('iqac_submissions_updated'));
  } catch (e) {
    console.error('Failed to save updated submission', e);
  }
  return submissions;
};

export const getFacultySubmissionStatus = (user) => {
  const submissions = getLiveFacultySubmissions();
  const username = user?.username || user?.id || '';
  const fullName = user?.full_name || user?.name || '';

  const sub = submissions.find(s => 
    (username && s.facultyId === username) || 
    (fullName && s.facultyName && s.facultyName.toLowerCase() === fullName.toLowerCase())
  );

  const key = `iqac_sub_time_5_${user?.id || user?.username || 'demo'}`;
  const localTimeStr = localStorage.getItem(key);

  const subTimeStr = sub?.submittedAt || localTimeStr;
  if (!subTimeStr) {
    return { isSubmitted: false, isLocked: false, hoursLeft: 48, hoursPassed: 0, submittedAt: null, submission: null };
  }

  const subTime = new Date(subTimeStr).getTime();
  const now = Date.now();
  const hoursPassed = (now - subTime) / (1000 * 60 * 60);

  if (hoursPassed >= 48) {
    return { isSubmitted: true, isLocked: true, hoursLeft: 0, hoursPassed, submittedAt: subTimeStr, submission: sub };
  }
  return { 
    isSubmitted: true, 
    isLocked: false, 
    hoursLeft: 48 - hoursPassed, 
    hoursPassed, 
    submittedAt: subTimeStr, 
    submission: sub 
  };
};

