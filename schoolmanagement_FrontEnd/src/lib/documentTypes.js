/**
 * Document Type Definitions
 * 
 * Each document type has:
 * - value: Unique code for the document type (used in backend)
 * - label: Human-readable display name
 * - groupType: Category of document (STUDENT, EMPLOYEE, ORG, BRANCH, CIRCULAR, LIBRARY, OTHER)
 * - name: Full name for the document group
 */

export const DOCUMENT_TYPES = [
  // Student Documents
  {
    value: 'STUDENT_PROFILE_PIC',
    label: 'Student Profile Picture',
    groupType: 'STUDENT',
    name: 'Student Profile Picture',
    category: 'Student'
  },
  {
    value: 'STUDENT_REGISTRATION',
    label: 'Student Registration Document',
    groupType: 'STUDENT',
    name: 'Student Registration Document',
    category: 'Student'
  },
  {
    value: 'STUDENT_SEM_RESULT',
    label: 'Student Semester Result',
    groupType: 'STUDENT',
    name: 'Student Semester Result',
    category: 'Student'
  },
  {
    value: 'STUDENT_BIRTH_CERT',
    label: 'Student Birth Certificate',
    groupType: 'STUDENT',
    name: 'Student Birth Certificate',
    category: 'Student'
  },
  {
    value: 'STUDENT_AADHAAR',
    label: 'Student Aadhaar Card',
    groupType: 'STUDENT',
    name: 'Student Aadhaar Card',
    category: 'Student'
  },
  {
    value: 'STUDENT_TRANSFER_CERT',
    label: 'Student Transfer Certificate',
    groupType: 'STUDENT',
    name: 'Student Transfer Certificate',
    category: 'Student'
  },
  {
    value: 'STUDENT_MARKSHEET',
    label: 'Student Marksheet',
    groupType: 'STUDENT',
    name: 'Student Marksheet',
    category: 'Student'
  },
  {
    value: 'STUDENT_ID_PROOF',
    label: 'Student ID Proof',
    groupType: 'STUDENT',
    name: 'Student ID Proof',
    category: 'Student'
  },
  {
    value: 'STUDENT_CONDUCT_CERT',
    label: 'Student Conduct Certificate',
    groupType: 'STUDENT',
    name: 'Student Conduct Certificate',
    category: 'Student'
  },
  {
    value: 'STUDENT_MEDICAL_CERT',
    label: 'Student Medical Certificate',
    groupType: 'STUDENT',
    name: 'Student Medical Certificate',
    category: 'Student'
  },
  {
    value: 'STUDENT_INCOME_CERT',
    label: 'Student Income Certificate',
    groupType: 'STUDENT',
    name: 'Student Income Certificate',
    category: 'Student'
  },
  {
    value: 'STUDENT_CASTE_CERT',
    label: 'Student Caste Certificate',
    groupType: 'STUDENT',
    name: 'Student Caste Certificate',
    category: 'Student'
  },

  // Employee Documents
  {
    value: 'EMPLOYEE_PROFILE_PIC',
    label: 'Employee Profile Picture',
    groupType: 'EMPLOYEE',
    name: 'Employee Profile Picture',
    category: 'Employee'
  },
  {
    value: 'EMPLOYEE_RESUME',
    label: 'Employee Resume/CV',
    groupType: 'EMPLOYEE',
    name: 'Employee Resume/CV',
    category: 'Employee'
  },
  {
    value: 'EMPLOYEE_QUALIFICATION',
    label: 'Employee Qualification Certificate',
    groupType: 'EMPLOYEE',
    name: 'Employee Qualification Certificate',
    category: 'Employee'
  },
  {
    value: 'EMPLOYEE_ID_PROOF',
    label: 'Employee ID Proof',
    groupType: 'EMPLOYEE',
    name: 'Employee ID Proof',
    category: 'Employee'
  },
  {
    value: 'EMPLOYEE_JOINING_LETTER',
    label: 'Employee Joining Letter',
    groupType: 'EMPLOYEE',
    name: 'Employee Joining Letter',
    category: 'Employee'
  },
  {
    value: 'EMPLOYEE_APPOINTMENT_LETTER',
    label: 'Employee Appointment Letter',
    groupType: 'EMPLOYEE',
    name: 'Employee Appointment Letter',
    category: 'Employee'
  },
  {
    value: 'EMPLOYEE_EXPERIENCE_CERT',
    label: 'Employee Experience Certificate',
    groupType: 'EMPLOYEE',
    name: 'Employee Experience Certificate',
    category: 'Employee'
  },

  // Organization Documents
  {
    value: 'ORG_LOGO',
    label: 'Organization Logo',
    groupType: 'ORG',
    name: 'Organization Logo',
    category: 'Organization'
  },
  {
    value: 'ORG_REGISTRATION',
    label: 'Organization Registration',
    groupType: 'ORG',
    name: 'Organization Registration',
    category: 'Organization'
  },
  {
    value: 'ORG_LICENSE',
    label: 'Organization License',
    groupType: 'ORG',
    name: 'Organization License',
    category: 'Organization'
  },
  {
    value: 'ORG_PROSPECTUS',
    label: 'Organization Prospectus',
    groupType: 'ORG',
    name: 'Organization Prospectus',
    category: 'Organization'
  },

  // Branch Documents
  {
    value: 'BRANCH_PROSPECTUS',
    label: 'Branch Prospectus',
    groupType: 'BRANCH',
    name: 'Branch Prospectus',
    category: 'Branch'
  },
  {
    value: 'BRANCH_FACILITY_DOC',
    label: 'Branch Facility Document',
    groupType: 'BRANCH',
    name: 'Branch Facility Document',
    category: 'Branch'
  },

  // Circular Documents
  {
    value: 'CIRCULAR_NOTICE',
    label: 'Circular Notice',
    groupType: 'CIRCULAR',
    name: 'Circular Notice',
    category: 'Circular'
  },
  {
    value: 'CIRCULAR_HOLIDAY',
    label: 'Circular Holiday List',
    groupType: 'CIRCULAR',
    name: 'Circular Holiday List',
    category: 'Circular'
  },
  {
    value: 'CIRCULAR_EVENT',
    label: 'Circular Event Notice',
    groupType: 'CIRCULAR',
    name: 'Circular Event Notice',
    category: 'Circular'
  },

  // Library Documents
  {
    value: 'LIBRARY_BOOK_COVER',
    label: 'Library Book Cover',
    groupType: 'LIBRARY',
    name: 'Library Book Cover',
    category: 'Library'
  },
  {
    value: 'LIBRARY_EBOOK',
    label: 'Library E-Book',
    groupType: 'LIBRARY',
    name: 'Library E-Book',
    category: 'Library'
  },

  // Academic Documents (General)
  {
    value: 'ACADEMIC_SYLLABUS',
    label: 'Academic Syllabus',
    groupType: 'OTHER',
    name: 'Academic Syllabus',
    category: 'Academic'
  },
  {
    value: 'ACADEMIC_ASSIGNMENT',
    label: 'Academic Assignment',
    groupType: 'OTHER',
    name: 'Academic Assignment',
    category: 'Academic'
  },
  {
    value: 'ACADEMIC_STUDY_MATERIAL',
    label: 'Academic Study Material',
    groupType: 'OTHER',
    name: 'Academic Study Material',
    category: 'Academic'
  },
  {
    value: 'ACADEMIC_QUESTION_PAPER',
    label: 'Academic Question Paper',
    groupType: 'OTHER',
    name: 'Academic Question Paper',
    category: 'Academic'
  },
  {
    value: 'ACADEMIC_ANSWER_SHEET',
    label: 'Academic Answer Sheet',
    groupType: 'OTHER',
    name: 'Academic Answer Sheet',
    category: 'Academic'
  },
];

