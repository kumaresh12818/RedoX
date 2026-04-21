import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getReport } from "../services/api";
import ResultCard from "../components/Scanner/ResultCard";
import { ArrowLeft, Loader } from "lucide-react";
import "../components/Scanner/Scanner.css";

export default function ReportPage() {
  const { scanId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReport(scanId);
        setReport(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Report not found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [scanId]);

  return (
    <div className="scan-page page-wrapper">
      <div style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <Link to="/profile" className="btn btn-secondary btn-sm" style={{ marginBottom: "var(--space-lg)" }}>
          <ArrowLeft size={16} />
          Back to Profile
        </Link>

        {loading && (
          <div className="dashboard__loading" style={{ justifyContent: "center", padding: "var(--space-3xl)" }}>
            <Loader size={24} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
            Loading report...
          </div>
        )}

        {error && (
          <div className="upload-error" style={{ margin: "var(--space-xl) 0" }}>
            {error}
          </div>
        )}

        {!loading && report && (
          <ResultCard
            report={report}
            imageUrl={report.image_url}
            onReset={() => window.history.back()}
          />
        )}
      </div>
    </div>
  );
}
