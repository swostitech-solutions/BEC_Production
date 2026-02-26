import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import "./ForgotPasswordModal.css";
import { ApiUrl } from "../../ApiUrl";

const ForgotPasswordModal = ({ show, onHide }) => {
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = password === confirmPassword;

  // 🔹 STEP 1: SEND OTP

  
  const handleSendCode = async () => {
    if (!username) {
      setError("Please enter username");
      return;
    }

    // ✅ Get institute data from localStorage
    const instituteList = JSON.parse(
      localStorage.getItem("organizationBranchList")
    );

    if (!Array.isArray(instituteList) || instituteList.length === 0) {
      setError("Organization or Branch not found. Please login again.");
      return;
    }

    // ✅ Take first institute (or selected one if you store it later)
    const { organization_id, branch_id } = instituteList[0];

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${ApiUrl.apiurl}ForgotPassword/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: Number(organization_id),
          branch_id: Number(branch_id),
          username: username,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      await response.json();
      setStep(2); // move to OTP verification step
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 STEP 2: VERIFY OTP (✅ API INTEGRATED)
 const handleVerifyOtp = async () => {
   if (!otp) {
     setError("Please enter OTP");
     return;
   }

   // ✅ Get institute data from localStorage (SAME AS SEND OTP)
   const instituteList = JSON.parse(
     localStorage.getItem("organizationBranchList")
   );

   if (!Array.isArray(instituteList) || instituteList.length === 0) {
     setError("Organization or Branch not found. Please login again.");
     return;
   }

   // ✅ Take first institute
   const { organization_id, branch_id } = instituteList[0];

   try {
     setLoading(true);
     setError("");

     const response = await fetch(
       `${ApiUrl.apiurl}ForgotPassword/verify-otp/`,
       {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           organization_id: Number(organization_id),
           branch_id: Number(branch_id),
           username,
           otp,
         }),
       }
     );

     if (!response.ok) {
       throw new Error("Invalid OTP");
     }

     await response.json();

     // ✅ OTP VERIFIED → ENABLE PASSWORD FIELDS
     setStep(3);
   } catch (err) {
     setError(err.message || "OTP verification failed");
   } finally {
     setLoading(false);
   }
 };


  // 🔹 STEP 3: RESET PASSWORD (API can be added later)
  // 🔹 STEP 3: CHANGE PASSWORD (API INTEGRATED — NO AUTH HEADER)
  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError("Please enter password");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${ApiUrl.apiurl}RegisterEmployee/ChangePassword/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            new_password: password,
            confirm_password: confirmPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Password change failed");
      }

      const data = await response.json();
      console.log("Password changed:", data);

      alert("Password changed successfully");
      onHide();
    } catch (err) {
      setError(err.message || "Unable to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Create New Password"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter User Name"
              value={username}
              disabled={step !== 1}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              disabled={step !== 2}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              disabled={step !== 3}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              disabled={step !== 3}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          {step === 3 && !passwordsMatch && (
            <Alert variant="danger" className="mt-3">
              Passwords do not match
            </Alert>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>

        {step === 1 && (
          <Button onClick={handleSendCode} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Send Code"}
          </Button>
        )}

        {step === 2 && (
          <Button onClick={handleVerifyOtp} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Verify"}
          </Button>
        )}

        {step === 3 && (
          <Button onClick={handleResetPassword} disabled={!passwordsMatch}>
            Save
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ForgotPasswordModal;
