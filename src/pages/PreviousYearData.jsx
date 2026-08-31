import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, FileText, Check, Award, GraduationCap, Users, Microscope, FileX, Lock, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { getLegacyKpiClientData } from '../services/dataService';

const mapDeptToCode = (deptStr) => {
  if (!deptStr) return 'BCA';
  const s = deptStr.toLowerCase();
  if (s.includes('bca')) return 'BCA';
  if (s.includes('mca')) return 'MCA';
  if (s.includes('cyber')) return 'Cyber';
  if (s.includes('ai') || s.includes('ml')) return 'AI&ML';
  if (s.includes('computer') || s.includes('cs') || s.includes('data')) return 'CS';
  if (s.includes('lcs') || s.includes('english') || s.includes('tamil')) return 'LCS';
  if (s.includes('a&f') || s.includes('af') || s.includes('pa')) return 'A&F';
  if (s.includes('shift 2') || s.includes('s2')) return 'com-S2';
  if (s.includes('commerce')) return 'commer-S1';
  if (s.includes('biotech')) return 'biotech';
  if (s.includes('math')) return 'Maths';
  if (s.includes('viscom')) return 'viscom';
  if (s.includes('jmc') || s.includes('journalism')) return 'JMC';
  if (s.includes('fashion') || s.includes('fd')) return 'FD';
  return 'BCA';
};

