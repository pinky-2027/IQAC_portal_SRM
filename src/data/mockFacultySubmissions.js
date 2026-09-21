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
      { 
        stepNumber: 1, 
        sheetName: 'Events',
        isCompleted: true, 
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        approvalStatus: 'GRANTED',
        hodComment: 'Approved for institutional compilation.',
        data: { 
          event_planned: 'International AI & ML Summit 2025',
          event_name: 'International AI & ML Summit 2025', 
          event_type: 'Conference',
          event_scope: 'International Level',
          actual_date: '2025-01-15',
          participant_count: '250',
          event_report_link: 'AI_Summit_Report_2025.pdf',
          proof_document: { fileName: 'AI_Summit_Approval_Proof.pdf', fileSize: '1.2 MB', fileType: 'application/pdf', uploadedAt: new Date().toISOString() }
        } 
      },
      { 
        stepNumber: 2, 
        sheetName: 'Research Papers',
        isCompleted: true, 
        submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        approvalStatus: 'PENDING',
        data: { research_papers: '3', citations: '15', proof_document: { fileName: 'IEEE_Paper_Proof.pdf', fileSize: '850 KB', fileType: 'application/pdf' } } 
      },
      { stepNumber: 3, sheetName: 'Funded Projects', isCompleted: true, approvalStatus: 'GRANTED', data: { projects_completed: '1', grant_amount: '500000' } },
      { stepNumber: 4, sheetName: 'Awards & Achievements', isCompleted: true, approvalStatus: 'PENDING', data: { awards: 'Best Teacher Award 2024' } },
      { stepNumber: 5, sheetName: 'Ph.D. Guidance', isCompleted: true, approvalStatus: 'GRANTED', data: { phd_students_guided: '4' } },
      { stepNumber: 6, sheetName: 'Consultancy & Revenue', isCompleted: true, approvalStatus: 'GRANTED', data: { consulting_revenue: '200000' } },
      { stepNumber: 7, sheetName: 'Patents & Publications', isCompleted: true, approvalStatus: 'GRANTED', data: { patents_filed: '1', patents_published: '1' } }
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
      { 
        stepNumber: 1, 
        sheetName: 'Events',
        isCompleted: true, 
        submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        approvalStatus: 'PENDING',
        data: { 
          event_planned: 'National Management Conclave',
          event_name: 'National Management Conclave',
          event_type: 'Symposium',
          event_scope: 'National Level',
          actual_date: '2024-11-20',
          participant_count: '120',
          proof_document: { fileName: 'Management_Conclave_Brochure.pdf', fileSize: '2.4 MB', fileType: 'application/pdf' }
        } 
      },
      { stepNumber: 2, sheetName: 'Research Papers', isCompleted: true, approvalStatus: 'GRANTED', data: { research_papers: '2', citations: '8' } },
      { stepNumber: 3, sheetName: 'Funded Projects', isCompleted: true, approvalStatus: 'PENDING', data: { projects_completed: '0', grant_amount: '0' } },
      { stepNumber: 4, sheetName: 'Awards & Achievements', isCompleted: true, approvalStatus: 'GRANTED', data: { awards: 'NIL' } },
      { stepNumber: 5, sheetName: 'Ph.D. Guidance', isCompleted: true, approvalStatus: 'GRANTED', data: { phd_students_guided: '2' } },
      { stepNumber: 6, sheetName: 'Consultancy & Revenue', isCompleted: true, approvalStatus: 'GRANTED', data: { consulting_revenue: '50000' } },
      { stepNumber: 7, sheetName: 'Patents & Publications', isCompleted: true, approvalStatus: 'GRANTED', data: { patents_filed: '0', patents_published: '0' } }
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
      { 
        stepNumber: 1, 
        sheetName: 'Events',
        isCompleted: true, 
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        approvalStatus: 'PENDING',
        hodComment: '',
        data: { 
          event_planned: 'State Level Web Dev Workshop',
          event_name: 'State Level Web Dev Workshop',
          event_type: 'Workshop',
          event_scope: 'State Level',
          actual_date: '2024-10-05',
          participant_count: '95',
          proof_document: { fileName: 'Workshop_Photos.jpg', fileSize: '1.1 MB', fileType: 'image/jpeg' }
        } 
      },
      { stepNumber: 2, sheetName: 'Research Papers', isCompleted: true, approvalStatus: 'PENDING', data: { research_papers: '1', citations: '2' } },
      { stepNumber: 3, sheetName: 'Funded Projects', isCompleted: true, approvalStatus: 'GRANTED', data: { projects_completed: '1', grant_amount: '100000' } },
      { stepNumber: 4, sheetName: 'Awards & Achievements', isCompleted: true, approvalStatus: 'GRANTED', data: { awards: 'NIL' } },
      { stepNumber: 5, sheetName: 'Ph.D. Guidance', isCompleted: true, approvalStatus: 'GRANTED', data: { phd_students_guided: '0' } },
      { stepNumber: 6, sheetName: 'Consultancy & Revenue', isCompleted: true, approvalStatus: 'GRANTED', data: { consulting_revenue: '0' } },
      { stepNumber: 7, sheetName: 'Patents & Publications', isCompleted: true, approvalStatus: 'GRANTED', data: { patents_filed: '0', patents_published: '0' } }
    ]
  },
  {
    id: 'sub_4',
    facultyId: 'fac_flabs_mca',
    facultyName: 'Prof. Meena Kumari',
    institution: 'FLABS',
    department: 'MCA',
    academicYear: '2024-25',
    submittedAt: new Date(Date.now() - 49 * 60 * 60 * 1000).toISOString(), // 49 hours ago
    status: 'submitted',
    steps: [
      { 
        stepNumber: 1, 
        sheetName: 'Events',
        isCompleted: true, 
        submittedAt: new Date(Date.now() - 49 * 60 * 60 * 1000).toISOString(),
        approvalStatus: 'GRANTED',
        data: { 
          event_planned: 'FDP on Cloud Computing & Security',
          event_name: 'FDP on Cloud Computing & Security',
          event_type: 'FDP',
          event_scope: 'National Level',
          actual_date: '2024-09-12',
          participant_count: '150',
          proof_document: { fileName: 'FDP_Completion_Certificate.pdf', fileSize: '1.8 MB', fileType: 'application/pdf' }
        } 
      },
      { stepNumber: 2, sheetName: 'Research Papers', isCompleted: true, approvalStatus: 'GRANTED', data: { research_papers: '4', citations: '20' } },
      { stepNumber: 3, sheetName: 'Funded Projects', isCompleted: true, approvalStatus: 'GRANTED', data: { projects_completed: '2', grant_amount: '800000' } },
      { stepNumber: 4, sheetName: 'Awards & Achievements', isCompleted: true, approvalStatus: 'GRANTED', data: { awards: 'Excellence in Research' } },
      { stepNumber: 5, sheetName: 'Ph.D. Guidance', isCompleted: true, approvalStatus: 'GRANTED', data: { phd_students_guided: '5' } },
      { stepNumber: 6, sheetName: 'Consultancy & Revenue', isCompleted: true, approvalStatus: 'GRANTED', data: { consulting_revenue: '300000' } },
      { stepNumber: 7, sheetName: 'Patents & Publications', isCompleted: true, approvalStatus: 'GRANTED', data: { patents_filed: '2', patents_published: '1' } }
    ]
  }
];

