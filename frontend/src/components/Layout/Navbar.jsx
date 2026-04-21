import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Activity, LogOut, User, ScanLine, LayoutDashboard } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="navbar-logo">
          <Activity size={26} className="navbar__logo-icon" />
          <span className="navbar__logo-text">
            Redo<span className="gradient-text">X</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="navbar__links">
          {user ? (
            <>
              <Link to="/dashboard" className="navbar__link" id="nav-dashboard">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link to="/scan" className="navbar__link navbar__link--primary" id="nav-scan">
                <ScanLine size={16} />
                New Scan
              </Link>
              <Link to="/profile" className="navbar__link" id="nav-profile">
                <User size={16} />
                Profile
              </Link>
              <button className="navbar__link navbar__logout-btn" onClick={handleLogout} id="nav-logout">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
