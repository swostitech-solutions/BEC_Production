import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { ApiUrl } from "../../ApiUrl";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    showPassword: false,
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      setIsLoggedIn(true);
      onLogin(userRole);
    }
    window.onpopstate = () => {
      localStorage.removeItem("userRole");
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
  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ApiUrl.apiurl}RegisterEmployee/Login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to log in");
      }
      const data = await response.json();
      console.log(data, "hiiii")
      const userId = data.user_type_id;
      const userType = data.user_type_name;
      const loginId = data.login_id;
      const lowercaseUserType =
        typeof userId === "string"
          ? userId.toLowerCase()
          : userType === "string"
          ? userType.toLowerCase()
          : userType;
      if (lowercaseUserType === "staff") {
        navigate("/staff/dashboard");
        localStorage.setItem("userRole", lowercaseUserType);
        localStorage.setItem("userId", userId);
        localStorage.setItem("loginId", loginId);
        onLogin("staff");
      } else if (lowercaseUserType === "student") {
        navigate("/student/dashboards");
        localStorage.setItem("userRole", lowercaseUserType);
        localStorage.setItem("userId", userId);
        localStorage.setItem("loginId", loginId);
        onLogin("student");
      } else if (lowercaseUserType === "principal") {
        navigate("/admin/dashboard");
        localStorage.setItem("userRole", lowercaseUserType);
        localStorage.setItem("userId", userId);
        localStorage.setItem("loginId", loginId);
        onLogin("principal");
      } else {
        console.log("Unknown user type:", userType);
        localStorage.setItem("userRole", "default");
        onLogin("default");
      }
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
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
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="card bg-dark text-light">
            <Card.Img
              variant="top"
              src="img/logo_sts_latest1.png"
              className="beautiful-face mx-auto d-block"
              style={{ width: "150px", height: "150px" }}
            />
            <Card.Body>
              <Card.Title className="text-center fw-bold">Login</Card.Title>
              {isLoggedIn ? (
                <Alert variant="success" className="text-center">
                  Logout in successfully!
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3 d-flex flex-column align-items-start">
                    <Form.Label className="fw-bold">User Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      isInvalid={!!errors.username}
                      style={{ textAlign: "left" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3 d-flex flex-column align-items-start">
                    <Form.Label className="fw-bold">Password</Form.Label>
                    <Form.Control
                      type={formData.showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      isInvalid={!!errors.password}
                      style={{ textAlign: "left" }}
                      endAdornment={
                        <Button
                          variant="light"
                          onClick={togglePasswordVisibility}
                        >
                          {formData.showPassword ? <BsEyeSlash /> : <BsEye />}
                        </Button>
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={loading}
                    className="d-block mx-auto"
                  >
                    {loading ? (
                      <Spinner animation="border" role="status" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Login;