const STORAGE_KEY = 'iqac_faculty_submissions_store';
const NOTIFICATIONS_KEY = 'iqac_hod_notifications_store';

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

export const updateFacultySingleStepSubmission = (user, stepNumber, sheetName, stepFormData, academicYear = '2024-25') => {
  const submissions = getLiveFacultySubmissions();
  const userName = user?.full_name || user?.name || user?.username || 'Faculty Member';
  const userInst = user?.department_name || user?.group || 'FLABS';
  const userDept = user?.department || user?.department_name || 'MCA';

  let existingIndex = submissions.findIndex(s => 
    s.facultyId === userName || 
    (userName && s.facultyName && s.facultyName.toLowerCase() === userName.toLowerCase())
  );

  const nowIso = new Date().toISOString();

  if (existingIndex >= 0) {
    const existing = submissions[existingIndex];
    const existingSteps = [...(existing.steps || [])];
    const stepIdx = existingSteps.findIndex(s => s.stepNumber === Number(stepNumber));

    const updatedStepObj = {
      stepNumber: Number(stepNumber),
      sheetName: sheetName || `Step ${stepNumber}`,
      isCompleted: true,
      submittedAt: nowIso,
      approvalStatus: 'PENDING', // Submitting/resubmitting sends back to HOD review
      data: stepFormData
    };

    if (stepIdx >= 0) {
      existingSteps[stepIdx] = updatedStepObj;
    } else {
      existingSteps.push(updatedStepObj);
    }

    submissions[existingIndex] = {
      ...existing,
      submittedAt: nowIso,
      steps: existingSteps
    };
  } else {
    const newSteps = [
      {
        stepNumber: Number(stepNumber),
        sheetName: sheetName || `Step ${stepNumber}`,
        isCompleted: true,
        submittedAt: nowIso,
        approvalStatus: 'PENDING',
        data: stepFormData
      }
    ];

    submissions.push({
      id: `sub_${Date.now()}`,
      facultyId: userName,
      facultyName: userName,
      institution: userInst,
      department: userDept,
      academicYear: academicYear,
      submittedAt: nowIso,
      status: 'submitted',
      steps: newSteps
    });
  }

  // Add HOD Notification
  addHodNotification({
    id: `notif_${Date.now()}`,
    facultyName: userName,
    institution: userInst,
    department: userDept,
    stepNumber,
    sheetName: sheetName || `Step ${stepNumber}`,
    timestamp: nowIso,
    message: `${userName} (${userDept}) submitted a record for ${sheetName || `Step ${stepNumber}`}.`
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    window.dispatchEvent(new Event('iqac_submissions_updated'));
  } catch (e) {
    console.error('Failed to save updated submission', e);
  }
  return submissions;
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

export const updateStepApprovalStatus = (submissionId, stepNumber, newApprovalStatus, comment = '', reviewerUser = null) => {
  const submissions = getLiveFacultySubmissions();
  const index = submissions.findIndex(s => s.id === submissionId);
  if (index >= 0) {
    const sub = submissions[index];
    const steps = [...(sub.steps || [])];
    const stepIdx = steps.findIndex(st => st.stepNumber === Number(stepNumber));
    if (stepIdx >= 0) {
      steps[stepIdx] = {
        ...steps[stepIdx],
        approvalStatus: newApprovalStatus, // 'GRANTED' or 'DECLINED'
        hodComment: comment,
        reviewedBy: reviewerUser?.full_name || reviewerUser?.username || 'HOD',
        reviewedAt: new Date().toISOString()
      };
      submissions[index] = {
        ...sub,
        steps
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
        window.dispatchEvent(new Event('iqac_submissions_updated'));
      } catch (e) {}
    }
  }
  return submissions;
};

// HOD Notifications Management
export const getHodNotifications = () => {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [
    {
      id: 'notif_1',
      facultyName: 'Dr. Rajesh Kumar',
      institution: 'E&T',
      department: 'CSE',
      stepNumber: 1,
      sheetName: 'Events',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      message: 'Dr. Rajesh Kumar (CSE) submitted a new record for Events Organized.'
    },
    {
      id: 'notif_2',
      facultyName: 'Dr. Prakash Raj',
      institution: 'FLABS',
      department: 'BCA',
      stepNumber: 1,
      sheetName: 'Events',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      message: 'Dr. Prakash Raj (BCA) submitted a new record for Events Organized.'
    }
  ];
};

export const addHodNotification = (notifObj) => {
  const list = getHodNotifications();
  list.unshift(notifObj);
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('iqac_notifications_updated'));
  } catch (e) {}
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


