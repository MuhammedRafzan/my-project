import { useState, useMemo } from 'react';
import { SURVEY_CONFIG, SHORT_VERSION_QUESTIONS } from '../survey_config';

export default function SurveyForm() {
  const [answers, setAnswers] = useState({});
  const [honeyPot, setHoneyPot] = useState('');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isShortVersion, setIsShortVersion] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sections = useMemo(() => {
    return SURVEY_CONFIG.map(sec => {
      const filteredQ = isShortVersion 
        ? sec.questions.filter(q => SHORT_VERSION_QUESTIONS.includes(q.id) || q.id === "Q36")
        : sec.questions;
      return { ...sec, questions: filteredQ };
    }).filter(sec => sec.questions.length > 0);
  }, [isShortVersion]);

  const currentSection = sections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / sections.length) * 100;

  const handleChange = (qId, value, type) => {
    if (type === 'checkbox') {
      const prev = answers[qId] || [];
      const newValues = prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value];
      setAnswers(prevAnswers => ({ ...prevAnswers, [qId]: newValues }));
    } else {
      setAnswers(prevAnswers => ({ ...prevAnswers, [qId]: value }));
    }
  };

  const validateCurrentSection = () => {
    const q1 = currentSection.questions.find(q => q.id === 'Q1');
    if (q1 && !answers['Q1']) {
      alert('Q1 is required.');
      return false;
    }
    return true;
  };

  const nextSection = () => {
    if (validateCurrentSection()) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevSection = () => {
    setCurrentSectionIndex(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentSection()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, honey_pot: honeyPot })
      });
      if (res.ok) {
        setSubmitted(true);
        window.scrollTo(0, 0);
      } else {
        alert('Error submitting the survey. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg text-center border border-slate-100">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Thank You!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">Your responses have been securely recorded. Your feedback will help us build a better credential verification system.</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md">Submit another response</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
        
        <div className="bg-slate-900 p-8 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">CredenSync <span className="text-blue-400">VoS</span></h1>
            <p className="text-slate-300 text-base mb-3 leading-relaxed max-w-2xl">We are conducting this survey as part of the development and validation of CredenSync, a privacy-preserving digital credential verification system.</p>
            <p className="text-slate-400 text-sm mb-8">Privacy: Your responses will be used for research. Please do not upload personal documents.</p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold tracking-wide text-blue-300 uppercase">Section {currentSectionIndex + 1} of {sections.length}</span>
              <label className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-700 transition-colors">
                <span className="text-xs font-medium">Short Version</span>
                <input type="checkbox" checked={isShortVersion} onChange={() => {
                  setIsShortVersion(!isShortVersion);
                  setCurrentSectionIndex(0);
                }} className="w-4 h-4 rounded text-blue-500 focus:ring-offset-slate-900" />
              </label>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-blue-400 h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <form className="p-6 sm:p-10" onSubmit={currentSectionIndex === sections.length - 1 ? handleSubmit : e => e.preventDefault()}>
          <input type="text" style={{display: 'none'}} value={honeyPot} onChange={e => setHoneyPot(e.target.value)} tabIndex={-1} autoComplete="off" />

          <h2 className="text-2xl font-bold text-slate-800 mb-8 pb-4 border-b border-slate-100">{currentSection.section}</h2>
          
          {currentSection.preText && (
            <div className="bg-blue-50/50 border border-blue-100 p-5 mb-8 rounded-xl flex gap-4">
              <div className="text-blue-500 mt-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{currentSection.preText}</div>
            </div>
          )}

          <div className="space-y-10">
            {currentSection.questions.map((q) => (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="font-semibold text-slate-800 mb-5 text-lg leading-snug">
                  <span className="text-blue-600 mr-2">{q.id}.</span>{q.text} {q.required && <span className="text-red-500 ml-1" title="Required">*</span>}
                </p>

                {q.type === 'radio' && (
                  <div className="space-y-3">
                    {q.options.map(opt => (
                      <label key={opt} className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${answers[q.id] === opt ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}>
                        <input type="radio" name={q.id} value={opt} checked={answers[q.id] === opt} onChange={() => handleChange(q.id, opt, 'radio')} className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" />
                        <span className="text-slate-700 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'checkbox' && (
                  <div className="space-y-3">
                    {q.options.map(opt => (
                      <label key={opt} className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${(answers[q.id] || []).includes(opt) ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}>
                        <input type="checkbox" value={opt} checked={(answers[q.id] || []).includes(opt)} onChange={() => handleChange(q.id, opt, 'checkbox')} className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                        <span className="text-slate-700 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'scale' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
                    <span className="text-sm text-slate-500 text-center sm:text-left sm:w-1/4 font-medium">{q.minLabel}</span>
                    <div className="flex gap-3 sm:gap-6 justify-center flex-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <label key={val} className="flex flex-col items-center cursor-pointer group">
                          <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all ${answers[q.id] === val ? 'border-blue-600 bg-blue-600 text-white scale-110 shadow-lg' : 'border-slate-200 text-slate-600 group-hover:border-blue-400 group-hover:bg-blue-50'}`}>
                            <span className="font-bold text-lg">{val}</span>
                          </div>
                          <input type="radio" className="hidden" name={q.id} value={val} checked={answers[q.id] === val} onChange={() => handleChange(q.id, val, 'scale')} />
                        </label>
                      ))}
                    </div>
                    <span className="text-sm text-slate-500 text-center sm:text-right sm:w-1/4 font-medium">{q.maxLabel}</span>
                  </div>
                )}

                {q.type === 'text' && (
                  <textarea rows={4} className="w-full border border-slate-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y transition-shadow bg-slate-50 focus:bg-white" value={answers[q.id] || ''} onChange={e => handleChange(q.id, e.target.value, 'text')} placeholder="Share your detailed response here..."></textarea>
                )}

                {q.type === 'shorttext' && (
                  <input type="text" className="w-full border border-slate-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-slate-50 focus:bg-white" value={answers[q.id] || ''} onChange={e => handleChange(q.id, e.target.value, 'shorttext')} placeholder="e.g. name@example.com" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-200">
            {currentSectionIndex > 0 ? (
              <button type="button" onClick={prevSection} className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Previous Section</button>
            ) : <div></div>}
            
            {currentSectionIndex < sections.length - 1 ? (
              <button type="button" onClick={nextSection} className="px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2">
                Next Section
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:shadow-none flex items-center gap-3">
                {submitting ? (
                  <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Submitting...</>
                ) : 'Submit Survey'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
