import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { analyzeImage } from "../services/api";
import UploadZone from "../components/Scanner/UploadZone";
import ScanAnimation from "../components/Scanner/ScanAnimation";
import ResultCard from "../components/Scanner/ResultCard";
import { ScanLine, ShieldCheck } from "lucide-react";
import "../components/Scanner/Scanner.css";

export default function ScanPage() {
  const { user } = useAuth();
  const [state, setState] = useState("upload"); // upload | scanning | result
  const [previewUrl, setPreviewUrl] = useState(null);
  const [report, setReport] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileSelect = async (file) => {
    // Generate local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);

    setState("scanning");
    setError("");

    try {
      const data = await analyzeImage(file);
      setReport(data.report);
      setImageUrl(data.image_url || "");
      setState("result");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Analysis failed. Please try again.";
      setError(msg);
      setState("upload");
    }
  };

  const handleReset = () => {
    setState("upload");
    setPreviewUrl(null);
    setReport(null);
    setImageUrl("");
    setError("");
  };

  return (
    <div className="scan-page page-wrapper">
      <div className="scan-page__header animate-fade-in-up">
        <h1 className="scan-page__title">
          <ScanLine size={32} className="gradient-text" />
          {state === "upload" && "Upload Medical Scan"}
          {state === "scanning" && "Analyzing..."}
          {state === "result" && "Analysis Report"}
        </h1>
        {state === "upload" && (
          <p className="scan-page__subtitle">
            Upload an X-Ray, Mammogram, or Ultrasound for AI-powered analysis
          </p>
        )}
      </div>

      {error && (
        <div className="upload-error" style={{ maxWidth: 560, margin: "0 auto var(--space-lg)" }}>
          <ShieldCheck size={16} />
          {error}
        </div>
      )}

      {state === "upload" && <UploadZone onFileSelect={handleFileSelect} />}
      {state === "scanning" && <ScanAnimation previewUrl={previewUrl} />}
      {state === "result" && (
        <ResultCard report={report} imageUrl={imageUrl} onReset={handleReset} />
      )}
    </div>
  );
}
