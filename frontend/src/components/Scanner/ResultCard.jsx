import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  RotateCcw,
  Activity,
  Eye,
  FileText,
  Heart,
  ShieldAlert,
} from "lucide-react";
import "./Scanner.css";

const clarityColor = {
  high: "badge--emerald",
  medium: "badge--amber",
  low: "badge--red",
};

const scanTypeLabels = {
  "X-Ray": { icon: Activity, badge: "badge--cyan" },
  "Mammogram": { icon: Heart, badge: "badge--purple" },
  "Ultrasound": { icon: Eye, badge: "badge--emerald" },
};

export default function ResultCard({ report, imageUrl, onReset }) {
  if (!report) return null;

  const isSuccess = report.status === "success";
  const meta = report.metadata;
  const scanInfo = scanTypeLabels[meta?.scan_type] || { icon: Activity, badge: "badge--cyan" };
  const ScanIcon = scanInfo.icon;

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `redox-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isSuccess) {
    return (
      <div className="result-card result-card--invalid glass-card animate-fade-in-up" id="result-card">
        <div className="result-card__header result-card__header--invalid">
          <XCircle size={32} />
          <h2>Not a Medical Image</h2>
        </div>
        <p className="result-card__error-msg">
          {report.error || "The uploaded image could not be identified as a valid medical scan."}
        </p>
        <button className="btn btn-secondary btn-lg" onClick={onReset} id="result-reset-btn">
          <RotateCcw size={18} />
          Try Another Image
        </button>
      </div>
    );
  }

  const confidencePercent = Math.round((meta?.confidence_score || 0) * 100);

  return (
    <div className="result-card glass-card animate-fade-in-up" id="result-card">
      {/* Header */}
      <div className="result-card__header">
        <CheckCircle size={28} className="result-card__check" />
        <h2>Analysis Complete</h2>
      </div>

      {/* Metadata Row */}
      <div className="result-card__meta">
        <div className="result-card__meta-item">
          <span className={`badge ${scanInfo.badge}`}>
            <ScanIcon size={12} />
            {meta?.scan_type || "Unknown"}
          </span>
        </div>
        <div className="result-card__meta-item">
          <span className={`badge ${clarityColor[meta?.clarity] || "badge--cyan"}`}>
            {meta?.clarity || "—"} clarity
          </span>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="result-card__confidence">
        <div className="result-card__confidence-label">
          <span>AI Confidence</span>
          <span className="result-card__confidence-value">{confidencePercent}%</span>
        </div>
        <div className="result-card__confidence-track">
          <div
            className="result-card__confidence-fill"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Clinical Findings */}
      {report.clinical_findings && (
        <div className="result-card__section">
          <h3 className="result-card__section-title">
            <FileText size={18} />
            Clinical Findings
          </h3>
          <p className="result-card__section-body">{report.clinical_findings}</p>
        </div>
      )}

      {/* Impression */}
      {report.impression && (
        <div className="result-card__section">
          <h3 className="result-card__section-title">
            <Eye size={18} />
            Impression
          </h3>
          <p className="result-card__section-body">{report.impression}</p>
        </div>
      )}

      {/* Recovery Guidance */}
      {report.recovery_guidance?.length > 0 && (
        <div className="result-card__section">
          <h3 className="result-card__section-title">
            <Heart size={18} />
            Recovery Guidance
          </h3>
          <ul className="result-card__steps">
            {report.recovery_guidance.map((step, i) => (
              <li key={i} className="result-card__step">
                <span className="result-card__step-num">{i + 1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="result-card__disclaimer">
        <ShieldAlert size={16} />
        <p>{report.disclaimer}</p>
      </div>

      {/* Actions */}
      <div className="result-card__actions">
        <button className="btn btn-primary" onClick={handleDownload} id="download-report-btn">
          <Download size={16} />
          Download Report
        </button>
        <button className="btn btn-secondary" onClick={onReset} id="new-scan-btn">
          <RotateCcw size={16} />
          New Scan
        </button>
      </div>
    </div>
  );
}
