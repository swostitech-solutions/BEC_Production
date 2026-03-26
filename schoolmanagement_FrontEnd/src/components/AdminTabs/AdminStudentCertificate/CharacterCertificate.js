import React, { useState, useEffect, useRef } from "react";
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

const ConductCertificate = () => {
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
        document_no: extractDocumentNo("CC", certificate.document_no || certificate.cc_number)
      };
    }
    return {
      ...studentData,
      ...studentData.studentcertificatedetails,
    };
  });
  const [isFieldsDisabled, setIsFieldsDisabled] = useState(isViewMode);
  const apiStudentData = useRef({});
  
  // Fields that are fetched from student registration and should be disabled
  const disabledFields = new Set(["studentname", "father_name"]);

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
          const fetched = {
            studentname: fullName || s.student_name || "",
            father_name: s.father_name || "",
          };
          apiStudentData.current = fetched;
          setFormData((prev) => ({
            ...prev,
            ...fetched,
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
      const cachedCounter = localStorage.getItem("cc_certificate_counter");
      
      if (cachedCounter) {
        nextNum = parseInt(cachedCounter) + 1;
      }
      
      const refNo = `CC${String(nextNum).padStart(3, '0')}`;
      localStorage.setItem("cc_certificate_counter", nextNum.toString());
      return refNo;
    };

    const refNo = generateRefNo();
    setFormData((prev) => ({ ...prev, document_no: refNo }));
  }, [isEditMode]);

  const handleClose = () => {
    const keysToRetain = [
      "academicSessionId",
      "branchId",
      "nextAcademicSessionId",
      "orgId",
    ];
    const retainedValues = keysToRetain.reduce((acc, key) => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});
    localStorage.clear();
    Object.entries(retainedValues).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    navigate("/admin/student-certificate");
  };
  const validateFields = () => {
    const errors = {};
    if (!formData.studentname?.trim()) errors.studentname = "Student name is required";
    if (!formData.father_name?.trim()) errors.father_name = "Father's name is required";
    if (!formData.from_month?.trim()) errors.from_month = "From month is required";
    if (!formData.to_month?.trim()) errors.to_month = "To month is required";
    return errors;
  };

  const [fieldErrors, setFieldErrors] = useState({});
  const handleSave = async () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      alert("Please fill all mandatory fields!");
      return;
    }
    setFieldErrors({});

    try {
      const student = localStorage.getItem("selectedCertificateStudentId") || studentData.student_id || null;
      const session = localStorage.getItem("academicSessionId");
      const org_id = localStorage.getItem("orgId");
      const branch_id = localStorage.getItem("branchId");
      const document_type = localStorage.getItem("selectedDocumentType") || "CC";

      const docNo = formData.document_no || "";
      const [prefix, ...rest] = docNo.split("/");
      const postfix = rest.join("/");

      const todayISO = getTodayISO();

      const payload = {
        student,
        session,
        org_id,
        branch_id,
        document_type,
        transfer_certificate_no_prefix: prefix || docNo,
        transfer_certificate_no_postfix: postfix || "",
        transfer_certificate_no: docNo,
        transfer_certificate_id: 0,
        tc_applied_date: todayISO,
        tc_issued_date: todayISO,
        general_conduct: "Good",
        other_remarks: "",
        status: "N",
        from_month: formData.from_month || "",
        to_month: formData.to_month || "",
        reason_for_tc: "",
        cancelled_on: null,
        cancelled_remarks: "",
        cancelled_by: "",
        father_name: formData.father_name || "",
        student_behaviour: "Good",
      };

      const response = await fetch(`${ApiUrl.apiurl}StudentCertificate/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Conduct Certificate saved successfully! Ref No: ${formData.document_no}`);
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
        alert(`Error saving Conduct Certificate: ${error.message}`);
      }
    } catch (error) {
      console.error("Error while saving:", error);
      alert("An error occurred while saving the Conduct Certificate.");
    }
  };

  const handleUpdate = async () => {
    try {
      const org_id = localStorage.getItem("orgId");
      const branch_id = localStorage.getItem("branchId");
      const student_certificate_id = certificate.id;
      const document_type = "CC";

      const payload = {
        issue_date: getTodayISO(),
        certificate_status: certificate.certificate_status || "Pending",
        father_name: formData.father_name || "",
        from_month: formData.from_month || "",
        to_month: formData.to_month || "",
        student_behaviour: "Good",
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
        alert("Conduct Certificate updated successfully!");
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
        alert(`Error updating Conduct Certificate: ${error.message}`);
      }
    } catch (error) {
      console.error("Error while updating:", error);
      alert("An error occurred while updating the Conduct Certificate.");
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("certificate-print-area");
    if (!element) return;
    
    // Temporarily adjust styling for PDF generation if needed
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Conduct_Certificate_${formData.studentname || "Student"}.pdf`,
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card p-0">
            <div className="card-body">
              <h3 className="text-center mb-4">Conduct Certificate</h3>

              {/* Action Buttons */}
              <div className="row mb-3 mt-3 mx-0">
                <div className="col-12 d-flex flex-wrap gap-2">
                  {/* Save Button - Only in Create & Edit Mode */}
                  {!isViewMode && (
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      style={{ width: "150px" }}
                      onClick={handleSave}
                      disabled={isEditMode}
                    >
                      Save
                    </button>
                  )}
                  
                  {/* Update Button - Only in Edit Mode (not View) */}
                  {isEditMode && !isViewMode && (
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      style={{ width: "150px" }}
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  )}

                  {/* Download PDF Button - Only in View Mode */}
                  {isViewMode && (
                    <button
                      type="button"
                      className="btn btn-success me-2"
                      style={{ width: "150px" }}
                      onClick={handleDownloadPDF}
                    >
                      Download PDF
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    style={{ width: "150px" }}
                    onClick={() => {
                      if (isEditMode) {
                        setFormData({
                          ...certificate,
                          studentname: certificate.student_name || "",
                        });
                        return;
                      }
                      setFormData((prev) => ({
                        ...prev,
                        ...apiStudentData.current,
                        document_no: "",
                        from_month: "",
                        to_month: "",
                      }));
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    style={{ width: "150px" }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Certificate Template */}
              <div
                id="certificate-print-area"
                style={{
                  border: "2px solid #000",
                  padding: "40px 50px",
                  maxWidth: "800px",
                  margin: "0 auto",
                  backgroundColor: "#fff",
                  fontFamily: "serif",
                  position: "relative",
                }}
              >
                {/* Corner marks */}
                <div style={{
                  position: "absolute", top: "8px", left: "8px",
                  width: "30px", height: "30px",
                  borderTop: "3px solid #000", borderLeft: "3px solid #000"
                }} />
                <div style={{
                  position: "absolute", top: "8px", right: "8px",
                  width: "30px", height: "30px",
                  borderTop: "3px solid #000", borderRight: "3px solid #000"
                }} />
                <div style={{
                  position: "absolute", bottom: "8px", left: "8px",
                  width: "30px", height: "30px",
                  borderBottom: "3px solid #000", borderLeft: "3px solid #000"
                }} />
                <div style={{
                  position: "absolute", bottom: "8px", right: "8px",
                  width: "30px", height: "30px",
                  borderBottom: "3px solid #000", borderRight: "3px solid #000"
                }} />

                {/* College Header */}
                <p style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "30px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  Sparsh College of Nursing &amp; Allied Sciences: Kantabada : BBSR.
                </p>

                {/* Ref No and Date Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: "bold", fontSize: "14px", whiteSpace: "nowrap" }}>REF.NO</span>
                    <input
                      type="text"
                      disabled
                      value={formData.document_no || ""}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #000",
                        outline: "none",
                        width: "180px",
                        fontFamily: "serif",
                        fontSize: "14px",
                        background: "transparent",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}>DATE :</span>
                    <input
                      type="text"
                      disabled
                      value={getTodayStr()}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #000",
                        outline: "none",
                        width: "140px",
                        fontFamily: "serif",
                        fontSize: "14px",
                        background: "transparent",
                        color: "#000",
                      }}
                    />
                  </div>
                </div>

                {/* Title */}
                <h4 style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  fontSize: "18px",
                  textTransform: "uppercase",
                  marginBottom: "40px",
                  letterSpacing: "2px",
                }}>
                  Conduct Certificate
                </h4>

                {/* Certificate Body */}
                <div style={{ fontSize: "15px", lineHeight: "2.8", fontWeight: "bold", textTransform: "uppercase" }}>
                  <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                    <span>IT IS TO CERTIFY THAT</span>
                    <input
                      type="text"
                      disabled
                      value={formData.studentname || ""}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #000",
                        outline: "none",
                        minWidth: "200px",
                        fontFamily: "serif",
                        fontSize: "15px",
                        fontWeight: "bold",
                        background: "transparent",
                        color: "#000",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    />
                    <span>D/O, S/O</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                    <input
                      type="text"
                      disabled
                      value={formData.father_name || ""}
                      style={{
                        border: "none",
                        borderBottom: "1px solid #000",
                        outline: "none",
                        minWidth: "260px",
                        fontFamily: "serif",
                        fontSize: "15px",
                        fontWeight: "bold",
                        background: "transparent",
                        color: "#000",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    />
                    <span>WHO HAS STUDIED IN THIS INSTITUTION FROM</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                    <input
                      type="text"
                      disabled={isFieldsDisabled}
                      value={formData.from_month || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, from_month: e.target.value }))
                      }
                      style={{
                        border: "none",
                        borderBottom: "1px solid #000",
                        outline: "none",
                        width: "160px",
                        fontFamily: "serif",
                        fontSize: "15px",
                        fontWeight: "bold",
                        background: "transparent",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    />
                    <span>TO</span>
                    <input
                      type="text"
                      disabled={isFieldsDisabled}
                      value={formData.to_month || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, to_month: e.target.value }))
                      }
                      style={{
                        border: "none",
                        borderBottom: "1px solid #000",
                        outline: "none",
                        width: "160px",
                        fontFamily: "serif",
                        fontSize: "15px",
                        fontWeight: "bold",
                        background: "transparent",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    />
                    <span>BEARS A GOOD</span>
                  </div>

                  <div>
                    <span>CHARACTER &amp; CONDUCT.</span>
                  </div>
                </div>

                {/* Principal Signature */}
                <div style={{ textAlign: "right", marginTop: "80px", fontWeight: "bold", fontSize: "15px", textTransform: "uppercase" }}>
                  <div style={{ borderTop: "1px solid #000", display: "inline-block", minWidth: "160px", paddingTop: "6px" }}>
                    PRINCIPAL
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConductCertificate;
