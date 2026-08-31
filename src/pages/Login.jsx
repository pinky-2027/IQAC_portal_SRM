import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, UserCheck, ShieldCheck, Award, FileText, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../config/authUsers';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { user, login, setUserSession } = useAuth();

  useEffect(() => {
    if (user) {
      if (['ADMIN', 'COLLEGE_DEAN', 'CHAIRMAN'].includes(user.role)) {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'HOD') {
        navigate('/hod/dashboard', { replace: true });
      } else if (user.role === 'FACULTY') {
        navigate('/faculty/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const ROLE_CONFIGS = [
    { key: 'chairman', label: 'Chairman', icon: ShieldCheck, requiresGroup: false },
    { key: 'dean', label: 'Dean', icon: Award, requiresGroup: true },
    { key: 'iqac_coordinator', label: 'IQAC Coordinator', icon: FileText, requiresGroup: true },
    { key: 'hod', label: 'HOD', icon: UserCheck, requiresGroup: true },
    { key: 'faculty', label: 'Faculty', icon: GraduationCap, requiresGroup: true }
  ];

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setSelectedGroup('');
    setSelectedUserId('');
    setSelectedUser(null);
    setEmployeeId('');
    setPassword('12345678');
    setError('');
  };

  const handleGroupSelect = (groupName) => {
    setSelectedGroup(groupName);
    setSelectedUserId('');
    setSelectedUser(null);
    setEmployeeId('');
    setPassword('12345678');
    setError('');
  };

  const handleUserSelect = (userObj) => {
    setSelectedUserId(userObj.id);
    setSelectedUser(userObj);
    setEmployeeId(userObj.employeeId);
    setPassword('12345678');
    setError('');
  };

  const handleQuickChairmanLogin = () => {
    const chairmanUser = DEMO_USERS.chairman[0];
    setUserSession({
      id: chairmanUser.id,
      username: chairmanUser.employeeId,
      full_name: chairmanUser.name,
      role: 'CHAIRMAN',
      department_name: 'SRM IST',
      group: 'ALL'
    });
    navigate('/admin/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select a login role.');
      return;
    }

    if (selectedRole !== 'chairman' && !selectedGroup) {
      setError('Please select an institution / department group.');
      return;
    }

    if (selectedRole !== 'chairman' && !selectedUser) {
      setError('Please select your user profile.');
      return;
    }

    if (password !== '12345678') {
      setError('Invalid password. Demo password is: 12345678');
      return;
    }

    setSubmitting(true);

    try {
      if (selectedRole === 'chairman') {
        const cUser = DEMO_USERS.chairman[0];
        setUserSession({
          id: cUser.id,
          username: cUser.employeeId,
          full_name: cUser.name,
          role: 'CHAIRMAN',
          department_name: 'SRM IST',
          group: 'ALL'
        });
        navigate('/admin/dashboard');
        return;
      }

      let activeUserObj = selectedUser;
      let userRoleCode = 'ADMIN';

      if (selectedRole === 'dean') {
        userRoleCode = 'COLLEGE_DEAN';
      } else if (selectedRole === 'iqac_coordinator') {
        userRoleCode = 'ADMIN';
      } else if (selectedRole === 'hod') {
        userRoleCode = 'HOD';
      } else if (selectedRole === 'faculty') {
        userRoleCode = 'FACULTY';
      }

      setUserSession({
        id: activeUserObj.id,
        username: activeUserObj.employeeId,
        full_name: activeUserObj.name,
        role: userRoleCode,
        department_name: activeUserObj.department,
        group: selectedGroup
      });

      if (userRoleCode === 'HOD') {
        navigate('/hod/dashboard');
      } else if (userRoleCode === 'FACULTY') {
        navigate('/faculty/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Authentication failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFilteredUsers = () => {
    if (!selectedRole) return [];
    const list = DEMO_USERS[selectedRole] || [];
    if (!selectedGroup) return list;

    return list.filter(u => {
      const uDept = (u.department || '').toUpperCase();
      const sGroup = selectedGroup.toUpperCase();
      if (sGroup.includes('E&T') || sGroup.includes('ET')) {
        return uDept.includes('E&T') || uDept.includes('ET') || uDept.includes('ENGIN') || uDept.includes('CSE') || uDept.includes('ECE') || uDept.includes('MECH');
      }
      if (sGroup.includes('MANAGEMENT') || sGroup.includes('MGMT') || sGroup.includes('MBA') || sGroup.includes('BBA')) {
        return uDept.includes('MANAGEMENT') || uDept.includes('MGMT') || uDept.includes('MBA') || uDept.includes('BBA') || uDept.includes('FOM');
      }
      if (sGroup.includes('ARCH')) {
        return uDept.includes('ARCH') || uDept.includes('SEAD');
      }
      // FLABS default
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* LOGO HEADER */}
        <div className="inline-flex items-center justify-center p-3 bg-brand-navy rounded-2xl shadow-md mb-4 border border-brand-blue/30">
          <ShieldCheck className="w-10 h-10 text-brand-gold" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          SRM IST IQAC Portal
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-brand-muted">
          Institutional Quality Assurance Cell Benchmark &amp; Analytics System
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-200/80 sm:px-10">
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* STEP 1: SELECT LOGIN ROLE */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                1. Select Portal Login Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROLE_CONFIGS.map(role => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.key;
                  return (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => handleRoleSelect(role.key)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-brand-blue bg-blue-50/50 ring-2 ring-brand-blue/30 text-brand-blue font-bold shadow-2xs' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-brand-blue' : 'text-gray-400'}`} />
                      <span className="text-xs font-bold leading-tight">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK CHAIRMAN ACCESS BUTTON */}
            {selectedRole === 'chairman' && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Chairman Direct Access</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Full institutional access across E&amp;T, FLABS, Management, and B.Arch.
                </p>
                <button
                  type="button"
                  onClick={handleQuickChairmanLogin}
                  className="w-full py-2 bg-brand-navy hover:bg-brand-blue text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-2xs"
                >
                  Enter Chairman Portal Directly &rarr;
                </button>
              </div>
            )}

            {/* STEP 2: SELECT INSTITUTION / GROUP (FOR DEAN, IQAC, HOD, FACULTY) */}
            {selectedRole && selectedRole !== 'chairman' && (
              <div>
                <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                  2. Select Institution / School
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'E&T (Engineering & Tech)', key: 'E&T' },
                    { name: 'FLABS (Science & Humanities)', key: 'FLABS' },
                    { name: 'Faculty of Management', key: 'MANAGEMENT' },
                    { name: 'School of Architecture', key: 'BARCH' }
                  ].map(grp => (
                    <button
                      key={grp.key}
                      type="button"
                      onClick={() => handleGroupSelect(grp.key)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        selectedGroup === grp.key
                          ? 'border-brand-blue bg-blue-50/50 ring-2 ring-brand-blue/30 text-brand-blue shadow-2xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {grp.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: SELECT USER PROFILE */}
            {selectedRole && selectedRole !== 'chairman' && selectedGroup && (
              <div>
                <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                  3. Select Profile / User
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    const u = getFilteredUsers().find(x => x.id === e.target.value);
                    if (u) handleUserSelect(u);
                  }}
                  className="w-full bg-gray-50 border border-gray-300 text-brand-navy text-xs font-bold rounded-xl p-3 focus:ring-2 focus:ring-brand-blue focus:outline-none cursor-pointer"
                >
                  <option value="">-- Choose User Profile --</option>
                  {getFilteredUsers().map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.department || selectedGroup})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* PASSWORD INPUT & AUTH BUTTON */}
            {selectedRole && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-brand-navy">
                      Password
                    </label>
                    <span className="text-[10px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
                      Demo Password: 12345678
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-brand-navy text-xs font-bold rounded-xl p-3 pr-10 focus:ring-2 focus:ring-brand-blue focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-bold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-brand-navy hover:bg-brand-blue text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{submitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
                </button>
              </div>
            )}

          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
