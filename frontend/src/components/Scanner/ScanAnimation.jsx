import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";
import "./Scanner.css";

export default function ScanAnimation({ previewUrl }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulated progress for UX — real analysis completes via API callback
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) {
          clearInterval(interval);
          return 92; // Hold at 92% until real result arrives
        }
        // Slow down as it progresses
        const increment = p < 30 ? 3 : p < 60 ? 2 : p < 80 ? 1 : 0.5;
        return Math.min(p + increment, 92);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="scan-animation animate-fade-in" id="scan-animation">
      <div className="scan-animation__viewport glass-card">
        {/* Image with scan overlay */}
        <div className="scan-animation__image-wrap">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Analyzing scan"
              className="scan-animation__image"
            />
          )}
          {/* Sweeping scan line */}
          <div className="scan-animation__line" />
          {/* Corner markers */}
          <div className="scan-animation__corner scan-animation__corner--tl" />
          <div className="scan-animation__corner scan-animation__corner--tr" />
          <div className="scan-animation__corner scan-animation__corner--bl" />
          <div className="scan-animation__corner scan-animation__corner--br" />
          {/* Glow overlay */}
          <div className="scan-animation__glow" />
        </div>

        {/* Status */}
        <div className="scan-animation__status">
          <div className="scan-animation__icon">
            <Cpu size={24} />
          </div>
          <h3 className="scan-animation__title">
            Analyzing Medical Image<span className="scan-animation__dots" />
          </h3>
          <p className="scan-animation__detail">
            Gemini AI is examining your scan for clinical findings
          </p>

          {/* Progress bar */}
          <div className="scan-animation__progress-track">
            <div
              className="scan-animation__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="scan-animation__percent">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