/**
 * Get document type by code
 * @param {string} code - Document type code
 * @returns {object|undefined} Document type object
 */
export const getDocumentTypeByCode = (code) => {
  return DOCUMENT_TYPES.find(dt => dt.value === code);
};

/**
 * Get document types by category
 * @param {string} category - Category name (Student, Employee, Organization, etc.)
 * @returns {array} Array of document types
 */
export const getDocumentTypesByCategory = (category) => {
  return DOCUMENT_TYPES.filter(dt => dt.category === category);
};

/**
 * Get document types by group type
 * @param {string} groupType - Group type (STUDENT, EMPLOYEE, ORG, BRANCH, CIRCULAR, LIBRARY, OTHER)
 * @returns {array} Array of document types
 */
export const getDocumentTypesByGroupType = (groupType) => {
  return DOCUMENT_TYPES.filter(dt => dt.groupType === groupType);
};

/**
 * Get all document categories
 * @returns {array} Array of unique category names
 */
export const getDocumentCategories = () => {
  return [...new Set(DOCUMENT_TYPES.map(dt => dt.category))];
};

/**
 * Document type validation rules
 * Returns requirements for a given document type
 */
export const getDocumentTypeRequirements = (code) => {
  const docType = getDocumentTypeByCode(code);
  if (!docType) return null;

  const requirements = {
    organization: true,
    branch: true,
    student: false,
    employee: false,
    course: false,
  };

  // Student documents require student selection
  if (docType.groupType === 'STUDENT') {
    requirements.student = true;
  }

  // Employee documents require employee selection
  if (docType.groupType === 'EMPLOYEE') {
    requirements.employee = true;
  }

  // Academic documents might require course/academic context
  if (docType.category === 'Academic') {
    requirements.course = true;
  }

  return requirements;
};

