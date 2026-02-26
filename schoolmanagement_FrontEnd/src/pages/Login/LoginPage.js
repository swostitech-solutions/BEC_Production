// import React, { useState } from "react";
// import { Modal, Form, Button, Alert } from "react-bootstrap";
// import ForgotPasswordModal from "./ForgetPassword";

// const PasswordResetPopup = ({ show, onHide, onResetPassword }) => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordsMatch, setPasswordsMatch] = useState(true);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);

//   const handleResetPassword = () => {
//     // Check if passwords match before resetting
//     if (password === confirmPassword) {
//       // Perform password reset logic here
//       // You can validate passwords, make API calls, etc.
//       // Call the onResetPassword function with the new password
//       if (onResetPassword) {
//         onResetPassword(password);
//       }
//       // Close the modal
//       onHide();
//     } else {
//       // If passwords do not match, set the state to show an alert
//       setPasswordsMatch(false);
//     }
//   };
//   return (
//     <Modal show={show} onHide={onHide}>
//       <Modal.Header closeButton>
//         <Modal.Title>Password Reset</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           <Form.Group>
//             <Form.Label>New Password</Form.Label>
//             <Form.Control
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </Form.Group>
//           <Form.Group>
//             <Form.Label>Confirm Password</Form.Label>
//             <Form.Control
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//           </Form.Group>
//           {!passwordsMatch && (
//             <Alert variant="danger">
//               Passwords do not match. Please enter the same password in both
//               fields.
//             </Alert>
//           )}
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={handleResetPassword}>
//           Reset Password
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };
// export default PasswordResetPopup;


// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Card,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { BsEye, BsEyeSlash } from "react-icons/bs";
// import { ApiUrl } from "../../ApiUrl";
// import ForgotPasswordModal from "./ForgotPasswordModal";

// const Login = ({ onLogin }) => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     showPassword: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const [showForgotPassword, setShowForgotPassword] = useState(false);

//   /* -------------------- EFFECTS -------------------- */

//   useEffect(() => {
//     const userRole = localStorage.getItem("userRole");
//     if (userRole) {
//       setIsLoggedIn(true);
//       onLogin(userRole);
//     }
//   }, [onLogin]);

//   /* -------------------- HANDLERS -------------------- */

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const togglePasswordVisibility = () => {
//     setFormData((prev) => ({
//       ...prev,
//       showPassword: !prev.showPassword,
//     }));
//   };

//   const validateForm = () => {
//     let newErrors = {};
//     if (!formData.username.trim()) {
//       newErrors.username = "User Name is required";
//     }
//     if (!formData.password.trim()) {
//       newErrors.password = "Password is required";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(`${ApiUrl.apiurl}RegisterEmployee/Login/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//         }),
//       });

//       if (!response.ok) throw new Error("Login failed");

//       const data = await response.json();

//       const role = data.user_type_name?.toLowerCase();
//       const userId = data.user_type_id;
//       const loginId = data.login_id;

//       localStorage.setItem("userRole", role);
//       localStorage.setItem("userId", userId);
//       localStorage.setItem("loginId", loginId);

//       if (role === "staff") navigate("/staff/dashboard");
//       else if (role === "student") navigate("/student/dashboards");
//       else if (role === "principal") navigate("/admin/dashboard");

//       onLogin(role);
//       setIsLoggedIn(true);
//     } catch (err) {
//       console.error(err);
//       alert("Invalid username or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) handleLogin();
//   };

//   /* -------------------- UI -------------------- */

//   return (
//     <>
//       <Container className="mt-5">
//         <Row className="justify-content-center">
//           <Col md={6}>
//             <Card className="bg-dark text-light">
//               <Card.Body>
//                 <Card.Title className="text-center fw-bold">Login</Card.Title>

//                 {isLoggedIn ? (
//                   <Alert variant="success" className="text-center">
//                     Logged in successfully
//                   </Alert>
//                 ) : (
//                   <Form onSubmit={handleSubmit}>
//                     {/* USERNAME */}
//                     <Form.Group className="mb-3">
//                       <Form.Label>User Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="username"
//                         value={formData.username}
//                         onChange={handleInputChange}
//                         isInvalid={!!errors.username}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {errors.username}
//                       </Form.Control.Feedback>
//                     </Form.Group>

//                     {/* PASSWORD */}
//                     <Form.Group className="mb-2">
//                       <Form.Label>Password</Form.Label>
//                       <div className="position-relative">
//                         <Form.Control
//                           type={formData.showPassword ? "text" : "password"}
//                           name="password"
//                           value={formData.password}
//                           onChange={handleInputChange}
//                           isInvalid={!!errors.password}
//                         />
//                         <span
//                           onClick={togglePasswordVisibility}
//                           style={{
//                             position: "absolute",
//                             right: 10,
//                             top: 8,
//                             cursor: "pointer",
//                           }}
//                         >
//                           {formData.showPassword ? <BsEyeSlash /> : <BsEye />}
//                         </span>
//                       </div>
//                       <Form.Control.Feedback type="invalid">
//                         {errors.password}
//                       </Form.Control.Feedback>
//                     </Form.Group>

//                     {/* FORGOT PASSWORD */}
//                     <div className="text-end mb-3">
//                       <span
//                         style={{
//                           color: "#0d6efd",
//                           cursor: "pointer",
//                         }}
//                         onClick={() => setShowForgotPassword(true)}
//                       >
//                         Forgot Password?
//                       </span>
//                     </div>

//                     {/* LOGIN BUTTON */}
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       className="w-100"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <Spinner animation="border" size="sm" />
//                       ) : (
//                         "Sign In"
//                       )}
//                     </Button>
//                   </Form>
//                 )}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>

//       {/* FORGOT PASSWORD MODAL */}
//       <ForgotPasswordModal
//         show={showForgotPassword}
//         onHide={() => setShowForgotPassword(false)}
//       />
//     </>
//   );
// };

// export default Login;






