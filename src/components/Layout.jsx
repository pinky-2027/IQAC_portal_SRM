import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileBarChart, Settings, LogOut, FileCheck, Calendar, ChevronDown, ChevronRight, Layers, Building2, Microscope, Zap, BarChart2 } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const roleUpper = (user?.role || '').toUpperCase();
  const isChairman = roleUpper === 'CHAIRMAN';
  const isHod = roleUpper === 'HOD';

  const getUserAssignedInst = () => {
    if (isChairman) return null; // Chairman sees all
    const grp = (user?.group || user?.department_name || '').toUpperCase();
    if (grp.includes('E&T') || grp.includes('ET') || grp.includes('ENGIN')) return 'ET';
    if (grp.includes('MGMT') || grp.includes('MANAGEMENT') || grp.includes('MBA') || grp.includes('BBA')) return 'MANAGEMENT';
    if (grp.includes('ARCH') || grp.includes('SEAD')) return 'BARCH';
    return 'FLABS';
  };

  const assignedInst = getUserAssignedInst();
  const activeInst = location.state?.institution || assignedInst || 'ET';
  const activeDept = location.state?.department || null;

  // Sidebar tree expansion states
  const [isInstTreeOpen, setIsInstTreeOpen] = useState(true);
  const [openInstKey, setOpenInstKey] = useState(activeInst);

  React.useEffect(() => {
    if (activeInst) {
      setOpenInstKey(activeInst);
    }
  }, [activeInst]);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const etDepts = [
    { code: 'CSE', label: 'CSE (Computer Science)' },
    { code: 'IT', label: 'IT (Information Tech)' },
    { code: 'LCS', label: 'LCS (Language & Comm)' },
    { code: 'MATHS', label: 'Maths (Mathematics)' },
    { code: 'PHYSICS', label: 'Physics' },
    { code: 'CHEMISTRY', label: 'Chemistry' },
    { code: 'EEE', label: 'EEE (Electrical Eng)' },
    { code: 'ECE-ECE DS', label: 'ECE (Electronics Eng)' },
    { code: 'BIOTECH', label: 'Biotech (Biotechnology)' },
    { code: 'BIOMEDICAL', label: 'Biomedical Eng' },
    { code: 'CIVIL', label: 'Civil Eng' },
    { code: 'MECH', label: 'Mechanical Eng' },
    { code: 'AIMLAI', label: 'AIML (AI & ML)' },
    { code: 'GTDS', label: 'GTDS' },
    { code: 'CS', label: 'CS (Computer Science)' },
    { code: 'BDACC', label: 'BDACC' },
    { code: 'IOTCSBS', label: 'IOT & CSBS' }
  ];

  const flabsDepts = [
    { code: 'BCA', label: 'BCA (Computer Applications)' },
    { code: 'MCA', label: 'MCA (Computer Applications)' },
    { code: 'CS', label: 'Computer Science (CS)' },
    { code: 'Cyber', label: 'Cyber Security' },
    { code: 'AI&ML', label: 'AI & ML' },
    { code: 'LCS', label: 'LCS (Language & Comm)' },
    { code: 'com-S2', label: 'Commerce Shift 2' },
    { code: 'commer-S1', label: 'Commerce Shift 1' },
    { code: 'biotech', label: 'Biotechnology' },
    { code: 'Maths', label: 'Mathematics' },
    { code: 'A&F', label: 'Commerce (A&F)' },
    { code: 'viscom', label: 'Visual Comm' },
    { code: 'JMC', label: 'Journalism & Mass Comm' },
    { code: 'FD', label: 'Fashion Designing' }
  ];

  const mgmtDepts = [
    { code: 'MBA', label: 'MBA Program' },
    { code: 'BBA', label: 'BBA Program' }
  ];

  const handleSelectDeptFromSidebar = (instCode, deptCode) => {
    if (isHod) return;
    if (assignedInst && instCode !== assignedInst) return;
    
    navigate('/admin/dashboard', {
      state: {
        institution: instCode,
        department: deptCode
      }
    });
  };

  const toggleInst = (key) => {
    if (isHod) return;
    if (assignedInst && key !== assignedInst) return;
    if (openInstKey === key) {
      setOpenInstKey(null);
    } else {
      setOpenInstKey(key);
    }
  };

  const handleInstHeaderClick = (instCode) => {
    toggleInst(instCode);
    navigate('/admin/dashboard', {
      state: {
        institution: instCode
      }
    });
  };

  const getBreadcrumbTitle = () => {
    if (location.pathname.includes('previous-year-data')) return 'Academic Data Archive';
    if (location.pathname.includes('hod')) return 'HOD Department Portal';
    if (location.pathname.includes('faculty')) return 'Faculty Submission Portal';
    if (location.pathname.includes('reports')) return 'Reports & Analytics';
    return isChairman ? 'Chairman Overview Portal' : 'Dashboard';
  };

  const getInitials = (name) => {
    if (!name) return 'AU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getRoleDisplay = () => {
    if (user?.role === 'ADMIN') return `IQAC Coordinator (${assignedInst || 'SRM IST'})`;
    if (user?.role === 'COLLEGE_DEAN') return `Dean (${assignedInst || 'SRM IST'})`;
    if (user?.role === 'CHAIRMAN') return 'Chairman';
    if (user?.role === 'HOD') return `HOD (${user?.department_name || 'Institution'})`;
    if (user?.role === 'FACULTY') return `Faculty (${user?.department_name || 'Institution'})`;
    return user?.role || 'User';
  };

  const isDeptActive = (instCode, deptCode) => {
    return activeInst === instCode && activeDept === deptCode;
  };

  return (
    <div className="flex h-screen bg-brand-bg font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-64 lg:w-68 bg-brand-navy hidden md:flex flex-col shadow-lg z-20 flex-shrink-0">
        
        {/* Sidebar Header */}
        <div className="h-14 flex items-center px-4 border-b border-white/10">
          <Logo showText={true} className="h-7 w-auto" />
        </div>
        
        {/* Navigation & Tree View */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar space-y-4">
          
          {/* INSTITUTIONAL / DEPARTMENT SCOPE HEADER */}
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-bold text-sky-300 uppercase tracking-widest flex items-center truncate">
              <Layers className="w-3.5 h-3.5 mr-1 text-amber-400 flex-shrink-0" />
              {isHod 
                ? `${user?.department_name || 'Department'} Scope`
                : assignedInst ? `${assignedInst} Scope` : 'Institutional Scope'
              }
            </span>
            {isChairman && (
              <button
                onClick={() => {
                  navigate('/admin/dashboard', { state: { institution: 'ET' } });
                }}
                className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-bold transition-all flex items-center cursor-pointer"
              >
                ↺ Reset
              </button>
            )}
          </div>

          {/* MAIN LINK */}
          <div>
            <Link
              to={isHod ? '/hod/dashboard' : '/admin/dashboard'}
              className={`flex items-center px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                location.pathname.includes('dashboard')
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard className="mr-2.5 h-4 w-4 text-white" />
              {isHod ? 'HOD Department Portal' : (isChairman ? 'Chairman Overview Portal' : 'Dashboard Overview')}
            </Link>
          </div>

          {/* EXPANDABLE INSTITUTION & DEPARTMENT TREE (ORDERED: E&T, FLABS, Management, B.Arch) */}
          {!isHod && ['ADMIN', 'COLLEGE_DEAN', 'CHAIRMAN', 'IQAC_COORDINATOR', 'DEAN'].includes(roleUpper) && (
            <div className="space-y-1">
              <button
                onClick={() => setIsInstTreeOpen(!isInstTreeOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-extrabold text-blue-100 hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2 truncate">
                  {isInstTreeOpen ? <ChevronDown className="w-3.5 h-3.5 text-brand-gold" /> : <ChevronRight className="w-3.5 h-3.5 text-brand-gold" />}
                  <Building2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
                  <span className="truncate">SRM Institute of Science...</span>
                </div>
              </button>

              {/* HELPER LEGEND */}
              <div className="px-3 py-1.5 text-[9px] text-blue-200/60 space-y-0.5 font-medium">
                <p>&bull; Click header &rarr; Institution overview</p>
                <p>&bull; Click department &rarr; Dept details</p>
              </div>

              {isInstTreeOpen && (
                <div className="pl-4 space-y-1 text-xs font-semibold">
                  
                  {/* 1. E&T */}
                  {(!assignedInst || assignedInst === 'ET') && (
                    <div>
                      <button
                        onClick={() => handleInstHeaderClick('ET')}
                        className={`w-full flex items-center justify-between py-1.5 px-2 rounded text-blue-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer ${openInstKey === 'ET' && !activeDept ? 'bg-white/20 font-extrabold text-white ring-1 ring-amber-400/50' : openInstKey === 'ET' ? 'bg-white/10 font-bold text-white' : ''}`}
                      >
                        <div className="flex items-center space-x-2">
                          {openInstKey === 'ET' ? <ChevronDown className="w-3 h-3 text-blue-300" /> : <ChevronRight className="w-3 h-3 text-blue-300" />}
                          <Layers className="w-3.5 h-3.5 text-amber-300" />
                          <span className="font-bold text-white">E&amp;T Overview</span>
                        </div>
                        <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">17</span>
                      </button>

                      {openInstKey === 'ET' && (
                        <div className="pl-6 py-1 space-y-1 border-l border-white/10 ml-3">
                          {etDepts.map(d => (
                            <button
                              key={d.code}
                              onClick={() => handleSelectDeptFromSidebar('ET', d.code)}
                              className={`block w-full text-left py-1 px-2 text-[11px] rounded transition-all truncate cursor-pointer ${isDeptActive('ET', d.code) ? 'bg-brand-blue text-white font-extrabold shadow-2xs' : 'text-blue-200 hover:text-white hover:bg-white/10 font-medium'}`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. FLABS */}
                  {(!assignedInst || assignedInst === 'FLABS') && (
                    <div>
                      <button
                        onClick={() => handleInstHeaderClick('FLABS')}
                        className={`w-full flex items-center justify-between py-1.5 px-2 rounded text-blue-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer ${openInstKey === 'FLABS' && !activeDept ? 'bg-white/20 font-extrabold text-white ring-1 ring-emerald-400/50' : openInstKey === 'FLABS' ? 'bg-white/10 font-bold text-white' : ''}`}
                      >
                        <div className="flex items-center space-x-2">
                          {openInstKey === 'FLABS' ? <ChevronDown className="w-3 h-3 text-blue-300" /> : <ChevronRight className="w-3 h-3 text-blue-300" />}
                          <Layers className="w-3.5 h-3.5 text-purple-300" />
                          <span className="font-bold text-white">FLABS Overview</span>
                        </div>
                        <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">14</span>
                      </button>

                      {openInstKey === 'FLABS' && (
                        <div className="pl-6 py-1 space-y-1 border-l border-white/10 ml-3">
                          {flabsDepts.map(d => (
                            <button
                              key={d.code}
                              onClick={() => handleSelectDeptFromSidebar('FLABS', d.code)}
                              className={`block w-full text-left py-1 px-2 text-[11px] rounded transition-all truncate cursor-pointer ${isDeptActive('FLABS', d.code) ? 'bg-brand-blue text-white font-extrabold shadow-2xs' : 'text-blue-200 hover:text-white hover:bg-white/10 font-medium'}`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Management */}
                  {(!assignedInst || assignedInst === 'MANAGEMENT') && (
                    <div>
                      <button
                        onClick={() => handleInstHeaderClick('MANAGEMENT')}
                        className={`w-full flex items-center justify-between py-1.5 px-2 rounded text-blue-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer ${openInstKey === 'MANAGEMENT' && !activeDept ? 'bg-white/20 font-extrabold text-white ring-1 ring-purple-400/50' : openInstKey === 'MANAGEMENT' ? 'bg-white/10 font-bold text-white' : ''}`}
                      >
                        <div className="flex items-center space-x-2">
                          {openInstKey === 'MANAGEMENT' ? <ChevronDown className="w-3 h-3 text-blue-300" /> : <ChevronRight className="w-3 h-3 text-blue-300" />}
                          <Layers className="w-3.5 h-3.5 text-emerald-300" />
                          <span className="font-bold text-white">Management Overview</span>
                        </div>
                        <span className="text-[9px] bg-purple-400/20 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">2</span>
                      </button>

                      {openInstKey === 'MANAGEMENT' && (
                        <div className="pl-6 py-1 space-y-1 border-l border-white/10 ml-3">
                          {mgmtDepts.map(d => (
                            <button
                              key={d.code}
                              onClick={() => handleSelectDeptFromSidebar('MANAGEMENT', d.code)}
                              className={`block w-full text-left py-1 px-2 text-[11px] rounded transition-all truncate cursor-pointer ${isDeptActive('MANAGEMENT', d.code) ? 'bg-brand-blue text-white font-extrabold shadow-2xs' : 'text-blue-200 hover:text-white hover:bg-white/10 font-medium'}`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. B.Arch */}
                  {(!assignedInst || assignedInst === 'BARCH') && (
                    <div>
                      <button
                        onClick={() => handleInstHeaderClick('BARCH')}
                        className={`w-full flex items-center justify-between py-1.5 px-2 rounded text-blue-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer ${openInstKey === 'BARCH' ? 'bg-white/10 font-bold text-white' : ''}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Layers className="w-3.5 h-3.5 text-slate-300" />
                          <span className="font-bold text-white">B.Arch</span>
                        </div>
                        <span className="text-[9px] bg-slate-400/20 text-slate-300 px-1.5 py-0.5 rounded font-mono font-bold">Pending</span>
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* SINGLE DEPARTMENT LOCKED BADGE FOR HOD USERS */}
          {isHod && (
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-blue-200 space-y-1 font-medium">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Locked Scope</p>
              <p className="text-white font-bold">{user?.department_name || 'Department'}</p>
              <p className="text-[10px] text-blue-300">Department switching is disabled for HOD logins.</p>
            </div>
          )}

        </nav>

        {/* User Profile / Footer */}
        <div className="p-3 border-t border-white/10 bg-black/10">
          <div className="flex items-center px-2.5 py-1.5 mb-1">
            <div className="h-7 w-7 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy font-bold text-[11px] shadow-sm flex-shrink-0">
              {getInitials(user?.full_name)}
            </div>
            <div className="ml-2.5 truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name || 'User'}</p>
              <p className="text-[10px] text-blue-300 truncate">
                {getRoleDisplay()}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-200 rounded-md hover:bg-white/10 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT SHELL */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200/80 shadow-2xs flex items-center justify-between px-5 sm:px-6 z-10 flex-shrink-0">
          <div className="flex items-center">
            <div className="text-xs font-medium text-brand-muted flex items-center">
              IQAC Portal <span className="mx-1.5 text-gray-300">/</span> 
              <span className="text-brand-navy font-bold">
                {getBreadcrumbTitle()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-brand-text leading-tight">{user?.full_name || 'User'}</p>
                <p className="text-[10px] text-brand-muted">
                  {getRoleDisplay()}
                </p>
              </div>
              <div className="h-7 w-7 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-navy font-bold text-xs">
                {getInitials(user?.full_name)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-bg p-4 sm:p-5 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
