import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiUrl } from "../../../ApiUrl";
import html2pdf from "html2pdf.js";
import { extractDocumentNo } from "../../../utils/formatRefNo";

const getTodayStr = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const getTodayISO = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const inputInline = (extraStyle = {}) => ({
  border: "none",
  borderBottom: "1px solid #000",
  outline: "none",
  fontFamily: "serif",
  fontSize: "14px",
  background: "transparent",
  color: "#000",
  ...extraStyle,
});

const BonafideCertificateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Edit mode: state has { certificate: {...} }; Create mode: state has student data directly; View mode: viewMode: true
  const certificate = location.state?.certificate;
  const viewMode = location.state?.viewMode || false;
  const isEditMode = !!certificate && !viewMode;
  const isViewMode = viewMode;

  const studentData = isEditMode || isViewMode ? {} : (location.state || {});
  const [formData, setFormData] = useState(() => {
    if (isEditMode || isViewMode) {
      return {
        ...certificate,
        studentname: certificate.student_name || "",
        academic_year: certificate.academic_year_str || certificate.academic_year || "",
        purpose: certificate.purpose || "Educational Loan Purpose",
        document_no: extractDocumentNo("BC", certificate.document_no || certificate.bc_number || certificate.bonafide_certificate_no),
      };
    }
    return {
      ...studentData,
      ...studentData.studentcertificatedetails,
      purpose: (studentData.studentcertificatedetails?.purpose) || "Educational Loan Purpose",
    };
  });

  const [isFieldsDisabled, setIsFieldsDisabled] = useState(isViewMode);

  const set = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  const [errors, setErrors] = useState({});
  
  // Fields that are fetched from student registration and should be disabled
  const disabledFields = new Set(["studentname", "course_name", "academic_year", "current_year", "admission_quota", "session"]);

  const validateFields = () => {
    const newErrors = {};
    if (!formData.document_no?.trim()) newErrors.document_no = "Ref No is required";
    if (!formData.course_name?.trim()) newErrors.course_name = "Course is required";
    if (!formData.academic_year?.trim()) newErrors.academic_year = "Academic year is required";
    if (!formData.admission_quota?.trim()) newErrors.admission_quota = "Quota is required";
    if (!formData.current_year?.trim()) newErrors.current_year = "Current year is required";
    if (!formData.session?.trim()) newErrors.session = "Session is required";
    if (!formData.purpose?.trim()) newErrors.purpose = "Purpose is required";
    if (!formData.course_fee_y1?.trim()) newErrors.course_fee_y1 = "Required";
    if (!formData.course_fee_y2?.trim()) newErrors.course_fee_y2 = "Required";
    if (!formData.course_fee_y3?.trim()) newErrors.course_fee_y3 = "Required";
    if (!formData.course_fee_y4?.trim()) newErrors.course_fee_y4 = "Required";
    if (!formData.hostel_fee_y1?.trim()) newErrors.hostel_fee_y1 = "Required";
    if (!formData.hostel_fee_y2?.trim()) newErrors.hostel_fee_y2 = "Required";
    if (!formData.hostel_fee_y3?.trim()) newErrors.hostel_fee_y3 = "Required";
    if (!formData.hostel_fee_y4?.trim()) newErrors.hostel_fee_y4 = "Required";
    if (!formData.misc_fee_y1?.trim()) newErrors.misc_fee_y1 = "Required";
    if (!formData.misc_fee_y2?.trim()) newErrors.misc_fee_y2 = "Required";
    if (!formData.misc_fee_y3?.trim()) newErrors.misc_fee_y3 = "Required";
    if (!formData.misc_fee_y4?.trim()) newErrors.misc_fee_y4 = "Required";
    if (!formData.grand_total_y1?.trim()) newErrors.grand_total_y1 = "Required";
    if (!formData.grand_total_y2?.trim()) newErrors.grand_total_y2 = "Required";
    if (!formData.grand_total_y3?.trim()) newErrors.grand_total_y3 = "Required";
    if (!formData.grand_total_y4?.trim()) newErrors.grand_total_y4 = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isEditMode) return; // In edit mode, data is already pre-filled from certificate
    const orgId = localStorage.getItem("orgId");
    const branchId = localStorage.getItem("branchId");
    const studentId = localStorage.getItem("selectedCertificateStudentId") || studentData.student_id;
    if (!orgId || !branchId || !studentId) return;
    fetch(
      `${ApiUrl.apiurl}StudentRegistrationApi/GetStudentDetailsBasedOnId/?organization_id=${orgId}&branch_id=${branchId}&student_id=${studentId}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res?.data?.student_basic_details) {
          const s = res.data.student_basic_details;
          const fullName = [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(" ");
          setFormData((prev) => ({
            ...prev,
            studentname: fullName || s.student_name || "",
            father_name: s.father_name || prev.father_name || "",
            course_name: s.course_name || prev.course_name || "",
            academic_year: s.academic_year || prev.academic_year || "",
            current_year: s.academic_year || prev.current_year || "",
            session: s.batch_name || prev.session || "",
          }));
        }
      })
      .catch((err) => console.error("Failed to fetch student details:", err));
  }, []);

  // Auto-generate unique Ref No for new certificates immediately on load
  useEffect(() => {
    if (isEditMode || formData.document_no) return; // Skip if editing or already has Ref No

    // Generate Ref No immediately using localStorage counter (no API delay)
    const generateRefNo = () => {
      let nextNum = 1;
      const cachedCounter = localStorage.getItem("bc_certificate_counter");
      
      if (cachedCounter) {
        nextNum = parseInt(cachedCounter) + 1;
      }
      
      const refNo = `BC${String(nextNum).padStart(3, '0')}`;
      localStorage.setItem("bc_certificate_counter", nextNum.toString());
      return refNo;
    };

    const refNo = generateRefNo();
    setFormData((prev) => ({ ...prev, document_no: refNo }));
  }, [isEditMode, formData.session]);

  const handleClose = () => {
    const keysToRetain = ["academicSessionId", "branchId", "nextAcademicSessionId", "orgId"];
    const retainedValues = keysToRetain.reduce((acc, key) => {
      const value = localStorage.getItem(key);
      if (value !== null) acc[key] = value;
      return acc;
    }, {});
    localStorage.clear();
    Object.entries(retainedValues).forEach(([key, value]) => localStorage.setItem(key, value));
    navigate("/admin/student-certificate");
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    try {
      const student = localStorage.getItem("selectedCertificateStudentId") || studentData.student_id || null;
      const session = localStorage.getItem("academicSessionId");
      const org_id = localStorage.getItem("orgId");
      const branch_id = localStorage.getItem("branchId");
      const document_type = localStorage.getItem("selectedDocumentType") || "BC";
      const docNo = formData.document_no || "";
      const [prefix, ...rest] = docNo.split("/");
      const postfix = rest.join("/");
      const todayISO = getTodayISO();

      const payload = {
        student, session, org_id, branch_id, document_type,
        transfer_certificate_no_prefix: prefix || docNo,
        transfer_certificate_no_postfix: postfix || "",
        transfer_certificate_no: docNo,
        transfer_certificate_id: 0,
        tc_applied_date: todayISO,
        tc_issued_date: todayISO,
        other_remarks: "",
        status: "N",
        cancelled_on: null,
        cancelled_remarks: "",
        cancelled_by: "",
        course_name: formData.course_name || "",
        academic_year: formData.academic_year || "",
        admission_quota: formData.admission_quota || "",
        current_year: formData.current_year || "",
        year_from: formData.session || formData.academic_year || "",
        year_to: formData.session || formData.academic_year || "",
        purpose: formData.purpose || "Educational Loan Purpose",
        course_fee_y1: formData.course_fee_y1 || "",
        course_fee_y2: formData.course_fee_y2 || "",
        course_fee_y3: formData.course_fee_y3 || "",
        course_fee_y4: formData.course_fee_y4 || "",
        hostel_fee_y1: formData.hostel_fee_y1 || "",
        hostel_fee_y2: formData.hostel_fee_y2 || "",
        hostel_fee_y3: formData.hostel_fee_y3 || "",
        hostel_fee_y4: formData.hostel_fee_y4 || "",
        misc_fee_y1: formData.misc_fee_y1 || "",
        misc_fee_y2: formData.misc_fee_y2 || "",
        misc_fee_y3: formData.misc_fee_y3 || "",
        misc_fee_y4: formData.misc_fee_y4 || "",
        grand_total_y1: formData.grand_total_y1 || "",
        grand_total_y2: formData.grand_total_y2 || "",
        grand_total_y3: formData.grand_total_y3 || "",
        grand_total_y4: formData.grand_total_y4 || "",
      };

      const response = await fetch(`${ApiUrl.apiurl}StudentCertificate/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Bonafide Certificate saved successfully! Ref No: ${formData.document_no}`);
        console.log(result);
        const academicSessionId = localStorage.getItem("academicSessionId");
        const branchId = localStorage.getItem("branchId");
        const nextAcademicSessionId = localStorage.getItem("nextAcademicSessionId");
        const orgId = localStorage.getItem("orgId");
        localStorage.clear();
        localStorage.setItem("academicSessionId", academicSessionId);
        localStorage.setItem("branchId", branchId);
        localStorage.setItem("nextAcademicSessionId", nextAcademicSessionId);
        localStorage.setItem("orgId", orgId);
        navigate("/admin/student-certificate");
      } else {
        const error = await response.json();
        alert(`Error saving Bonafide Certificate: ${error.message}`);
      }
    } catch (error) {
      console.error("Error while saving:", error);
      alert("An error occurred while saving the Bonafide Certificate.");
    }
  };

  const handleUpdate = async () => {
    if (!validateFields()) return;
    try {
      const org_id = localStorage.getItem("orgId");
      const branch_id = localStorage.getItem("branchId");
      const student_certificate_id = certificate.id;
      const document_type = "BC";

      const payload = {
        issue_date: getTodayISO(),
        purpose: formData.purpose || "Educational Loan Purpose",
        certificate_status: certificate.certificate_status || "Pending",
        course_name: formData.course_name || "",
        academic_year: formData.academic_year || "",
        admission_quota: formData.admission_quota || "",
        current_year: formData.current_year || "",
        year_from: formData.session || "",
        year_to: formData.session || "",
        course_fee_y1: formData.course_fee_y1 || "",
        course_fee_y2: formData.course_fee_y2 || "",
        course_fee_y3: formData.course_fee_y3 || "",
        course_fee_y4: formData.course_fee_y4 || "",
        hostel_fee_y1: formData.hostel_fee_y1 || "",
        hostel_fee_y2: formData.hostel_fee_y2 || "",
        hostel_fee_y3: formData.hostel_fee_y3 || "",
        hostel_fee_y4: formData.hostel_fee_y4 || "",
        misc_fee_y1: formData.misc_fee_y1 || "",
        misc_fee_y2: formData.misc_fee_y2 || "",
        misc_fee_y3: formData.misc_fee_y3 || "",
        misc_fee_y4: formData.misc_fee_y4 || "",
        grand_total_y1: formData.grand_total_y1 || "",
        grand_total_y2: formData.grand_total_y2 || "",
        grand_total_y3: formData.grand_total_y3 || "",
        grand_total_y4: formData.grand_total_y4 || "",
      };

      const response = await fetch(
        `${ApiUrl.apiurl}StudentCertificate/update/?organization_id=${org_id}&branch_id=${branch_id}&student_certificate_id=${student_certificate_id}&document_type=${document_type}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Bonafide Certificate updated successfully!");
        const academicSessionId = localStorage.getItem("academicSessionId");
        const branchId = localStorage.getItem("branchId");
        const nextAcademicSessionId = localStorage.getItem("nextAcademicSessionId");
        const orgId = localStorage.getItem("orgId");
        localStorage.clear();
        localStorage.setItem("academicSessionId", academicSessionId);
        localStorage.setItem("branchId", branchId);
        localStorage.setItem("nextAcademicSessionId", nextAcademicSessionId);
        localStorage.setItem("orgId", orgId);
        navigate("/admin/student-certificate");
      } else {
        const error = await response.json();
        alert(`Error updating Bonafide Certificate: ${error.message}`);
      }
    } catch (error) {
      console.error("Error while updating:", error);
      alert("An error occurred while updating the Bonafide Certificate.");
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("certificate-print-area");
    if (!element) return;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Bonafide_Certificate_${formData.studentname || "Student"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF.");
    }
  };

  const feeInput = (field) => (
    <div>
      <input
        type="text"
        disabled={isFieldsDisabled}
        value={formData[field] || ""}
        onChange={set(field)}
        style={{ width: "100%", border: "none", outline: "none", textAlign: "center", fontSize: "13px", background: "transparent" }}
      />
      {errors[field] && <small className="text-danger" style={{ display: "block", fontSize: "10px", textAlign: "center" }}>{errors[field]}</small>}
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <h3 className="text-center mb-4">Bonafide Certificate</h3>

              {/* Action Buttons */}
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  {/* Save Button - Only in Create & Edit Mode */}
                  {!isViewMode && (
                    <button type="button" className="btn btn-primary me-2" style={{ width: "150px" }} onClick={handleSave} disabled={isEditMode}>Save</button>
                  )}
                  
                  {/* Update Button - Only in Edit Mode (not View) */}
                  {isEditMode && !isViewMode && (
                    <button type="button" className="btn btn-primary me-2" style={{ width: "150px" }} onClick={handleUpdate}>Update</button>
                  )}

                  {/* Download PDF Button - Only in View Mode */}
                  {isViewMode && (
                    <button type="button" className="btn btn-success me-2" style={{ width: "150px" }} onClick={handleDownloadPDF}>Download PDF</button>
                  )}

                  <button type="button" className="btn btn-secondary me-2" style={{ width: "150px" }}
                    onClick={() => {
                      if (isEditMode) {
                        setFormData({
                          ...certificate,
                          studentname: certificate.student_name || "",
                          academic_year: certificate.academic_year_str || certificate.academic_year || "",
                          purpose: certificate.purpose || "Educational Loan Purpose",
                        });
                        return;
                      }
                      setFormData({ ...studentData, ...studentData.studentcertificatedetails, purpose: studentData.studentcertificatedetails?.purpose || "Educational Loan Purpose" });
                    }}>
                    Clear
                  </button>
                  <button type="button" className="btn btn-danger me-2" style={{ width: "150px" }} onClick={handleClose}>Close</button>
                </div>
              </div>

              {/* Certificate Template */}
              <div id="certificate-print-area" style={{ border: "2px solid #000", padding: "40px 50px", maxWidth: "820px", margin: "0 auto", backgroundColor: "#fff", fontFamily: "serif", fontSize: "14px" }}>

                {/* Ref and Date row */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                    <strong style={{ marginTop: "2px" }}>Ref: -</strong>
                    <div>
                      <input type="text" disabled value={formData.document_no || ""}
                        style={inputInline({ width: "160px" })} />
                      {errors.document_no && <small className="text-danger" style={{ display: "block" }}>{errors.document_no}</small>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <strong>Date:-</strong>
                    <input type="text" disabled value={getTodayStr()}
                      style={inputInline({ width: "130px" })} />
                  </div>
                </div>

                {/* Title */}
                <h2 style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", fontSize: "22px", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1px" }}>
                  BONAFIED CERTIFICATE
                </h2>
                <h5 style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", fontSize: "16px", textTransform: "uppercase", marginBottom: "24px" }}>
                  TO WHOM EVER IT MAY CONCERN
                </h5>

                {/* Body paragraph */}
                <div style={{ lineHeight: "2.2", textAlign: "justify" }}>
                  <span>This is to certify that&nbsp;(&nbsp;</span>
                  <input type="text" disabled value={formData.studentname || ""}
                    style={inputInline({ minWidth: "180px", textAlign: "center" })} />
                  <span>&nbsp;) is a Bonafide student of&nbsp;<strong>Sparsh College of Nursing and Allied Sciences, Kantabada, Bhubaneswar.</strong>
                  &nbsp;She/he is taken admission in our College in&nbsp;</span>
                  <span style={{ display: "inline-block", verticalAlign: "top" }}>
                    <input type="text" disabled value={formData.course_name || formData.coursename || ""}
                      style={inputInline({ width: "140px", textAlign: "center" })} />
                    {errors.course_name && <small className="text-danger" style={{ display: "block", fontSize: "11px" }}>{errors.course_name}</small>}
                  </span>
                  <strong>course</strong>
                  <span>&nbsp;for the academic Year&nbsp;</span>
                  <span style={{ display: "inline-block", verticalAlign: "top" }}>
                    <input type="text" disabled value={formData.academic_year || formData.academicyear || ""}
                      style={inputInline({ width: "80px", textAlign: "center" })} />
                    {errors.academic_year && <small className="text-danger" style={{ display: "block", fontSize: "11px" }}>{errors.academic_year}</small>}
                  </span>
                  <span>&nbsp;under&nbsp;</span>
                  <span style={{ display: "inline-block", verticalAlign: "top" }}>
                    <input type="text" disabled={isFieldsDisabled} value={formData.admission_quota || ""} onChange={set("admission_quota")}
                      style={inputInline({ width: "120px", textAlign: "center" })} />
                    {errors.admission_quota && <small className="text-danger" style={{ display: "block", fontSize: "11px" }}>{errors.admission_quota}</small>}
                  </span>
                  <strong>Quota</strong>
                  <span>. But now she/he is continuing her study in&nbsp;</span>
                  <span style={{ display: "inline-block", verticalAlign: "top" }}>
                    <input type="text" disabled value={formData.current_year || ""}
                      style={inputInline({ width: "100px", textAlign: "center" })} />
                    {errors.current_year && <small className="text-danger" style={{ display: "block", fontSize: "11px" }}>{errors.current_year}</small>}
                  </span>
                  <span>&nbsp;year&nbsp;(&nbsp;</span>
                  <span style={{ display: "inline-block", verticalAlign: "top" }}>
                    <input type="text" disabled value={formData.session || formData.academic_year || ""}
                      style={inputInline({ width: "100px", textAlign: "center" })} />
                    {errors.session && <small className="text-danger" style={{ display: "block", fontSize: "11px" }}>{errors.session}</small>}
                  </span>
                  <span>&nbsp;) successfully. We are hereby inform you that the following fees structure is applicable for the current academic year. This certificate is issued to this student on her request for the purpose of&nbsp;</span>
                  <span style={{ display: "inline-block", verticalAlign: "top" }}>
                    <input type="text" disabled={isFieldsDisabled} value={formData.purpose || "Educational Loan Purpose"} onChange={set("purpose")}
                      style={inputInline({ width: "220px", textAlign: "center", fontWeight: "bold" })} />
                    {errors.purpose && <small className="text-danger" style={{ display: "block", fontSize: "11px" }}>{errors.purpose}</small>}
                  </span>
                  <strong>.</strong>
                </div>

                {/* Fees Structure */}
                <div style={{ marginTop: "28px", marginBottom: "28px" }}>
                  <p style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", marginBottom: "8px" }}>Fees Structure</p>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr>
                        <th rowSpan={2} style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>SL NO</th>
                        <th rowSpan={2} style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>PARTICULARS</th>
                        <th colSpan={4} style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>B.SC NURSING</th>
                      </tr>
                      <tr>
                        <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>First</th>
                        <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Second</th>
                        <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Third</th>
                        <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Fourth Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { sl: 1, label: "Course Fee",        y1: "course_fee_y1", y2: "course_fee_y2", y3: "course_fee_y3", y4: "course_fee_y4" },
                        { sl: 2, label: "Hostel Fee",        y1: "hostel_fee_y1", y2: "hostel_fee_y2", y3: "hostel_fee_y3", y4: "hostel_fee_y4" },
                        { sl: 3, label: "Miscellaneous fee", y1: "misc_fee_y1",   y2: "misc_fee_y2",   y3: "misc_fee_y3",   y4: "misc_fee_y4"   },
                        { sl: 4, label: "Grand Total",       y1: "grand_total_y1", y2: "grand_total_y2", y3: "grand_total_y3", y4: "grand_total_y4" },
                      ].map((row) => (
                        <tr key={row.sl}>
                          <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>{row.sl}</td>
                          <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>{row.label}</td>
                          <td style={{ border: "1px solid #000", padding: "4px" }}>{feeInput(row.y1)}</td>
                          <td style={{ border: "1px solid #000", padding: "4px" }}>{feeInput(row.y2)}</td>
                          <td style={{ border: "1px solid #000", padding: "4px" }}>{feeInput(row.y3)}</td>
                          <td style={{ border: "1px solid #000", padding: "4px" }}>{feeInput(row.y4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bank Details */}
                <div style={{ marginTop: "20px" }}>
                  <p style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", marginBottom: "10px" }}>College Bank Account Details</p>
                  <table style={{ fontSize: "13px", borderSpacing: "0 4px" }}>
                    <tbody>
                      {[
                        ["ACCOUNT NAME",   "SPARSH COLLEGE OF NURSING & ALLIED SCIENCES"],
                        ["ACCOUNT NUMBER", "242305002528"],
                        ["BANK",           "ICICI BANK"],
                        ["BRANCH NAME",    "SAHEED NAGAR, BHUBANESWAR"],
                        ["IFSC CODE",      "ICIC0002423"],
                      ].map(([label, value]) => (
                        <tr key={label}>
                          <td style={{ fontWeight: "bold", paddingRight: "12px", whiteSpace: "nowrap" }}>{label}</td>
                          <td style={{ paddingRight: "8px", fontWeight: "bold" }}>:</td>
                          <td style={{ fontWeight: "bold" }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Principal */}
                <div style={{ textAlign: "right", marginTop: "60px", fontStyle: "italic", fontSize: "14px" }}>
                  Principal
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonafideCertificateForm;
