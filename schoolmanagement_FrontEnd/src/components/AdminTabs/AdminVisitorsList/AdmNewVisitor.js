import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ApiUrl } from "../../../ApiUrl";
import "./AdmNewVisitor.css";
import useFetchDepartments from "../../hooks/useFetchDepartments";
import useFetchSessionList from "../../hooks/fetchSessionList";
import useFetchCourseByFilter from "../../hooks/useFetchCourses";

const AdmAttendanceEntry = () => {
  // const placementData = location.state?.placementData || {}; // Retrieve passed data
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const [visitorName, setVisitorName] = useState("");

  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [whomToVisit, setWhomToVisit] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  // Get org/branch from sessionStorage
  const orgId = sessionStorage.getItem("organization_id") || "1";
  const branchId = sessionStorage.getItem("branch_id") || "1";

  // Fetch batch (session) list to get a valid batch ID
  const { BatchList } = useFetchSessionList(orgId, branchId);
  const batchId = BatchList && BatchList.length > 0 ? BatchList[0].id : null;

  // Fetch course list to get a valid course ID  
  const { CourseList } = useFetchCourseByFilter(orgId, branchId, batchId);
  const courseId = CourseList && CourseList.length > 0 ? CourseList[0].id : null;

  // Now fetch departments with all required parameters using the NEW relaxed hook
  const { DepartmentList } = useFetchDepartments(orgId, branchId, null, null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);


  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const fileInputRef = useRef(null);

  const validateFields = () => {
    const newErrors = {};

    if (!purposeOfVisit.trim())
      newErrors.purposeOfVisit = "Purpose is required";
    if (!whomToVisit.trim())
      newErrors.whomToVisit = "Whom to visit is required";

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClear = () => {

    setVisitorName("");
    setPurposeOfVisit("");
    setWhomToVisit("");
    setPhone("");
    setEmail("");
    setVehicleNo("");
    setSelectedDepartment(null);
    setAddress("");
    setErrors({});
    setImage(null);
    setIsCameraOn(false);

    // Stop camera if active
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Reset file input if required
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    const org_id = sessionStorage.getItem("organization_id") || "1";
    const branch_id = sessionStorage.getItem("branch_id") || "1";
    const created_by = sessionStorage.getItem("userId") || "1";

    const formData = new FormData();
    formData.append("organization", org_id);
    formData.append("branch", branch_id);
    formData.append("visitor_name", visitorName);
    formData.append("purpose_of_visit", purposeOfVisit);
    formData.append("whom_to_visit", whomToVisit);
    formData.append("phone", phone);
    formData.append("email", email);

    // Convert base64 image to blob if exists
    if (image) {
      formData.append("upload_file", dataURItoBlob(image));
    }

    formData.append("vehicle_no", vehicleNo);

    // Get current datetime - send as ISO string which Django will interpret correctly
    // Backend uses visit_date.time() for InTime
    const visitDateTime = new Date().toISOString();
    formData.append("visit_date", visitDateTime);

    if (selectedDepartment) {
      formData.append("department", selectedDepartment.value);
    }

    formData.append("address", address);
    formData.append("created_by", created_by);

    try {
      const token = localStorage.getItem("accessToken");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${ApiUrl.apiurl}Visitor/create`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const result = await response.json();
      console.log("Visitor API Response:", result);

      if (result.message === "success") {
        alert("Visitor entry saved successfully!");
        navigate("/admin/visitors-list");
      } else {
        // Show specific error from backend if available
        const errorMsg = result.error ? JSON.stringify(result.error) : "Unknown error";
        alert("Failed to save visitor entry: " + errorMsg);
      }
    } catch (error) {
      console.error("Error submitting visitor data:", error);
      alert("Failed to save visitor entry.");
    }
  };


  // Start the camera
  const startCamera = async () => {
    try {
      setIsCameraOn(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setIsCameraOn(false);

      // Provide user-friendly error messages
      if (error.name === 'NotAllowedError') {
        alert('Camera access denied. Please allow camera permissions in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera found on this device.');
      } else if (error.name === 'NotSupportedError' || error.name === 'TypeError') {
        alert('Camera access requires HTTPS connection. Please access this page using HTTPS (https://) instead of HTTP (http://).');
      } else {
        alert(`Camera error: ${error.message || 'Unable to access camera'}`);
      }
    }
  };

  // Capture the image
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setImage(canvas.toDataURL("image/png"));
    }
  };

  // Upload the captured image
  const uploadImage = () => {
    if (image) {
      console.log("Uploading image:", image);
      alert("Image uploaded successfully!");
    }
  };

  const handleClose = () => {
    navigate("/admin/visitors-list");
  };
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card p-2">
            <div className="card-body">
              <p
                className="text-center fw-bold mb-3"
                style={{ fontSize: "18px" }}
              >
                NEW VISITOR
              </p>

              {/* Buttons Section */}
              <div className="col-12 ">
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  style={{
                    width: "150px",
                  }}
                  onClick={handleSave}
                >
                  Save
                </button>

                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  style={{
                    width: "150px",
                  }}
                  onClick={handleClear}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="btn btn-danger me-2"
                  style={{
                    width: "150px",
                  }}
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>

              {/* Form Section */}
              <div
                className="d-flex justify-content-center"
                style={{
                  border: "1px solid #ccc",
                  marginTop: "10px",
                  padding: "15px",
                  backgroundColor: "#EEF5FF",
                }}
              >
                <div
                  className="form-wrapper"
                  style={{ width: "100%", maxWidth: "600px" }}
                >
                  <form className="row">
                    {[
                      {
                        label: (
                          <>
                            Name <span style={{ color: "red" }}>*</span>
                          </>
                        ),

                        value: visitorName,
                        onChange: setVisitorName,
                      },
                      {
                        label: (
                          <>
                            Purpose Of Visit{" "}
                            <span style={{ color: "red" }}>*</span>
                          </>
                        ),
                        value: purposeOfVisit,
                        onChange: setPurposeOfVisit,
                        error: errors.purposeOfVisit,
                      },
                      {
                        label: (
                          <>
                            Whom To Visit{" "}
                            <span style={{ color: "red" }}>*</span>
                          </>
                        ),
                        value: whomToVisit,
                        onChange: setWhomToVisit,
                        error: errors.whomToVisit,
                      },
                      {
                        label: "Department",
                        component: (
                          <Select
                            options={
                              DepartmentList?.map((dept) => ({
                                value: dept.id,
                                label: dept.department_code,
                              })) || []
                            }
                            value={selectedDepartment}
                            className="detail"
                            onChange={setSelectedDepartment}
                            placeholder="Select Department"
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                minHeight: "38px",
                              }),
                            }}
                          />
                        ),
                      },
                      {
                        label: (
                          <>
                            Phone <span style={{ color: "red" }}>*</span>
                          </>
                        ),
                        value: phone,
                        onChange: setPhone,
                        error: errors.phone,
                        isPhone: true,
                      },

                      { label: "Email", value: email, onChange: setEmail },
                      {
                        label: "Vehicle No",
                        value: vehicleNo,
                        onChange: setVehicleNo,
                      },
                    ].map((field, idx) => (
                      <div
                        className="col-12 d-flex align-items-center mb-3 justify-content-center"
                        key={idx}
                      >
                        <label
                          className="me-3 text-end"
                          style={{ minWidth: "160px", fontWeight: "500" }}
                        >
                          {field.label}
                        </label>
                        <div style={{ width: "60%" }}>
                          {field.component ? (
                            field.component
                          ) : (
                            <>
                              <input
                                type="text"
                                className="form-control detail"
                                value={field.value}
                                onChange={(e) =>
                                  field.isPhone
                                    ? /^\d{0,10}$/.test(e.target.value) &&
                                    field.onChange(e.target.value)
                                    : field.onChange(e.target.value)
                                }
                              />
                              {field.error && (
                                <small className="text-danger">
                                  {field.error}
                                </small>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="col-12 d-flex align-items-start mb-3 justify-content-center">
                      <label
                        className="me-3 text-end"
                        style={{ minWidth: "160px", fontWeight: "500" }}
                      >
                        Address
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        className="form-control detail-textarea"
                        rows="3"
                        style={{ width: "60%" }}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      ></textarea>
                    </div>
                  </form>

                  {/* Camera Section */}
                  <div className="camera-section mt-4 text-center">
                    <button
                      onClick={startCamera}
                      className="btn btn-info btn-sm"
                    >
                      Live Camera
                    </button>
                    {isCameraOn && (
                      <div className="mt-2">
                        <video
                          ref={videoRef}
                          autoPlay
                          className="video-feed"
                          style={{ maxWidth: "100%" }}
                        />
                      </div>
                    )}
                    <div className="mt-2">
                      <button
                        onClick={captureImage}
                        disabled={!isCameraOn}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Capture
                      </button>
                      <button
                        onClick={uploadImage}
                        disabled={!image}
                        className="btn btn-success btn-sm"
                      >
                        Upload
                      </button>
                    </div>
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    {image && (
                      <div className="captured-image mt-3">
                        <h4>Captured Picture</h4>
                        <img
                          src={image}
                          alt="Captured"
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </div>
                    )}
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
export default AdmAttendanceEntry;
