import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { 
  MOCK_FACULTY_SUBMISSIONS, getLiveFacultySubmissions, updateStepApprovalStatus, 
  getHodNotifications 
} from '../data/mockFacultySubmissions';
import { 
  Users, Filter, Calendar, Clock, Building, Bookmark, ChevronDown, ChevronRight, 
  CheckCircle2, Eye, EyeOff, Table, Bell, Check, Paperclip, FileText, ShieldCheck, Download
} from 'lucide-react';

const INSTITUTIONS = ['E&T', 'FLABS', 'Management', 'B.Arch'];

const DEPARTMENTS = {
  'E&T': ['CSE', 'AIML', 'BDA&CC', 'IoT & CSBS', 'CSE-CS', 'CSE-GT', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Biotechnology', 'BME', 'Mathematics', 'Physics', 'Chemistry', 'EFL'],
  'FLABS': ['Commerce', 'BCA', 'Data Science', 'B.Sc Cyber Security', 'B.Sc Computer Science', 'B.Sc. (AI & ML)', 'MCA', 'Viscom', 'Film Tech', 'Fashion Designing', 'JMC', 'LCS (English)', 'LCS (Tamil)', 'Biotechnology', 'Psychology', 'Mathematics', 'Physics', 'Chemistry', 'Economics', 'English'],
  'Management': ['BBA', 'MBA'],
  'B.Arch': ['Architecture']
};

const FacultySubmissionsView = () => {
  const { user } = useAuth();
  const location = useLocation();
  const roleUpper = (user?.role || '').toUpperCase();
  
  const isHod = roleUpper === 'HOD';
  const isIqac = roleUpper === 'ADMIN' || roleUpper === 'IQAC_COORDINATOR';
  const isChairman = roleUpper === 'CHAIRMAN';
  const isDean = roleUpper === 'DEAN' || roleUpper === 'COLLEGE_DEAN';

  const [submissionsList, setSubmissionsList] = useState(() => getLiveFacultySubmissions());
  const [notifications, setNotifications] = useState(() => getHodNotifications());
  const [selectedInst, setSelectedInst] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [expandedSubId, setExpandedSubId] = useState(null);
  
  // Document preview modal state
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setSubmissionsList(getLiveFacultySubmissions());
      setNotifications(getHodNotifications());
    };
    window.addEventListener('iqac_submissions_updated', handleUpdate);
    window.addEventListener('iqac_notifications_updated', handleUpdate);
    return () => {
      window.removeEventListener('iqac_submissions_updated', handleUpdate);
      window.removeEventListener('iqac_notifications_updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const userGroup = user?.group || '';
    const userDept = user?.department || user?.department_name || '';

    if (isHod) {
      if (userGroup) setSelectedInst(userGroup);
      if (userDept) setSelectedDept(userDept);
    } else if (isDean || (roleUpper === 'ADMIN' && userGroup)) {
      if (userGroup) setSelectedInst(userGroup);
    } else if (location.state?.institution) {
      setSelectedInst(location.state.institution);
      if (!isChairman && location.state?.department) setSelectedDept(location.state.department);
    }
  }, [user, roleUpper, location.state, isHod, isDean, isChairman]);

  // Filter submissions
  const filteredSubmissions = submissionsList.filter(sub => {
    const userInst = user?.group || selectedInst;
    const userDept = user?.department || user?.department_name || selectedDept;

    if (isHod) {
      if (userInst && sub.institution.toUpperCase() !== userInst.toUpperCase()) return false;
      if (userDept && sub.department.toUpperCase() !== userDept.toUpperCase()) return false;
      return true;
    }

    if (isDean) {
      const targetInst = user?.group || selectedInst;
      if (targetInst && sub.institution.toUpperCase() !== targetInst.toUpperCase()) return false;
      return true;
    }

    if (isChairman) {
      if (selectedInst && sub.institution.toUpperCase() !== selectedInst.toUpperCase()) return false;
      return true;
    }
    
    const targetInst = selectedInst || user?.group || '';
    if (targetInst && sub.institution.toUpperCase() !== targetInst.toUpperCase()) return false;
    if (selectedDept && sub.department.toUpperCase() !== selectedDept.toUpperCase()) return false;
    return true;
  });

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const toggleDetails = (id) => {
    setExpandedSubId(prev => prev === id ? null : id);
  };

  const handleGrantApproval = (subId, stepNumber) => {
    updateStepApprovalStatus(subId, stepNumber, 'GRANTED', 'Approved by HOD', user);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-blue rounded-xl p-5 shadow-2xs text-white">
        <div className="flex items-center space-x-2 text-brand-gold font-bold text-[10px] uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>Faculty Reports & Approval Portal</span>
        </div>
        <h2 className="text-xl font-bold">Faculty Data Submissions</h2>
        <p className="text-blue-100 text-xs mt-0.5">
          {isHod 
            ? 'Review and grant approval for faculty category records.' 
            : isIqac
            ? 'Detailed view of faculty data submissions & HOD approval status.'
            : isChairman
            ? 'Chairman overall summary view of faculty submissions across institutions.'
            : 'Dean overall summary view of faculty data submissions.'}
        </p>
      </div>

      {/* HOD NOTIFICATIONS PANEL (FOR HOD LOGINS) */}
      {isHod && notifications.length > 0 && (
        <div className="bg-amber-50/90 rounded-xl border border-amber-200 p-4 shadow-2xs">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs mb-2">
            <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>HOD Submission Notifications ({notifications.length})</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
            {notifications.map((notif) => (
              <div key={notif.id} className="bg-white p-2.5 rounded-lg border border-amber-100 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
                  <span className="font-semibold text-gray-800">{notif.message}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap ml-2">
                  {formatDate(notif.timestamp)} {formatTime(notif.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-4 h-4 text-brand-blue" />
          <h3 className="text-sm font-bold text-brand-navy">Filter Submissions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Institution Dropdown (For Chairman or Global Admin) */}
          {(isChairman || (roleUpper === 'ADMIN' && !user?.group)) && (
            <div>
              <label className="block text-[11px] font-bold text-brand-navy uppercase tracking-wider mb-1">
                Institution
              </label>
              <div className="relative">
                <select
                  value={selectedInst}
                  onChange={(e) => { setSelectedInst(e.target.value); }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-brand-text font-medium text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none cursor-pointer"
                >
                  <option value="">All Institutions</option>
                  {INSTITUTIONS.map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Department Dropdown (Only for IQAC Coordinator, NOT for Chairman or Dean) */}
          {isIqac && !isChairman && !isDean && (
            <div>
              <label className="block text-[11px] font-bold text-brand-navy uppercase tracking-wider mb-1">
                Department
              </label>
              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-brand-text font-medium text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {((selectedInst || user?.group) ? DEPARTMENTS[selectedInst || user?.group] : []).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Read-only scope badge for Dean */}
          {isDean && (
             <div className="flex space-x-3">
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 flex items-center space-x-2">
                   <Building className="w-4 h-4 text-blue-600" />
                   <span className="text-xs font-bold text-blue-900">{user?.group || selectedInst || 'Institution Scope'}</span>
                </div>
             </div>
          )}
          
          {/* Read-only badges for HOD */}
          {isHod && (
             <div className="flex space-x-3">
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 flex items-center space-x-2">
                   <Building className="w-4 h-4 text-blue-600" />
                   <span className="text-xs font-bold text-blue-900">{user?.group || 'Institution'}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2 flex items-center space-x-2">
                   <Bookmark className="w-4 h-4 text-emerald-600" />
                   <span className="text-xs font-bold text-emerald-900">{user?.department || user?.department_name || 'Department'}</span>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-gray-200 shadow-2xs">
             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-gray-400" />
             </div>
             <p className="text-sm font-bold text-gray-600">No submissions found</p>
             <p className="text-xs text-gray-400 mt-1">Adjust filters or check back later.</p>
          </div>
        ) : (
          filteredSubmissions.map(sub => {
            const isExpanded = expandedSubId === sub.id;
            const grantedCount = sub.steps?.filter(s => s.approvalStatus === 'GRANTED').length || 0;
            const totalSteps = sub.steps?.length || 7;
            
            return (
              <div key={sub.id} className={`bg-white rounded-xl shadow-2xs border transition-all duration-200 overflow-hidden ${isExpanded ? 'border-brand-blue ring-1 ring-brand-blue/30' : 'border-gray-200'}`}>
                 <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Faculty Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                         <h4 className="text-sm font-bold text-brand-navy">{sub.facultyName}</h4>
                         
                         {/* Status Badge */}
                         {grantedCount === totalSteps ? (
                           <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold flex items-center border border-emerald-200">
                             <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> HOD & IQAC Approved
                           </span>
                         ) : (
                           <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold flex items-center border border-amber-200">
                             <Clock className="w-3 h-3 mr-1 text-amber-600" /> Granted: {grantedCount}/{totalSteps} Categories
                           </span>
                         )}
                      </div>

                      <p className="text-xs text-brand-muted mt-1 flex items-center space-x-2 font-medium">
                         <Building className="w-3.5 h-3.5 text-gray-400" />
                         <span>{sub.institution}</span>
                         <span className="text-gray-300">•</span>
                         <span className="text-brand-blue">{sub.department}</span>
                         <span className="text-gray-300">•</span>
                         <span className="text-gray-500 font-mono text-[11px]">{sub.academicYear || '2025-26'}</span>
                      </p>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                       <div className="flex space-x-4 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                             <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                             <span className="font-medium">{formatDate(sub.submittedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                             <Clock className="w-3.5 h-3.5 text-brand-blue" />
                             <span className="font-medium">{formatTime(sub.submittedAt)}</span>
                          </div>
                       </div>
                       
                       <button
                         onClick={() => toggleDetails(sub.id)}
                         className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                           isExpanded 
                             ? 'bg-gray-100 text-brand-navy hover:bg-gray-200' 
                             : 'bg-brand-navy text-white hover:bg-brand-blue shadow-md hover:shadow-lg'
                         }`}
                       >
                         {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                         <span>{isExpanded ? 'Hide Details' : (isHod || isIqac ? 'View Details & Grant' : 'View Summary')}</span>
                       </button>
                    </div>
                 </div>
                 
                 {/* Expanded Details View */}
                 {isExpanded && (
                   <div className="border-t border-gray-200 bg-gray-50/50">
                      
                      {/* Section Title */}
                      <div className="p-4 border-b border-gray-200 bg-gray-100/70 flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                           <Table className="w-4 h-4 text-brand-blue" />
                           <h5 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                             {isHod ? 'Faculty Submissions & HOD Approval Controls' : 'Faculty Data Summary'}
                           </h5>
                         </div>
                         <span className="text-[11px] text-gray-500 font-semibold">
                           {sub.steps?.length || 0} Categories Submitted
                         </span>
                      </div>

                      {/* CATEGORIES BREAKDOWN TABLE */}
                      <div className="p-4 overflow-x-auto custom-scrollbar">
                         <table className="w-full text-left border-collapse bg-white shadow-2xs rounded-xl overflow-hidden border border-gray-200">
                            <thead>
                               <tr className="bg-brand-navy text-white text-[10px] uppercase tracking-wider font-bold">
                                  <th className="py-3 px-4 border-r border-white/20 whitespace-nowrap">Category / Sheet</th>
                                  <th className="py-3 px-4 border-r border-white/20">Data Parameters</th>
                                  <th className="py-3 px-4 border-r border-white/20">Proof / Document</th>
                                  <th className="py-3 px-4 border-r border-white/20">Status</th>
                                  {(isHod || isIqac) && <th className="py-3 px-4 text-center">Actions</th>}
                               </tr>
                            </thead>
                            <tbody className="text-xs text-brand-text">
                               {sub.steps.map((step, sIdx) => {
                                  const entries = Object.entries(step.data || {}).filter(([k]) => k !== 'proof_document');
                                  const proofDoc = step.data?.proof_document || (step.data?.event_report_link?.includes('.pdf') ? { fileName: step.data.event_report_link, fileSize: '1.2 MB' } : null);
                                  const status = step.approvalStatus || 'PENDING';

                                  return (
                                     <tr key={sIdx} className="border-b border-gray-200 hover:bg-blue-50/30 transition-colors">
                                        
                                        {/* Category Name */}
                                        <td className="py-3 px-4 font-bold text-brand-navy border-r border-gray-100 align-top bg-gray-50/50 whitespace-nowrap">
                                           <span>{step.sheetName || `Category ${step.stepNumber}`}</span>
                                        </td>

                                        {/* Parameters */}
                                        <td className="py-3 px-4 border-r border-gray-100 align-top">
                                           <div className="space-y-1.5 max-w-md">
                                              {entries.map(([k, v]) => (
                                                <div key={k} className="flex flex-col sm:flex-row sm:items-baseline text-[11px]">
                                                  <span className="font-semibold text-gray-500 capitalize min-w-[130px] mr-2">{k.replace(/_/g, ' ')}:</span>
                                                  <span className="font-bold text-gray-900">{v?.toString() || 'NIL'}</span>
                                                </div>
                                              ))}
                                           </div>
                                        </td>

                                        {/* Document Proof */}
                                        <td className="py-3 px-4 border-r border-gray-100 align-top whitespace-nowrap">
                                           {proofDoc ? (
                                             <button
                                               onClick={() => setPreviewDoc(proofDoc)}
                                               className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                                             >
                                               <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                                               <span>View Proof Document</span>
                                             </button>
                                           ) : (
                                             <span className="text-gray-400 text-[11px] italic">No document attached</span>
                                           )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-4 border-r border-gray-100 align-top whitespace-nowrap">
                                           {status === 'GRANTED' ? (
                                             <div className="space-y-0.5">
                                               <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center border border-emerald-200">
                                                 <Check className="w-3 h-3 mr-1 text-emerald-600 stroke-[3]" /> Granted
                                               </span>
                                               {step.reviewedBy && <p className="text-[10px] text-gray-500 font-medium">By {step.reviewedBy}</p>}
                                             </div>
                                           ) : (
                                             <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center border border-amber-200">
                                               <Clock className="w-3 h-3 mr-1 text-amber-600" /> Permission Pending
                                             </span>
                                           )}
                                        </td>

                                        {/* HOD Action Buttons (GRANTED ONLY, NO DECLINE BUTTON) */}
                                        {(isHod || isIqac) && (
                                          <td className="py-3 px-4 align-top text-center whitespace-nowrap">
                                            {isHod ? (
                                              <button
                                                onClick={() => handleGrantApproval(sub.id, step.stepNumber)}
                                                disabled={status === 'GRANTED'}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center space-x-1 cursor-pointer ${
                                                  status === 'GRANTED'
                                                    ? 'bg-emerald-100 text-emerald-800 opacity-60 cursor-not-allowed'
                                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow'
                                                }`}
                                                title="Grant Approval for this section"
                                              >
                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                <span>{status === 'GRANTED' ? 'Granted' : 'Grant Approval'}</span>
                                              </button>
                                            ) : (
                                              <span className="text-[11px] font-bold text-gray-500">
                                                {status === 'GRANTED' ? '✓ Granted' : 'Pending HOD'}
                                              </span>
                                            )}
                                          </td>
                                        )}
                                     </tr>
                                  );
                               })}
                            </tbody>
                         </table>
                      </div>
                   </div>
                 )}
              </div>
            );
          })
        )}
      </div>

      {/* DOCUMENT PROOF PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-200">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 text-emerald-600">
              <FileText className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-brand-navy">Uploaded Proof Document</h3>
            <p className="text-xs text-gray-500 mb-4">Official document submitted by faculty member.</p>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">File Name:</span>
                <span className="font-bold text-brand-navy truncate max-w-[220px]">{previewDoc.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">File Size:</span>
                <span className="font-mono text-gray-700">{previewDoc.fileSize || '1.5 MB'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Status:</span>
                <span className="font-bold text-emerald-600 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Proof
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert(`Simulating opening document: ${previewDoc.fileName}`); }}
                className="px-5 py-2 bg-brand-navy hover:bg-brand-blue text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open / Download Document</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FacultySubmissionsView;


