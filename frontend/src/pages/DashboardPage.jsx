import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserReports } from "../services/api";
import {
  ScanLine,
  Activity,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Clock,
  Heart,
  Eye,
} from "lucide-react";
import "./DashboardPage.css";

const scanIcons = {
  "X-Ray": Activity,
  "Mammogram": Heart,
  "Ultrasound": Eye,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserReports();
        setReports(data || []);
      } catch {
        // Silently handle — user might not have reports yet
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalScans = reports.length;
  const latestScan = reports[0];
  const successScans = reports.filter((r) => r.status === "success");

  return (
    <div className="dashboard page-wrapper">
      <div className="container dashboard__inner">
        {/* Welcome */}
        <div className="dashboard__welcome animate-fade-in-up">
          <h1>
            Welcome back, <span className="gradient-text">{user?.displayName || "User"}</span>
          </h1>
          <p>Here's an overview of your medical imaging activity.</p>
        </div>

        {/* Stats */}
        <div className="dashboard__stats">
          <div className="dashboard__stat-card glass-card animate-fade-in-up">
            <div className="dashboard__stat-icon dashboard__stat-icon--cyan">
              <BarChart3 size={22} />
            </div>
            <div>
              <span className="dashboard__stat-value">{totalScans}</span>
              <span className="dashboard__stat-label">Total Scans</span>
            </div>
          </div>

          <div className="dashboard__stat-card glass-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="dashboard__stat-icon dashboard__stat-icon--emerald">
              <TrendingUp size={22} />
            </div>
            <div>
              <span className="dashboard__stat-value">{successScans.length}</span>
              <span className="dashboard__stat-label">Successful</span>
            </div>
          </div>

          <div className="dashboard__stat-card glass-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="dashboard__stat-icon dashboard__stat-icon--purple">
              <Clock size={22} />
            </div>
            <div>
              <span className="dashboard__stat-value">
                {latestScan?.scan_type || "—"}
              </span>
              <span className="dashboard__stat-label">Latest Scan</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard__actions animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/scan" className="btn btn-primary btn-lg" id="dash-new-scan">
            <ScanLine size={18} />
            New Scan
          </Link>
          <Link to="/profile" className="btn btn-secondary btn-lg" id="dash-view-history">
            <Clock size={18} />
            View History
          </Link>
        </div>

        {/* Recent scans */}
        <div className="dashboard__recent animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <h2>Recent Scans</h2>
          {loading ? (
            <div className="dashboard__loading">
              <span className="spinner" /> Loading...
            </div>
          ) : reports.length === 0 ? (
            <div className="dashboard__empty glass-card">
              <ScanLine size={40} />
              <h3>No scans yet</h3>
              <p>Upload your first medical image to get started with AI analysis.</p>
              <Link to="/scan" className="btn btn-primary">
                Start Scanning <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="dashboard__scans-grid">
              {reports.slice(0, 6).map((r) => {
                const ScanIcon = scanIcons[r.scan_type] || Activity;
                const conf = r.confidence_score
                  ? `${Math.round(r.confidence_score * 100)}%`
                  : "—";
                return (
                  <Link
                    to={`/report/${r.scan_id}`}
                    key={r.scan_id}
                    className="dashboard__scan-card glass-card"
                    id={`scan-card-${r.scan_id}`}
                  >
                    <div className="dashboard__scan-thumb">
                      {r.image_url ? (
                        <img src={r.image_url} alt="" />
                      ) : (
                        <ScanIcon size={24} />
                      )}
                    </div>
                    <div className="dashboard__scan-info">
                      <span className="dashboard__scan-type">{r.scan_type || "Unknown"}</span>
                      <span className="dashboard__scan-conf">{conf} confidence</span>
                    </div>
                    <ArrowRight size={16} className="dashboard__scan-arrow" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