const PreviousYearData = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isHod = (user?.role || '').toUpperCase() === 'HOD';

  const [institutions, setInstitutions] = useState([]);
  const [selectedInstCode, setSelectedInstCode] = useState('FLABS');
  const [selectedDept, setSelectedDept] = useState('BCA');
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [kpiLegacyData, setKpiLegacyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstitutions();
    
    // Auto lock department for HOD
    if (isHod) {
      const userGroup = (user?.group || '').toUpperCase();
      let instCode = 'FLABS';
      if (userGroup.includes('E&T') || userGroup.includes('ENG')) instCode = 'ET';
      else if (userGroup.includes('MANAGEMENT') || userGroup.includes('MGMT')) instCode = 'MANAGEMENT';
      else if (userGroup.includes('BARCH') || userGroup.includes('ARCH')) instCode = 'BARCH';
      
      const deptCode = mapDeptToCode(user?.department_name || user?.department);
      setSelectedInstCode(instCode);
      setSelectedDept(deptCode);
    }
  }, [user, isHod]);

  useEffect(() => {
    if (!isHod) {
      if (selectedInstCode === 'MANAGEMENT') {
        setSelectedDept('MBA');
      } else if (selectedInstCode === 'ET') {
        setSelectedDept('CSE');
      } else if (selectedInstCode === 'FLABBS' || selectedInstCode === 'FLABS') {
        setSelectedDept('BCA');
      } else {
        setSelectedDept('');
      }
    }
  }, [selectedInstCode, isHod]);

  useEffect(() => {
    if (selectedInstCode && selectedYear) {
      loadHistoricalKpiData();
    }
  }, [selectedInstCode, selectedDept, selectedYear]);

  const loadInstitutions = async () => {
    try {
      const insts = await apiService.getInstitutions();
      setInstitutions(insts);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistoricalKpiData = async () => {
    setLoading(true);
    try {
      if (selectedInstCode === 'BARCH' || selectedInstCode === 'SEAD') {
        setKpiLegacyData({
          hasData: false,
          isPending: true,
          institution: 'B.Arch',
          department: 'B.Arch',
          message: 'Data is yet to be received for B.Arch Institution.'
        });
        setLoading(false);
        return;
      }

      try {
        const res = await apiService.getLegacyKpiData(selectedInstCode, selectedYear, selectedDept);
        if (res && res.records && res.records.length > 0) {
          setKpiLegacyData(res);
        } else {
          setKpiLegacyData(getLegacyKpiClientData(selectedInstCode, selectedYear, selectedDept));
        }
      } catch (backendErr) {
        setKpiLegacyData(getLegacyKpiClientData(selectedInstCode, selectedYear, selectedDept));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatVal = (indicator, rawVal) => {
    if (rawVal === undefined || rawVal === null || rawVal === '') return 'N/A';
    if (typeof rawVal === 'number' && (indicator.toLowerCase().includes('percentage') || indicator.toLowerCase().includes('projects') || rawVal < 1)) {
      return `${(rawVal * 100).toFixed(1)}%`;
    }
    return typeof rawVal === 'number' ? rawVal.toLocaleString() : rawVal.toString();
  };

  const getKpiBadge = (indicator) => {
    const name = indicator.toLowerCase();
    if (name.includes('student') || name.includes('intake') || name.includes('pass') || name.includes('placed') || name.includes('higher')) {
      return { category: 'Student Performance', icon: GraduationCap, badge: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    if (name.includes('faculty') || name.includes('phd') || name.includes('fdp')) {
      return { category: 'Faculty Cadre', icon: Users, badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    }
    if (name.includes('journal') || name.includes('publications') || name.includes('conferences') || name.includes('patents') || name.includes('funding')) {
      return { category: 'Research & Innovation', icon: Microscope, badge: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
    return { category: 'Institutional Excellence', icon: Award, badge: 'bg-amber-50 text-amber-700 border-amber-200' };
  };

  const etDepartments = [
    'CSE', 'IT', 'LCS', 'MATHS', 'PHYSICS', 'CHEMISTRY', 'EEE', 
    'ECE-ECE DS', 'BIOTECH', 'BIOMEDICAL', 'CIVIL', 'MECH', 
    'AIMLAI', 'GTDS', 'CS', 'BDACC', 'IOTCSBS'
  ];
  const mgmtDepartments = ['MBA', 'BBA'];

  const flabsDepartments = [
    { code: 'BCA', name: 'BCA (Computer Applications)' },
    { code: 'MCA', name: 'MCA (Computer Applications)' },
    { code: 'CS', name: 'Computer Science (CS)' },
    { code: 'Cyber', name: 'Cyber Security' },
    { code: 'AI&ML', name: 'AI & ML' },
    { code: 'LCS', name: 'LCS (Language & Communication)' },
    { code: 'com-S2', name: 'Commerce Shift 2 & CS' },
    { code: 'commer-S1', name: 'Commerce Shift 1' },
    { code: 'biotech', name: 'Biotechnology' },
    { code: 'Maths', name: 'Mathematics' },
    { code: 'A&F', name: 'Commerce (A&F)' },
    { code: 'viscom', name: 'Visual Communication' },
    { code: 'JMC', name: 'Journalism and Mass Communication' },
    { code: 'FD', name: 'Fashion Designing' }
  ];

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-blue rounded-xl p-5 shadow-2xs text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-brand-gold font-bold text-[10px] uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>IQAC Institutional Analytics & Records</span>
          </div>
          <h2 className="text-xl font-bold">Academic Data Archive — KPI Metrics</h2>
          <p className="text-blue-100 text-xs mt-0.5">
            {isHod ? (
              <>Viewing assigned records for <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">{user?.department_name || user?.department || selectedDept}</span></>
            ) : (
              <>Complete parameter data across 5 Academic Years for FLABS (14 Depts), E&T (17 Depts), and Management (MBA/BBA).</>
            )}
          </p>
        </div>
      </div>

      {/* INSTITUTION, DEPARTMENT & ACADEMIC YEAR SELECTION FILTER */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-navy to-brand-blue px-5 py-3 text-white flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center">
            <Building2 className="w-4 h-4 mr-2 text-brand-gold" />
            {isHod ? `Department Archive (${user?.department_name || user?.department || selectedDept})` : 'Academic Data Archive Filter'}
          </h3>
          <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded font-sans font-bold">
            {isHod ? 'HOD Scoped Access' : 'IQAC Admin Access'}
          </span>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* FOR HOD: HIDE INSTITUTION & DEPARTMENT DROPDOWNS, DISPLAY LOCKED SCOPE BADGES */}
          {isHod ? (
            <>
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 flex items-center space-x-2.5">
                <Lock className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block">Assigned Institution</span>
                  <span className="text-xs font-bold text-brand-blue">{selectedInstCode}</span>
                </div>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 flex items-center space-x-2.5">
                <Lock className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wider block">Assigned Department</span>
                  <span className="text-xs font-bold text-brand-blue">{user?.department_name || user?.department || selectedDept}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Select Institution</label>
                <select
                  value={selectedInstCode}
                  onChange={(e) => setSelectedInstCode(e.target.value)}
                  className="w-full bg-brand-bg border border-gray-200 text-brand-text py-2 px-3 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                >
                  <option value="ET">E&T (17 Departments Available)</option>
                  <option value="FLABS">FLABS (14 Departments Available)</option>
                  <option value="MANAGEMENT">Management (MBA & BBA Available)</option>
                  <option value="BARCH">B.Arch (Architecture — Yet to receive data)</option>
                </select>
              </div>

              {/* DYNAMIC DEPARTMENT DROPDOWN */}
              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">
                  Select Department {selectedInstCode === 'FLABS' ? '(14 Departments)' : selectedInstCode === 'ET' ? '(17 Departments)' : selectedInstCode === 'MANAGEMENT' ? '(MBA / BBA)' : ''}
                </label>
                {selectedInstCode === 'FLABS' ? (
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-brand-bg border border-gray-200 text-brand-navy py-2 px-3 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                  >
                    {flabsDepartments.map(d => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                ) : selectedInstCode === 'ET' ? (
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-brand-bg border border-gray-200 text-brand-navy py-2 px-3 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                  >
                    {etDepartments.map(d => (
                      <option key={d} value={d}>{d} Department</option>
                    ))}
                  </select>
                ) : selectedInstCode === 'MANAGEMENT' ? (
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-brand-bg border border-gray-200 text-brand-navy py-2 px-3 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
                  >
                    {mgmtDepartments.map(d => (
                      <option key={d} value={d}>{d} Program</option>
                    ))}
                  </select>
                ) : (
                  <select disabled className="w-full bg-gray-100 border border-gray-200 text-gray-400 py-2 px-3 rounded-lg text-xs font-semibold">
                    <option>N/A (All Institution Metrics)</option>
                  </select>
                )}
              </div>
            </>
          )}

          {/* ACADEMIC YEAR SELECTION DROPDOWN (AVAILABLE FOR ALL ROLES) */}
          <div>
            <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1">Select Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-brand-bg border border-gray-200 text-brand-text py-2 px-3 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
            >
              <option value="2021-2022">2021-2022</option>
              <option value="2022-2023">2022-2023</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>
        </div>
      </div>


      {/* HISTORICAL KPI DATA CARDS GRID */}
      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center text-brand-muted border border-gray-200 shadow-2xs">
          <div className="animate-spin w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="font-bold text-xs">Loading Academic Data Archive...</p>
        </div>
      ) : kpiLegacyData && kpiLegacyData.hasData ? (
        <div className="space-y-3 animate-fade-in-up">
          <div className="bg-white rounded-xl p-3.5 shadow-2xs border border-gray-200/80 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center">
                  <Check className="w-3 h-3 mr-0.5" /> Verified Institutional Archive
                </span>
                <span className="text-[10px] font-medium text-brand-muted">
                  {selectedInstCode === 'MANAGEMENT' ? 'FOM KPI - APPS -3 YEARS.xlsx' : selectedInstCode === 'ET' ? 'KPI - APPS -3 YEARS.xlsx' : 'Department data.xlsx'}
                </span>
              </div>
              <h3 className="text-base font-bold text-brand-navy mt-1">
                {kpiLegacyData.institution} {kpiLegacyData.department ? `(${kpiLegacyData.department})` : ''} <span className="text-brand-blue font-semibold">| {selectedYear} Archive Metrics</span>
              </h3>
            </div>
            <button
              onClick={() => navigate('/admin/reports')}
              className="px-3 py-1.5 bg-brand-navy hover:bg-brand-blue text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              View Analytics Reports
            </button>
          </div>

          {/* ALL KPI CARDS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {kpiLegacyData.records.map((rec, idx) => {
              if (rec.section) {
                return (
                  <div key={idx} className="col-span-2 md:col-span-3 lg:col-span-4 bg-brand-navy text-white px-4 py-2 rounded-lg font-bold text-xs shadow-xs flex items-center space-x-2 mt-2">
                    <Building2 className="w-4 h-4 text-brand-gold" />
                    <span>{rec.section}</span>
                  </div>
                );
              }

              const indicator = rec.indicator;
              const rawVal = rec.values ? rec.values[selectedYear] : rec[selectedYear];
              const formattedVal = formatVal(indicator, rawVal);
              const { category, icon: Icon, badge } = getKpiBadge(indicator);

              return (
                <div key={idx} className="bg-white rounded-lg p-3 shadow-2xs border border-gray-200/80 hover:shadow-xs hover:border-brand-blue/30 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${badge}`}>
                        {category}
                      </span>
                      <div className="p-1 bg-brand-bg rounded text-brand-blue group-hover:bg-brand-navy group-hover:text-white transition-colors">
                        <Icon className="w-3 h-3" />
                      </div>
                    </div>
                    <h5 className="text-[11px] font-semibold text-brand-text leading-tight line-clamp-2 min-h-[1.75rem]">
                      {indicator}
                    </h5>
                    {(rec.naac_kpi || rec.nirf_kpi) && (
                      <div className="mt-1 text-[9px] text-gray-400 space-y-0.5">
                        {rec.naac_kpi && rec.naac_kpi !== 'None' && <p><span className="font-semibold text-brand-navy">NAAC:</span> {rec.naac_kpi}</p>}
                        {rec.nirf_kpi && rec.nirf_kpi !== 'None' && <p><span className="font-semibold text-brand-blue">NIRF:</span> {rec.nirf_kpi}</p>}
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[9px] text-brand-muted font-medium block">{selectedYear} Value</span>
                      <span className="text-lg font-bold text-brand-navy leading-none">{formattedVal}</span>
                    </div>
                    <span className="text-[9px] font-semibold text-brand-blue bg-blue-50 px-1 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : kpiLegacyData && (kpiLegacyData.isPending || selectedInstCode === 'BARCH' || selectedInstCode === 'SEAD') ? (
        <div className="bg-amber-50/80 rounded-xl shadow-2xs border border-amber-200 p-10 text-center animate-fade-in space-y-3">
          <Clock className="w-12 h-12 text-amber-600 mx-auto mb-1 animate-pulse" />
          <h4 className="text-lg font-bold text-amber-900">
            Yet to receive data for B.Arch Institution
          </h4>
          <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
            The historical benchmark metrics and parameter data for B.Arch (Architecture) are pending data collection and will be uploaded as soon as received.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 p-10 text-center animate-fade-in space-y-2">
          <FileX className="w-10 h-10 text-amber-500 mx-auto mb-1" />
          <h4 className="text-base font-bold text-brand-navy">
            Sorry, {user?.full_name || 'HOD'} ({user?.department_name || user?.department || selectedDept}) — Data is not available.
          </h4>
          <p className="text-xs text-brand-muted max-w-md mx-auto">
            The dataset for {user?.department_name || user?.department || selectedDept} has not been uploaded to the Academic Data Archive yet.
          </p>
        </div>
      )}
    </div>
  );
};


export default PreviousYearData;
