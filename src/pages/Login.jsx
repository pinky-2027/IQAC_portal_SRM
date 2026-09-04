import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
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
  const { login, setUserSession } = useAuth();

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

  const handleProfileSelect = (userId) => {
    setSelectedUserId(userId);
    if (!userId) {
      setSelectedUser(null);
      setEmployeeId('');
      setPassword('12345678');
      return;
    }

    const foundUser = DEMO_USERS.find(
      u => u.id === userId || u.employeeId === userId
    );

    if (foundUser) {
      setSelectedUser(foundUser);
      setEmployeeId(foundUser.employeeId || foundUser.id);
      setPassword('12345678');
      setError('');
    } else {
      setSelectedUser(null);
      setEmployeeId('');
      setPassword('12345678');
    }
  };

  // Filter available users for dropdown
  const getFilteredUsers = () => {
    if (!selectedRole) return [];

    return DEMO_USERS.filter(u => {
      if (selectedRole === 'chairman') {
        return u.role === 'chairman' && (u.id === 'user_chairman' || u.employeeId === 'CHAIRMAN001');
      }

      let roleMatches = false;
      if (selectedRole === 'dean') roleMatches = u.role === 'dean';
      else if (selectedRole === 'iqac_coordinator') roleMatches = u.role === 'iqac_coordinator';
      else if (selectedRole === 'hod') roleMatches = u.role === 'hod';
      else if (selectedRole === 'faculty') roleMatches = u.role === 'faculty' || u.role === 'supervisor' || u.role === 'scholar';

      if (!roleMatches) return false;

      if (selectedGroup && u.group) {
        return u.group === selectedGroup || u.group.includes(selectedGroup);
      }
      return !selectedGroup;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedUser) {
      setError('Please choose a profile from the dropdown before signing in.');
      return;
    }

    if (!password || password.trim() === '') {
      setError('Please enter your password');
      return;
    }

    if (password.trim() !== '12345678') {
      setError('Incorrect password. Please try again. (Demo password: 12345678)');
      return;
    }

    setSubmitting(true);
    try {
      let appRole = selectedUser.role.toUpperCase();
      if (selectedRole === 'chairman') appRole = 'CHAIRMAN';
      else if (selectedRole === 'dean') appRole = 'COLLEGE_DEAN';
      else if (selectedRole === 'iqac_coordinator') appRole = 'ADMIN';
      else if (selectedRole === 'hod') appRole = 'HOD';
      else if (selectedRole === 'faculty') appRole = 'FACULTY';

      const userPayload = {
        id: selectedUser.id,
        username: selectedUser.employeeId || selectedUser.id,
        full_name: selectedUser.name,
        role: appRole,
        department_name: selectedUser.department || selectedUser.group || 'SRM IST',
        employee_id: selectedUser.employeeId,
        group: selectedUser.group
      };

      setUserSession(userPayload, 'demo_token_' + selectedUser.id);

      try {
        await login(selectedUser.employeeId || selectedUser.id, password, null);
      } catch (backendErr) {
        // Fallback for demo session
      }

      if (['ADMIN', 'COLLEGE_DEAN', 'CHAIRMAN'].includes(appRole)) {
        navigate('/admin/dashboard');
      } else if (appRole === 'HOD') {
        navigate('/hod/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
      setSubmitting(false);
    }
  };

  const filteredUsers = getFilteredUsers();
  const currentRoleObj = ROLE_CONFIGS.find(r => r.key === selectedRole);

  return (
    <div className="min-h-screen w-full flex bg-brand-bg font-sans overflow-hidden">
      
      {/* LEFT SIDE: INSTITUTIONAL BRANDING & CAMPUS BUILDING PHOTO */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-navy flex-col justify-between p-10 overflow-hidden">
        {/* College Building Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url("/college_img.jpeg")' }}
        ></div>
        
        {/* Gradient Blur Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-blue rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        {/* Top Header Logo & Institution Name */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3.5 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 inline-flex shadow-lg">
            <img src="/srm-logo-clean.svg" alt="SRM IST Logo" className="h-12 w-auto object-contain filter drop-shadow-md" />
            <div className="border-l border-white/30 pl-3.5">
              <h1 className="text-xl font-bold text-white tracking-wide">SRM Institute of Science &amp; Technology</h1>
              <p className="text-brand-gold font-semibold tracking-wider text-[11px] uppercase mt-0.5">Ramapuram Campus &bull; IQAC Portal</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-extrabold text-white leading-tight mt-10">
            Institutional Quality Assurance &amp;<br />
            Data Analytics Portal
          </h2>
          <p className="text-blue-100 text-sm mt-3 max-w-lg font-light leading-relaxed">
            Executive Analytics &amp; Quality Monitoring for Chairman, Deans, IQAC Coordinators, HODs, and Faculty across E&amp;T, FLABS, Management, and B.Arch.
          </p>
        </div>

        {/* Tagline / Motto */}
        <div className="relative z-10">
          <p className="text-white/80 text-xs italic border-l-2 border-brand-gold pl-3 max-w-md">
            "Quality is never an accident; it is always the result of high intention, sincere effort, intelligent direction and skillful execution."
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: IQAC PORTAL SIGN IN & 5 LOGIN ROLES */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-gradient-to-br from-brand-bg to-white overflow-y-auto">
        <div className="w-full max-w-md bg-white p-7 sm:p-8 rounded-2xl shadow-[0_10px_35px_rgba(18,59,109,0.08)] border border-gray-100 animate-fade-in-up">
          
          {/* Mobile Header Logo (visible only on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-6 text-center">
            <img src="/srm-logo-clean.svg" alt="SRM IST Logo" className="h-14 w-auto mb-2 object-contain" />
            <h1 className="text-lg font-bold text-brand-navy">SRM IST — IQAC Portal</h1>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-brand-navy mb-0.5">IQAC Portal Sign In</h2>
            <p className="text-brand-muted text-xs">Select your login role and choose your profile to proceed</p>
          </div>

          <div className="space-y-4">
            
            {/* STEP 1: 5 LOGIN ROLES */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Select Login Role
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-brand-bg rounded-xl border border-gray-200">
                {ROLE_CONFIGS.map((role) => {
                  const Icon = role.icon;
                  const isActive = selectedRole === role.key;
                  return (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => handleRoleSelect(role.key)}
                      className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                        isActive
                          ? 'bg-brand-navy text-white shadow-sm'
                          : 'text-brand-muted hover:text-brand-navy hover:bg-white/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 mb-1 ${isActive ? 'text-brand-gold' : 'text-brand-blue'}`} />
                      <span>{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: SELECT GROUP (FOR DEAN, IQAC COORDINATOR, HOD, FACULTY) */}
            {selectedRole && currentRoleObj?.requiresGroup && (
              <div className="animate-fade-in">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Select Group / School
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => handleGroupSelect(e.target.value)}
                  className="w-full bg-brand-bg border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                >
                  <option value="">— Choose Group —</option>
                  <option value="E&T">E&amp;T (Engineering &amp; Technology)</option>
                  <option value="FLABS">FLABS (Science &amp; Humanities)</option>
                  <option value="Management">Management (FOM)</option>
                  <option value="B.Arch">B.Arch (Architecture)</option>
                </select>
              </div>
            )}

            {/* STEP 3: CHOOSE YOUR PROFILE DROPDOWN */}
            {selectedRole && (!currentRoleObj?.requiresGroup || selectedGroup) && (
              <div className="animate-fade-in">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Choose Your Profile <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => handleProfileSelect(e.target.value)}
                  className="w-full bg-blue-50/60 border border-blue-200 rounded-xl py-2 px-3 text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                >
                  <option value="">— Choose profile from dropdown —</option>
                  {filteredUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} {u.department ? `— ${u.department}` : ''} ({u.employeeId || 'No ID'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ACTIVE PROFILE PREVIEW CARD */}
            {selectedUser && (
              <div className="bg-gradient-to-br from-blue-50/90 to-white p-3.5 rounded-xl border border-blue-200 shadow-2xs animate-fade-in space-y-1.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-blue-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-blue">Active Profile</span>
                  <span className="px-2 py-0.5 bg-brand-navy text-white text-[9px] font-bold rounded-md uppercase">
                    {selectedUser.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] text-gray-400 font-semibold block uppercase">Full Name</span>
                    <span className="font-bold text-brand-navy truncate block">{selectedUser.name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-semibold block uppercase">Employee ID</span>
                    <span className="font-mono font-bold text-brand-blue truncate block">{selectedUser.employeeId || '—'}</span>
                  </div>
                  {selectedUser.group && (
                    <div>
                      <span className="text-[9px] text-gray-400 font-semibold block uppercase">Group</span>
                      <span className="font-semibold text-gray-700 truncate block">{selectedUser.group}</span>
                    </div>
                  )}
                  {selectedUser.department && (
                    <div>
                      <span className="text-[9px] text-gray-400 font-semibold block uppercase">Department</span>
                      <span className="font-semibold text-gray-700 truncate block">{selectedUser.department}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ERROR DISPLAY */}
            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-xl border border-red-200 font-semibold text-center">
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">
                  Employee ID / Username
                </label>
                <input
                  type="text"
                  readOnly
                  value={employeeId}
                  placeholder="Select profile above to auto-fill"
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-brand-navy cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-3 pr-10 text-xs font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-navy cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedUser}
                className="w-full py-2.5 px-4 bg-brand-navy hover:bg-brand-blue text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {submitting
                    ? 'Authenticating...'
                    : selectedUser
                    ? `Sign In as ${selectedUser.name}`
                    : 'Select Profile to Sign In'}
                </span>
              </button>
            </form>

            <div className="mt-4 text-center pt-3 border-t border-gray-100">
              <p className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider">
                SRM Institute of Science &amp; Technology &bull; Internal Quality Assurance Cell
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
