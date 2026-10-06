export const SURVEY_CONFIG = [
  {
    section: "Section 1 — Respondent Profile",
    questions: [
      { id: "Q1", text: "Which category best describes you?", type: "radio", required: true, options: ["Student", "Job Seeker / Recent Graduate", "HR Professional / Recruiter", "Academic Administrator / Faculty", "Other"] },
      { id: "Q2", text: "What is your primary role in the credential verification process?", type: "radio", options: ["I submit/provide credentials", "I verify credentials", "I issue/attest credentials", "Both submit and verify credentials", "Other"] },
      { id: "Q3", text: "How frequently do you deal with educational or professional credential verification?", type: "radio", options: ["Very frequently", "Frequently", "Occasionally", "Rarely", "Never"] }
    ]
  },
  {
    section: "Section 2 — Current Credential Verification Process",
    questions: [
      { id: "Q4", text: "How are educational/professional credentials usually submitted or verified in your experience?", type: "checkbox", options: ["Physical copies", "Scanned PDF documents", "Images/photos of certificates", "Email attachments", "Online portals", "Institution-to-institution verification", "Digital certificates", "Blockchain-based credentials", "Other"] },
      { id: "Q5", text: "How long does credential verification typically take?", type: "radio", options: ["Less than 1 hour", "Same day", "1–2 days", "3–7 days", "More than a week", "It varies significantly"] },
      { id: "Q6", text: "Have you experienced delays because of manual credential verification?", type: "radio", options: ["Yes", "No", "Not sure"] },
      { id: "Q7", text: "If yes, what were the main reasons for the delay?", type: "checkbox", options: ["Manual document checking", "Waiting for institution confirmation", "Missing documents", "Difficulty accessing institutional records", "Communication delays", "High volume of verification requests", "Suspected document authenticity issues", "Other"] }
    ]
  },
  {
    section: "Section 3 — Privacy & Data Security",
    questions: [
      { id: "Q8", text: "How comfortable are you with sharing complete educational or identity documents online?", type: "scale", min: 1, max: 5, minLabel: "Very uncomfortable", maxLabel: "Very comfortable" },
      { id: "Q9", text: "What concerns do you have when sharing complete credentials online?", type: "checkbox", options: ["Identity theft", "Misuse of personal information", "Unauthorized access", "Data leakage", "Unknown storage location", "Unauthorized copying", "Sharing with third parties", "Long-term retention of documents", "I have no major concerns", "Other"] },
      { id: "Q10", text: "How concerned are you about identity theft or misuse of personal information from uploaded credentials?", type: "scale", min: 1, max: 5, minLabel: "Not concerned", maxLabel: "Extremely concerned" },
      { id: "Q11", text: "Have you ever submitted the same educational/identity documents to multiple organizations or online platforms?", type: "radio", options: ["Frequently", "Sometimes", "Rarely", "Never"] },
      { id: "Q12", text: "Do you know what happens to your documents after submitting them to an organization or online platform?", type: "radio", options: ["Yes, clearly", "Partially", "No", "I have never considered this"] }
    ]
  },
  {
    section: "Section 4 — Credential Forgery & Trust",
    questions: [
      { id: "Q13", text: "How easy do you think it is to digitally manipulate or forge an educational certificate?", type: "scale", min: 1, max: 5, minLabel: "Very difficult", maxLabel: "Very easy" },
      { id: "Q14", text: "Have you ever encountered or suspected a forged, manipulated, or invalid certificate?", type: "radio", options: ["Yes", "No", "Not sure", "Prefer not to say"] },
      { id: "Q15", text: "How confident are you that a visually presented digital certificate is genuine?", type: "scale", min: 1, max: 5, minLabel: "Not confident", maxLabel: "Extremely confident" },
      { id: "Q16", text: "What methods do you currently use to determine whether a credential is genuine?", type: "checkbox", options: ["Visual inspection", "Checking certificate number", "Contacting the issuing institution", "Checking an institutional database", "Email verification", "QR code verification", "Digital signature", "Blockchain verification", "Third-party verification service", "Other"] }
    ]
  },
  {
    section: "Section 5 — Problems With Existing Systems",
    questions: [
      { id: "Q17", text: "How would you rate the current credential verification process?", type: "radio", options: ["Very poor", "Poor", "Average", "Good", "Excellent"] },
      { id: "Q18", text: "Which problems do you experience with the current system?", type: "checkbox", options: ["Too slow", "Too much paperwork", "Requires sharing complete documents", "Privacy concerns", "Difficult to verify authenticity", "High administrative workload", "Lack of transparency", "Repeated document submission", "Risk of forgery", "Lack of standardized verification", "Other"] },
      { id: "Q19", text: "Which ONE problem is the most serious?", type: "radio", options: ["Privacy/data exposure", "Slow verification", "Certificate forgery", "Administrative workload", "Lack of trust in digital credentials", "Repeated document submission", "Other"] }
    ]
  },
  {
    section: "Section 6 — CredenSync Concept",
    preText: "About CredenSync\nCredenSync is a proposed privacy-preserving credential verification system. It uses AI to screen credentials for potential manipulation before registration, blockchain to maintain tamper-evident credential records, and Zero-Knowledge Proofs (ZKPs) to allow users to prove specific qualifications without revealing the complete credential.",
    questions: [
      { id: "Q20", text: "How useful would a system like CredenSync be for you?", type: "scale", min: 1, max: 5, minLabel: "Not useful at all", maxLabel: "Extremely useful" },
      { id: "Q21", text: "Would you prefer to prove a qualification without sharing the complete certificate/document?", type: "radio", options: ["Definitely yes", "Probably yes", "Not sure", "Probably no", "Definitely no"] },
      { id: "Q22", text: "How valuable would it be to verify a qualification without revealing other personal information contained in the certificate?", type: "scale", min: 1, max: 5, minLabel: "Not valuable", maxLabel: "Extremely valuable" },
      { id: "Q23", text: "Which information would you prefer to prove without revealing the complete document?", type: "checkbox", options: ["Degree/qualification obtained", "Institution attended", "Graduation status", "Grade/CGPA above a required threshold", "Year of graduation", "Course/branch", "Professional certification", "Validity of credential", "Other"] },
      { id: "Q24", text: "Would you trust a credential verification system that combines AI-based authenticity checking, blockchain records, and Zero-Knowledge Proofs?", type: "radio", options: ["Definitely yes", "Probably yes", "Not sure", "Probably no", "Definitely no"] }
    ]
  },
  {
    section: "Section 7 — Adoption & Willingness",
    questions: [
      { id: "Q25", text: "Would you use a system like CredenSync if it were available?", type: "radio", options: ["Definitely yes", "Probably yes", "Not sure", "Probably no", "Definitely no"] },
      { id: "Q26", text: "Would you recommend such a system to others?", type: "radio", options: ["Yes", "Maybe", "No"] },
      { id: "Q27", text: "What would prevent you from using CredenSync?", type: "checkbox", options: ["Lack of trust", "Privacy concerns", "Technical complexity", "Lack of institutional adoption", "Lack of awareness", "Cost", "Prefer existing systems", "Concern about AI accuracy", "Concern about blockchain", "Concern about ZKPs", "Nothing", "Other"] },
      { id: "Q28", text: "What would make you trust such a system?", type: "checkbox", options: ["Government/institutional adoption", "University verification", "Transparent technology", "Blockchain-based records", "AI-based authenticity checking", "Zero-Knowledge Proof privacy", "Independent security audit", "Easy-to-use interface", "Strong data protection policies", "Other"] }
    ]
  },
  {
    section: "Section 8 — Open-Ended VoS Questions",
    questions: [
      { id: "Q29", text: "What is the biggest problem you face with the current credential verification process?", type: "text" },
      { id: "Q30", text: "Can you describe a situation where credential verification caused a delay, inconvenience, or difficulty?", type: "text" },
      { id: "Q31", text: "What concerns you most when submitting educational or identity documents online?", type: "text" },
      { id: "Q32", text: "In your opinion, how can credential verification be made more secure and privacy-friendly?", type: "text" },
      { id: "Q33", text: "What features would you expect from an ideal digital credential verification system?", type: "text" },
      { id: "Q34", text: "Do you have any suggestions or concerns regarding the CredenSync concept?", type: "text" }
    ]
  },
  {
    section: "Section 9 — Follow-Up",
    questions: [
      { id: "Q35", text: "Would you be willing to participate in a follow-up interview or product testing session?", type: "radio", options: ["Yes", "No", "Maybe"] },
      { id: "Q36", text: "Optional follow-up contact information (If Yes, collect contact details separately and only with the respondent's consent)", type: "shorttext" }
    ]
  }
];

export const SHORT_VERSION_QUESTIONS = [
  "Q1", "Q4", "Q6", "Q8", "Q10", "Q13", "Q14", "Q17", "Q18", "Q20", "Q21", "Q22", "Q24", "Q25", "Q29", "Q30", "Q31", "Q32", "Q34"
];
