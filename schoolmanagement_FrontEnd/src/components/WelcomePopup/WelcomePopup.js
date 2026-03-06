import React, { useEffect, useRef } from "react";
import "./WelcomePopup.css";

const WelcomePopup = ({ show, displayName, roleName, userRole, onDismiss }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (show) {
      timerRef.current = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show, onDismiss]);

  if (!show) return null;

  const getRoleBadge = () => {
    const role = (userRole || "").toLowerCase();
    switch (role) {
      case "staff":
        return { label: "Teaching Staff", className: "staff" };
      case "student":
        return { label: "Student", className: "student" };
      case "admin":
      case "principal":
        return { label: roleName || "Administrator", className: "admin" };
      default:
        return { label: role || "User", className: "admin" };
    }
  };

  const badge = getRoleBadge();

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="welcome-overlay" onClick={handleDismiss}>
      <div className="welcome-card" onClick={(e) => e.stopPropagation()}>

        {/* Logo */}
        <div className="welcome-logo-container">
          <img src="/img/logobec.png" alt="BEC Logo" className="welcome-logo" />
        </div>

        <div className="welcome-divider"></div>

        <div className="welcome-title">Welcome to</div>
        <div className="welcome-college-name">Bhubaneswar Engineering College</div>
        <div className="welcome-system-name">ERP Management System</div>

        {/* Person */}
        <div className="welcome-for-text">— for —</div>
        <div className="welcome-person-name">{displayName || "User"}</div>
        <div className={`welcome-role-badge ${badge.className}`}>{badge.label}</div>

        <br />

        <button className="welcome-btn" onClick={handleDismiss}>
          Get Started →
        </button>

        {/* Auto-dismiss progress */}
        <div className="welcome-progress-container">
          <div className="welcome-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
