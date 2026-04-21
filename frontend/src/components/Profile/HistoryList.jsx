import { useState } from "react";
import { Clock, Trash2, ChevronRight, Activity, Heart, Eye, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { deleteReport } from "../../services/api";
import "./Profile.css";

const scanIcons = {
  "X-Ray": Activity,
  "Mammogram": Heart,
  "Ultrasound": Eye,
};

export default function HistoryList({ reports = [], onDelete }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (scanId) => {
    if (!window.confirm("Delete this report? This action cannot be undone.")) return;
    setDeleting(scanId);
    try {
      await deleteReport(scanId);
      onDelete?.(scanId);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="history glass-card" id="history-list">
        <div className="history__header">
          <Clock size={20} />
          <h3>Scan History</h3>
        </div>
        <div className="history__empty">
          <AlertCircle size={32} />
          <p>No scans yet. Upload your first medical image to get started.</p>
          <Link to="/scan" className="btn btn-primary btn-sm">New Scan</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="history glass-card" id="history-list">
      <div className="history__header">
        <Clock size={20} />
        <h3>Scan History</h3>
        <span className="badge badge--cyan">{reports.length}</span>
      </div>

      <ul className="history__list">
        {reports.map((r) => {
          const ScanIcon = scanIcons[r.scan_type] || Activity;
          const date = r.created_at
            ? new Date(r.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—";
          const conf = r.confidence_score
            ? `${Math.round(r.confidence_score * 100)}%`
            : "—";

          return (
            <li key={r.scan_id} className="history__item">
              {/* Thumbnail */}
              <div className="history__thumb">
                {r.image_url ? (
                  <img src={r.image_url} alt="" />
                ) : (
                  <ScanIcon size={20} />
                )}
              </div>

              {/* Info */}
              <div className="history__info">
                <span className="history__type">{r.scan_type || "Unknown"}</span>
                <span className="history__date">{date}</span>
              </div>

              {/* Confidence */}
              <span className="history__conf">{conf}</span>

              {/* Actions */}
              <div className="history__actions">
                <Link to={`/report/${r.scan_id}`} className="history__view" title="View report">
                  <ChevronRight size={18} />
                </Link>
                <button
                  className="history__delete"
                  onClick={() => handleDelete(r.scan_id)}
                  disabled={deleting === r.scan_id}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
