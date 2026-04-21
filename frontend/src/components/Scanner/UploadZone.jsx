import { useState, useRef, useCallback } from "react";
import { Upload, Image, X, AlertCircle } from "lucide-react";
import "./Scanner.css";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export default function UploadZone({ onFileSelect }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const validate = (f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Unsupported format. Please upload JPEG, PNG, or WebP.");
      return false;
    }
    if (f.size > MAX_SIZE) {
      setError("File too large. Maximum size is 20 MB.");
      return false;
    }
    setError("");
    return true;
  };

  const handleFile = useCallback((f) => {
    if (!validate(f)) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (file) onFileSelect(file);
  };

  return (
    <div className="upload-zone-wrapper animate-fade-in-up">
      {!preview ? (
        <div
          className={`upload-zone glass-card ${dragOver ? "upload-zone--active" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          id="upload-dropzone"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            hidden
          />
          <div className="upload-zone__icon">
            <Upload size={40} />
            <div className="upload-zone__pulse" />
          </div>
          <h3 className="upload-zone__title">Upload Medical Scan</h3>
          <p className="upload-zone__subtitle">
            Drag & drop your X-Ray, Mammogram, or Ultrasound here
          </p>
          <p className="upload-zone__hint">
            JPEG, PNG, WebP • Max 20 MB
          </p>
          <button className="btn btn-secondary btn-sm upload-zone__btn" type="button">
            <Image size={16} />
            Browse Files
          </button>
        </div>
      ) : (
        <div className="upload-preview glass-card" id="upload-preview">
          <div className="upload-preview__image-wrap">
            <img src={preview} alt="Selected scan" className="upload-preview__image" />
            <button className="upload-preview__clear" onClick={clearFile} title="Remove">
              <X size={18} />
            </button>
          </div>
          <div className="upload-preview__info">
            <p className="upload-preview__name">{file.name}</p>
            <p className="upload-preview__size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button className="btn btn-primary btn-lg upload-preview__analyze" onClick={handleAnalyze} id="analyze-btn">
            <Upload size={18} />
            Analyze with AI
          </button>
        </div>
      )}

      {error && (
        <div className="upload-error" id="upload-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
