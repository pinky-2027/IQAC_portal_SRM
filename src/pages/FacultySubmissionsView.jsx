import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { MOCK_FACULTY_SUBMISSIONS, getLiveFacultySubmissions } from '../data/mockFacultySubmissions';
import { Users, Filter, Calendar, Clock, Building, Bookmark, ChevronDown, ChevronRight, CheckCircle2, Eye, EyeOff, Table } from 'lucide-react';

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
  
  const [submissionsList, setSubmissionsList] = useState(() => getLiveFacultySubmissions());
  const [selectedInst, setSelectedInst] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [expandedSubId, setExpandedSubId] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setSubmissionsList(getLiveFacultySubmissions());
    };
    window.addEventListener('iqac_submissions_updated', handleUpdate);
    return () => window.removeEventListener('iqac_submissions_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const userGroup = user?.group || '';
    const userDept = user?.department || user?.department_name || '';

    if (roleUpper === 'HOD') {
      if (userGroup) setSelectedInst(userGroup);
      if (userDept) setSelectedDept(userDept);
    } else if (['DEAN', 'COLLEGE_DEAN', 'IQAC_COORDINATOR'].includes(roleUpper) || (roleUpper === 'ADMIN' && userGroup)) {
      if (userGroup) setSelectedInst(userGroup);
      if (location.state?.department) setSelectedDept(location.state.department);
    } else if (location.state?.institution) {
      setSelectedInst(location.state.institution);
      if (location.state?.department) setSelectedDept(location.state.department);
    }
  }, [user, roleUpper, location.state]);

  // Filter submissions
  const filteredSubmissions = submissionsList.filter(sub => {
    const userInst = user?.group || selectedInst;
    const userDept = user?.department || user?.department_name || selectedDept;

    if (roleUpper === 'HOD') {
      if (userInst && sub.institution.toUpperCase() !== userInst.toUpperCase()) return false;
      if (userDept && sub.department.toUpperCase() !== userDept.toUpperCase()) return false;
      return true;
    }
    
    const targetInst = selectedInst || (['DEAN', 'IQAC_COORDINATOR', 'COLLEGE_DEAN'].includes(roleUpper) ? user?.group : '');
    if (targetInst && sub.institution.toUpperCase() !== targetInst.toUpperCase()) return false;
    if (selectedDept && sub.department.toUpperCase() !== selectedDept.toUpperCase()) return false;
    return true;
  });

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const toggleDetails = (id) => {
    setExpandedSubId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-blue rounded-xl p-5 shadow-2xs text-white">
        <div className="flex items-center space-x-2 text-brand-gold font-bold text-[10px] uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>Faculty Reports</span>
        </div>
        <h2 className="text-xl font-bold">Faculty Login Details & Submissions</h2>
        <p className="text-blue-100 text-xs mt-0.5">
          View completed IQAC data submissions by faculties.
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-4 h-4 text-brand-blue" />
          <h3 className="text-sm font-bold text-brand-navy">Filter Submissions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Institution Dropdown (Only for Chairman or Global Admin) */}
          {(roleUpper === 'CHAIRMAN' || (roleUpper === 'ADMIN' && !user?.group)) && (
            <div>
              <label className="block text-[11px] font-bold text-brand-navy uppercase tracking-wider mb-1">
                Institution
              </label>
              <div className="relative">
                <select
                  value={selectedInst}
                  onChange={(e) => { setSelectedInst(e.target.value); setSelectedDept(''); }}
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

          {/* Department Dropdown (For Chairman, Dean, IQAC) */}
          {roleUpper !== 'HOD' && (
            <div>
              <label className="block text-[11px] font-bold text-brand-navy uppercase tracking-wider mb-1">
                Department
              </label>
              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-brand-text font-medium text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none cursor-pointer"
                  disabled={!selectedInst && !user?.group && roleUpper !== 'ADMIN' && roleUpper !== 'CHAIRMAN'}
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
          
          {/* Read-only badges for HOD */}
          {roleUpper === 'HOD' && (
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
            
            return (
              <div key={sub.id} className={`bg-white rounded-xl shadow-2xs border transition-all duration-200 overflow-hidden ${isExpanded ? 'border-brand-blue ring-1 ring-brand-blue/30' : 'border-gray-200'}`}>
                 <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Faculty Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                         <h4 className="text-sm font-bold text-brand-navy">{sub.facultyName}</h4>
                         <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold flex items-center border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Submitted
                         </span>
                      </div>
                      <p className="text-xs text-brand-muted mt-1 flex items-center space-x-2 font-medium">
                         <Building className="w-3.5 h-3.5 text-gray-400" />
                         <span>{sub.institution}</span>
                         <span className="text-gray-300">•</span>
                         <span className="text-brand-blue">{sub.department}</span>
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
                         <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                       </button>
                    </div>
                 </div>
                 
                 {/* Expanded Excel-Like Details */}
                 {isExpanded && (
                   <div className="border-t border-gray-200 bg-gray-50/50">
                      <div className="p-4 border-b border-gray-200 bg-gray-100/50 flex items-center space-x-2">
                         <Table className="w-4 h-4 text-brand-blue" />
                         <h5 className="text-[11px] font-bold text-brand-navy uppercase tracking-wider">Complete 7-Step Data</h5>
                      </div>
                      <div className="p-4 overflow-x-auto custom-scrollbar">
                         <table className="w-full text-left border-collapse bg-white shadow-2xs rounded-lg overflow-hidden border border-gray-200">
                            <thead>
                               <tr className="bg-brand-navy text-white text-[10px] uppercase tracking-wider font-bold">
                                  <th className="py-2.5 px-4 border-r border-white/20 whitespace-nowrap">Step</th>
                                  <th className="py-2.5 px-4 border-r border-white/20">Parameter</th>
                                  <th className="py-2.5 px-4">Entered Value</th>
                               </tr>
                            </thead>
                            <tbody className="text-xs text-brand-text">
                               {sub.steps.map((step, sIdx) => {
                                  const entries = Object.entries(step.data);
                                  return entries.map(([k, v], eIdx) => (
                                     <tr key={`${sIdx}-${eIdx}`} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                                        {eIdx === 0 && (
                                           <td rowSpan={entries.length} className="py-2.5 px-4 font-bold text-brand-blue border-r border-gray-100 align-top bg-gray-50/30 whitespace-nowrap">
                                              Step {step.stepNumber}
                                           </td>
                                        )}
                                        <td className="py-2.5 px-4 font-medium text-gray-600 capitalize border-r border-gray-100">
                                           {k.replace(/_/g, ' ')}
                                        </td>
                                        <td className="py-2.5 px-4 font-bold">
                                           {v === 'NIL' || v === '0' ? <span className="text-gray-400 font-medium">{v}</span> : v}
                                        </td>
                                     </tr>
                                  ));
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

    </div>
  );
};

export default FacultySubmissionsView;
