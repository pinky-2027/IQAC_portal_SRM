import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ChevronRight, ChevronLeft, Save, Upload, FileText,
  Send, AlertCircle, FileCheck, Check, Sparkles, Layers, Building2, Lock, Paperclip, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_FACULTY_TEMPLATES } from '../data/facultyTemplateSchemas';
import { apiService } from '../services/apiService';
import { getFacultySubmissionStatus, updateFacultySingleStepSubmission, updateFacultySubmission } from '../data/mockFacultySubmissions';

const FacultyTemplates = () => {
  const { step } = useParams();
  const currentStep = Number(step) || 1;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [customAcademicYear, setCustomAcademicYear] = useState('2025-26');
  const [templates, setTemplates] = useState(DEFAULT_FACULTY_TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState(DEFAULT_FACULTY_TEMPLATES[0]);
  const [progress, setProgress] = useState({ steps: [] });
  
  // Form State
  const [formData, setFormData] = useState({});
  const [fileUploads, setFileUploads] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadMetaData();
  }, []);

  useEffect(() => {
    if (currentStep) {
      loadStepData(currentStep, customAcademicYear);
    }
  }, [currentStep, customAcademicYear]);

  const loadMetaData = async () => {
    try {
      const templatesData = await apiService.getTemplates();
      if (templatesData && templatesData.length > 0) setTemplates(templatesData);
    } catch (err) {
      setTemplates(DEFAULT_FACULTY_TEMPLATES);
    }
  };

  const loadStepData = async (stepNum, yearStr) => {
    setLoading(true);
    setMsg(null);

    const defaultTpl = DEFAULT_FACULTY_TEMPLATES.find(t => t.step_number === Number(stepNum)) || DEFAULT_FACULTY_TEMPLATES[0];

    try {
      const [tplData, subData] = await Promise.all([
        apiService.getTemplateByStep(stepNum),
        apiService.getFacultyStepSubmission(stepNum, yearStr)
      ]);

      const selectedTpl = tplData && tplData.schema_json ? tplData : defaultTpl;
      setActiveTemplate(selectedTpl);

      if (subData && subData.data_json) {
        setFormData(subData.data_json);
      } else {
        const initialForm = {};
        const sections = selectedTpl.schema_json?.sections || [];
        sections.forEach(sec => {
          sec.fields?.forEach(f => {
            initialForm[f.name] = '';
          });
        });
        setFormData(initialForm);
      }
    } catch (err) {
      setActiveTemplate(defaultTpl);
      const initialForm = {};
      const sections = defaultTpl.schema_json?.sections || [];
      sections.forEach(sec => {
        sec.fields?.forEach(f => {
          initialForm[f.name] = '';
        });
      });
      setFormData(initialForm);
    } finally {
      setLoading(false);
    }
  };

  const editStatus = getFacultySubmissionStatus(user);

  const handleInputChange = (fieldName, value) => {
    if (editStatus.isLocked) return;
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleFileUpload = (fieldName, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'File size exceeds 10MB limit. Please upload a smaller document or image.' });
      return;
    }

    const fileSizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const fileMeta = {
      fileName: file.name,
      fileSize: fileSizeStr,
      fileType: file.type,
      uploadedAt: new Date().toISOString()
    };

    setFileUploads(prev => ({ ...prev, [fieldName]: fileMeta }));
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: file.name,
      proof_document: fileMeta
    }));

    setMsg({ type: 'success', text: `Uploaded document "${file.name}" (${fileSizeStr}) successfully!` });
  };

  const removeFileUpload = (fieldName) => {
    setFileUploads(prev => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
    setFormData(prev => {
      const copy = { ...prev };
      delete copy[fieldName];
      delete copy.proof_document;
      return copy;
    });
  };

  // Independent Step Submission
  const handleSubmitSingleStep = async () => {
    if (!activeTemplate || editStatus.isLocked) return;

    const sections = activeTemplate.schema_json?.sections || [];
    const missingRequired = [];
    
    sections.forEach(sec => {
      sec.fields?.forEach(f => {
        if (f.required && (!formData[f.name] || formData[f.name].toString().trim() === '')) {
          missingRequired.push(f.label);
        }
      });
    });
    
    if (missingRequired.length > 0) {
      setMsg({
        type: 'error',
        text: `Mandatory Fields Required (*): Please fill in ${missingRequired.slice(0, 3).join(', ')}${missingRequired.length > 3 ? ' and other required fields.' : ' before submitting this section.'}`
      });
      return;
    }

    setSaving(true);
    setMsg(null);

    try {
      updateFacultySingleStepSubmission(user, currentStep, activeTemplate.sheet_name, formData, customAcademicYear);

      try {
        await apiService.saveFacultyStep(
          customAcademicYear,
          activeTemplate.id,
          currentStep,
          formData,
          true
        );
      } catch (apiErr) {}

      setMsg({
        type: 'success',
        text: `✓ Section "${activeTemplate.sheet_name}" submitted successfully for Academic Year ${customAcademicYear}! Sent to HOD & IQAC Coordinator for review.`
      });
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Unable to submit data. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const isStepCompleted = (stepNum) => {
    if (editStatus?.submission?.steps) {
      const st = editStatus.submission.steps.find(s => s.stepNumber === stepNum);
      return st ? st.isCompleted : false;
    }
    return false;
  };

  const isFieldProofOrLink = (field) => {
    const lname = (field.name || '').toLowerCase();
    const llabel = (field.label || '').toLowerCase();
    return (
      lname.includes('link') || lname.includes('proof') || lname.includes('document') || lname.includes('drive') || lname.includes('report') ||
      llabel.includes('link') || llabel.includes('proof') || llabel.includes('document') || llabel.includes('report')
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in font-sans pb-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-blue rounded-xl p-5 shadow-2xs text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-brand-gold font-bold text-[10px] uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Independent Faculty Submissions Portal</span>
          </div>
          <h2 className="text-xl font-bold">Faculty Data Collection Categories</h2>
          <p className="text-blue-100 text-xs mt-0.5">
            Select any category to submit independent records with proofs to HOD and IQAC Coordinator.
          </p>
        </div>

        {/* Typed Academic Year Input */}
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 flex items-center space-x-2">
          <span className="text-xs font-bold text-white">Academic Year:</span>
          <input
            type="text"
            value={customAcademicYear}
            onChange={(e) => setCustomAcademicYear(e.target.value)}
            placeholder="e.g. 2025-26"
            className="w-24 bg-brand-navy text-white text-xs font-bold py-1 px-2.5 rounded-lg border border-white/30 focus:outline-none focus:ring-1 focus:ring-brand-gold font-mono text-center"
          />
        </div>
      </div>

      {/* 48-HOUR EDIT WINDOW BANNER */}
      {editStatus.isSubmitted && (
        <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-2xs animate-fade-in ${
          editStatus.isLocked
            ? 'bg-red-50 text-red-900 border-red-200'
            : 'bg-emerald-50 text-emerald-900 border-emerald-200'
        }`}>
          <div className="flex items-center space-x-2.5">
            {editStatus.isLocked ? (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold">
                {editStatus.isLocked
                  ? '🔒 Edit Window Expired'
                  : '✓ Portal Active — Submissions Editable within 48-Hour Edit Window'}
              </span>
              <p className="text-[11px] text-gray-600 mt-0.5">
                {editStatus.isLocked
                  ? 'Your submission for this academic year is locked for institutional reporting. Contact IQAC Admin to request re-opening.'
                  : `You can modify and resubmit any section for ${Math.floor(editStatus.hoursLeft)}h ${Math.floor((editStatus.hoursLeft % 1) * 60)}m remaining.`}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
            editStatus.isLocked ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {editStatus.isLocked ? 'Locked' : 'Editable'}
          </span>
        </div>
      )}

      {/* 7 INDEPENDENT CATEGORIES TABS */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 p-4">
        <div className="flex items-center justify-between overflow-x-auto custom-scrollbar pb-2 space-x-2">
          {templates.map((t) => {
            const completed = isStepCompleted(t.step_number);
            const isActive = t.step_number === currentStep;

            return (
              <div
                key={t.step_number}
                onClick={() => navigate(`/faculty/templates/${t.step_number}`)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-brand-navy text-white shadow-md ring-2 ring-brand-blue/40 font-bold'
                    : completed
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-brand-bg text-brand-navy hover:bg-gray-100 font-semibold border border-gray-200'
                }`}
              >
                <div className="text-xs">
                  <div className="font-bold flex items-center space-x-1.5 whitespace-nowrap">
                    <span>{t.sheet_name}</span>
                    {completed && <span className="text-emerald-500 font-extrabold text-[10px]">✓</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FORM CONTAINER */}
      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center text-brand-muted border border-gray-200 shadow-2xs">
          <div className="animate-spin w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="font-bold text-xs">Loading Category: {activeTemplate?.sheet_name}...</p>
        </div>
      ) : activeTemplate && (
        <div className="bg-white rounded-xl shadow-2xs border border-gray-200/80 overflow-hidden">
          
          {/* Section Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-brand-navy text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  Category: {activeTemplate.sheet_name}
                </span>
                {isStepCompleted(currentStep) && (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold flex items-center border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Submitted
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-brand-navy mt-1">{activeTemplate.template_name}</h3>
              <p className="text-brand-muted text-xs leading-relaxed">{activeTemplate.description}</p>
            </div>
          </div>

          {/* Alert Message */}
          {msg && (
            <div className={`mx-6 mt-4 p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between ${
              msg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{msg.text}</span>
              </div>
            </div>
          )}

          {/* DYNAMIC FORM RENDERER WITH PROOF / DOCUMENT UPLOAD SUPPORT */}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitSingleStep(); }} className="p-6 space-y-6">
            {activeTemplate.schema_json?.sections?.map((section, sIdx) => (
              <div key={sIdx} className="bg-gray-50/70 rounded-xl p-5 border border-gray-200/80 space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center">
                    <Layers className="w-4 h-4 mr-1.5 text-brand-blue" />
                    {section.title || section.section_title}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields?.map((field, fIdx) => {
                    const isFullWidth = field.type === 'textarea' || field.type === 'url' || field.name.includes('description') || field.name.includes('title') || field.name.includes('authors') || field.name.includes('links');
                    const hasProofUpload = isFieldProofOrLink(field);
                    const uploadedDoc = fileUploads[field.name] || (formData.proof_document && formData[field.name] ? formData.proof_document : null);

                    return (
                      <div key={fIdx} className={isFullWidth ? 'md:col-span-2' : ''}>
                        <label className="block text-[11px] font-bold text-brand-navy uppercase tracking-wider mb-1">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {field.type === 'select' ? (
                          <select
                            disabled={editStatus.isLocked}
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-brand-text font-medium text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <option value="">-- Select {field.label} --</option>
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            disabled={editStatus.isLocked}
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-brand-text font-medium text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                            placeholder={`Enter ${field.label}...`}
                          />
                        ) : (
                          <div className="space-y-2">
                            <input
                              type={field.type || 'text'}
                              disabled={editStatus.isLocked}
                              required={field.required && !uploadedDoc}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-brand-text font-medium text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                              placeholder={`Enter ${field.label} or paste link`}
                            />

                            {/* PROOF / DOCUMENT UPLOAD CONTROL FOR LINKS & PROOF FIELDS */}
                            {hasProofUpload && (
                              <div className="mt-1 bg-white p-2.5 rounded-lg border border-dashed border-brand-blue/40 flex items-center justify-between">
                                {uploadedDoc ? (
                                  <div className="flex items-center space-x-2 text-xs text-emerald-800 font-bold">
                                    <Paperclip className="w-4 h-4 text-emerald-600" />
                                    <span className="truncate max-w-[200px]">{uploadedDoc.fileName}</span>
                                    {uploadedDoc.fileSize && <span className="text-[10px] text-gray-500 font-normal">({uploadedDoc.fileSize})</span>}
                                    <button
                                      type="button"
                                      onClick={() => removeFileUpload(field.name)}
                                      className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer ml-1"
                                      title="Remove Uploaded Proof"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2 w-full justify-between">
                                    <span className="text-[11px] text-gray-500 font-medium flex items-center">
                                      <Upload className="w-3.5 h-3.5 text-brand-blue mr-1.5" />
                                      Upload Document / Proof (Image / PDF):
                                    </span>
                                    <label className="px-3 py-1 bg-brand-navy hover:bg-brand-blue text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all flex items-center space-x-1">
                                      <Upload className="w-3 h-3" />
                                      <span>Browse File</span>
                                      <input
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                        disabled={editStatus.isLocked}
                                        onChange={(e) => handleFileUpload(field.name, e)}
                                        className="hidden"
                                      />
                                    </label>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* ACTION BUTTONS: INDEPENDENT SUBMIT BUTTON FOR THIS STEP */}
            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={() => navigate(`/faculty/templates/${currentStep - 1}`)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev Category</span>
                </button>
                <button
                  type="button"
                  disabled={currentStep === 7}
                  onClick={() => navigate(`/faculty/templates/${currentStep + 1}`)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-40"
                >
                  <span>Next Category</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={saving || editStatus.isLocked}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editStatus.isLocked ? <Lock className="w-4 h-4 text-white" /> : <Send className="w-4 h-4" />}
                  <span>{editStatus.isLocked ? '🔒 Edit Window Expired' : `Submit ${activeTemplate.sheet_name} Data`}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FacultyTemplates;

