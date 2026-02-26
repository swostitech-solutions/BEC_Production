
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { ApiUrl } from "../../ApiUrl";
import ForgotPasswordModal from "./ForgotPasswordModal";



const Login = ({ onLogin }) => {
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  //   showPassword: false,
  // });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);


  const [formData, setFormData] = useState({
    username: "",
    password: "",
    showPassword: false,
    institute: "", // added field
  });


  const [instituteOptions, setInstituteOptions] = useState([]);


  // useEffect(() => {
  //   const fetchInstitutes = async () => {
  //     try {
  //       const response = await fetch(
  //         `${ApiUrl.apiurl}OrganizationBranch/GetAllOrganizationBranch/`
  //       );
  //       const result = await response.json();

  //       if (
  //         result?.message?.toLowerCase() === "success" &&
  //         Array.isArray(result.data)
  //       ) {
  //         const options = result.data.map((inst) => ({
  //           value: inst.id,
  //           label: inst.branch_name,
  //           organization_id: inst.organization_id,
  //           branch_id: inst.branch_id,
  //         }));
  //         setInstituteOptions(options);
  //         // If there's only one institute returned, auto-select it so user cannot change it
  //         if (options.length === 1) {
  //           setFormData((prev) => ({ ...prev, institute: options[0] }));
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching institutes:", error);
  //     }
  //   };

  //   fetchInstitutes();
  // }, []);


  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await fetch(
          `${ApiUrl.apiurl}OrganizationBranch/GetAllOrganizationBranch/`
        );

        const result = await response.json();
        console.log("🏫 Institute API Response:", result);

        if (
          result?.message?.toLowerCase() === "success" &&
          Array.isArray(result.data)
        ) {
          // ✅ STORE FULL RESPONSE IN LOCAL STORAGE
          localStorage.setItem(
            "organizationBranchList",
            JSON.stringify(result.data)
          );

          // ✅ Format for dropdown
          const options = result.data.map((inst) => ({
            value: inst.id,
            label: inst.branch_name,
            organization_id: inst.organization_id,
            branch_id: inst.branch_id,
          }));

          setInstituteOptions(options);

          // ✅ Auto-select if only one institute
          if (options.length === 1) {
            setFormData((prev) => ({
              ...prev,
              institute: options[0],
            }));
          }
        }
      } catch (error) {
        console.error("❌ Error fetching institutes:", error);
      }
    };

    fetchInstitutes();
  }, []);



  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      setIsLoggedIn(true);
      onLogin(userRole);
    }
    window.onpopstate = () => {
      sessionStorage.removeItem("userRole");
      setIsLoggedIn(false);
      navigate("/login");
    };
    return () => {
      window.onpopstate = null;
    };
  }, [onLogin, navigate]);
  useEffect(() => {
    if (isLoggedIn) {
      window.history.pushState(null, "", "/");
      window.onpopstate = () => {
        window.history.pushState(null, "", "/");
      };
    }
  }, [isLoggedIn]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const togglePasswordVisibility = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword,
    });
  };
  const validateForm = () => {
    let newErrors = {};
    if (formData.username.trim() === "") {
      newErrors.username = "User Name is required";
    }
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // const handleLogin = async () => {
  //   try {
  //     setLoading(true);

  //     const selectedInstitute = formData.institute;

  //     if (!selectedInstitute) {
  //       alert("Please select an Institute before logging in.");
  //       setLoading(false);
  //       return;
  //     }

  //     const loginResponse = await fetch(
  //       `${ApiUrl.apiurl}RegisterEmployee/Login/`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           username: formData.username,
  //           password: formData.password,
  //           organization_id: selectedInstitute.organization_id,
  //           branch_id: selectedInstitute.branch_id,
  //         }),
  //       }
  //     );

  //     if (!loginResponse.ok) {
  //       throw new Error("Failed to log in");
  //     }

  //     const loginData = await loginResponse.json();
  //     const { userId, username, userRole, userTypeId } = loginData.data;

  //     // --- Store login info in sessionStorage ---
  //     sessionStorage.setItem("userId", userId);
  //     sessionStorage.setItem("username", username);
  //     sessionStorage.setItem("userRole", userRole);
  //     sessionStorage.setItem("userTypeId", userTypeId);
  //     sessionStorage.setItem(
  //       "organization_id",
  //       selectedInstitute.organization_id
  //     );
  //     sessionStorage.setItem("branch_id", selectedInstitute.branch_id);

  //     // --- Step 2: Navigate based on role ---
  //     switch (userRole) {
  //       case "staff":
  //         navigate("/staff/dashboard");
  //         onLogin("staff");
  //         break;
  //       case "student":
  //         navigate("/student/dashboards");
  //         onLogin("student");
  //         break;
  //       case "principal":
  //       case "admin":
  //         navigate("/admin/dashboard");
  //         onLogin("principal");
  //         break;
  //       default:
  //         console.error("Unknown user role:", userRole);
  //         break;
  //     }

  //     setIsLoggedIn(true);

  //     // --- Step 3: Wait before token request ---
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     // --- Step 4: Call Token API ---
  //     const tokenResponse = await fetch("${ApiUrl.apiurl}token/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         user_name: formData.username,
  //         password: formData.password,
  //       }),
  //     });

  //     if (!tokenResponse.ok) {
  //       throw new Error("Failed to fetch token");
  //     }

  //     const tokenData = await tokenResponse.json();
  //     const { access, refresh } = tokenData;

  //     // --- Step 5: Store tokens in localStorage ---
  //     localStorage.setItem("accessToken", access);
  //     localStorage.setItem("refreshToken", refresh);

  //     console.log("Tokens saved successfully:", { access, refresh });
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     alert(error.message || "Login failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const selectedInstitute = formData.institute;

      if (!selectedInstitute) {
        alert("Please select an Institute before logging in.");
        setLoading(false);
        return;
      }

      const loginResponse = await fetch(`${ApiUrl.apiurl}RegisterEmployee/Login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          organization_id: selectedInstitute.organization_id,
          branch_id: selectedInstitute.branch_id,
        }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to log in");
      }

      const loginData = await loginResponse.json();
      console.log(" Login response:", loginData);

      const {
        userId,
        username,
        userRole,
        userTypeId,
        organization_id,
        organization_name,
        branch_id,
        branch_name,
        user_login_id,
        accessible_modules,
      } = loginData.data;



      // --- Step 1: Store login info in sessionStorage ---
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("userRole", userRole);
      sessionStorage.setItem("userTypeId", userTypeId);
      sessionStorage.setItem("organization_id", organization_id);
      sessionStorage.setItem("organization_name", organization_name);
      sessionStorage.setItem("branch_id", branch_id);
      sessionStorage.setItem("branch_name", branch_name);
      localStorage.setItem("user_login_id", user_login_id);

      // Store accessible modules if user is admin
      if (accessible_modules && Array.isArray(accessible_modules)) {
        sessionStorage.setItem("accessible_modules", JSON.stringify(accessible_modules));
      }

      // --- Also store in localStorage for components that use localStorage ---
      localStorage.setItem("orgId", organization_id);
      localStorage.setItem("branchId", branch_id);
      localStorage.setItem("organizationName", organization_name);
      localStorage.setItem("branchName", branch_name);

      // --- Step 2: Navigate based on role ---
      switch (userRole) {
        case "staff":
          navigate("/staff/dashboard");
          onLogin("staff");
          break;
        case "student":
          navigate("/student/dashboards");
          onLogin("student");
          break;
        case "principal":
        case "admin":
          navigate("/admin/dashboard");
          onLogin("principal");
          break;
        default:
          console.error("Unknown user role:", userRole);
          break;
      }

      setIsLoggedIn(true);

      // --- Step 3: Wait before token request ---
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // --- Step 4: Fetch token ---
      const tokenResponse = await fetch(`${ApiUrl.apiurl}token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: formData.username,
          password: formData.password,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to fetch token");
      }

      const tokenData = await tokenResponse.json();
      const { access, refresh } = tokenData;

      // --- Step 5: Store tokens ---
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      sessionStorage.setItem("accessToken", access);
      sessionStorage.setItem("refreshToken", refresh);
      console.log("Tokens saved successfully:", { access, refresh });
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      handleLogin();
    }
  };
  return (
    <div
      style={{
        backgroundImage: "url('/img/bgsparsh.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "50px",
      }}
    >
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="card bg-dark text-light" style={{ opacity: 0.9 }}>
              <Card.Img
                variant="top"
                src="/Assets/sparsh.jpeg"
                className="beautiful-face mx-auto d-block"
                style={{ width: "300px", height: "100px", marginTop: "10px" }}
              />
              <Card.Body>
                <Card.Title className="text-center fw-bold">Login</Card.Title>
                <Form onSubmit={handleSubmit}>
                  {/* User Name */}
                  <Form.Group className="mb-3 d-flex flex-column align-items-start w-100">
                    <Form.Label className="fw-bold">User Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      isInvalid={!!errors.username}
                      style={{ textAlign: "left", borderRadius: "2px" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3 d-flex flex-column align-items-start w-100">
                    <Form.Label className="fw-bold">Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={formData.showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        isInvalid={!!errors.password}
                        style={{ textAlign: "left", borderRadius: "2px" }}
                      />
                      <InputGroup.Text onClick={togglePasswordVisibility}>
                        {formData.showPassword ? <BsEyeSlash /> : <BsEye />}
                      </InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4 ... w-100">
                    <Form.Label className="fw-bold">Institute</Form.Label>
                    <Form.Control
                      list="institutes"
                      name="institute"
                      value={
                        formData.institute?.label || formData.institute || ""
                      }
                      onChange={(e) => {
                        const input = e.target.value;
                        const selected = instituteOptions.find(
                          (inst) =>
                            inst.label === input ||
                            inst.value.toString() === input
                        );
                        setFormData({
                          ...formData,
                          institute: selected || input,
                        });
                      }}
                      disabled={instituteOptions.length === 1}
                      style={{
                        borderRadius: "2px",
                        minHeight: "38px",
                        width: "100%",
                      }}
                    />
                    <datalist id="institutes">
                      {instituteOptions.map((inst) => (
                        <option key={inst.value} value={inst.label} />
                      ))}
                    </datalist>
                  </Form.Group>

                  {/* Sign In + Forgot Password */}
                  <div className="d-flex justify-content-center align-items-center mt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" role="status" />
                      ) : (
                        "Log In"
                      )}
                    </Button>
                    <a
                      onClick={() => setShowForgotPassword(true)}
                      className="text-light text-decoration-none ms-3"
                      style={{ fontSize: "0.9rem", cursor: "pointer" }}
                    >
                      Forgot Password?
                    </a>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* 🔹 Forgot Password Modal */}
      <ForgotPasswordModal
        show={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
      />
    </div>
  );

};
export default Login;