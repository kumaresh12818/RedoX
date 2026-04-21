import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserReports } from "../services/api";
import RecoveryChecklist from "../components/Profile/RecoveryChecklist";
import HistoryList from "../components/Profile/HistoryList";
import { User, Mail, Calendar } from "lucide-react";
import "../components/Profile/Profile.css";

export default function ProfilePage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserReports();
        setReports(data || []);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = (scanId) => {
    setReports((prev) => prev.filter((r) => r.scan_id !== scanId));
  };

  // Latest successful report's recovery guidance
  const latestSuccess = reports.find((r) => r.status === "success");
  const latestGuidance = latestSuccess?.recovery_guidance || [];

  const initial = (user?.displayName || user?.email || "U")[0].toUpperCase();
  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="profile-page page-wrapper">
      {/* Profile header */}
      <div className="profile-page__header animate-fade-in-up">
        <div className="profile-page__avatar">{initial}</div>
        <div className="profile-page__info">
          <h1>{user?.displayName || "User"}</h1>
          <p>
            <Mail size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            {user?.email || "—"}
          </p>
          <p>
            <Calendar size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Joined {joinDate}
          </p>
        </div>
      </div>

      {/* Main grid */}
      {loading ? (
        <div className="dashboard__loading" style={{ justifyContent: "center" }}>
          <span className="spinner" /> Loading your data...
        </div>
      ) : (
        <div className="profile-page__grid">
          <RecoveryChecklist guidance={latestGuidance} />
          <HistoryList reports={reports} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}
