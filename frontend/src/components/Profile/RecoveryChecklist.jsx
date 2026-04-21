import { useState, useEffect } from "react";
import { CheckCircle, Circle, Trophy, TrendingUp } from "lucide-react";
import "./Profile.css";

export default function RecoveryChecklist({ guidance = [] }) {
  const storageKey = "redox_recovery_checked";
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked]);

  const toggle = (i) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const total = guidance.length;
  const done = Object.values(checked).filter(Boolean).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  if (total === 0) {
    return (
      <div className="recovery glass-card" id="recovery-checklist">
        <div className="recovery__header">
          <TrendingUp size={20} />
          <h3>Recovery Guidance</h3>
        </div>
        <p className="recovery__empty">No recovery steps available yet. Upload a scan to get started.</p>
      </div>
    );
  }

  return (
    <div className="recovery glass-card" id="recovery-checklist">
      <div className="recovery__header">
        <TrendingUp size={20} />
        <h3>Recovery Guidance</h3>
        {progress === 100 && <Trophy size={20} className="recovery__trophy" />}
      </div>

      {/* Progress */}
      <div className="recovery__progress">
        <div className="recovery__progress-info">
          <span>{done} of {total} completed</span>
          <span className="recovery__progress-pct">{progress}%</span>
        </div>
        <div className="recovery__progress-track">
          <div className="recovery__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Checklist */}
      <ul className="recovery__list">
        {guidance.map((step, i) => (
          <li
            key={i}
            className={`recovery__item ${checked[i] ? "recovery__item--done" : ""}`}
            onClick={() => toggle(i)}
          >
            {checked[i] ? (
              <CheckCircle size={20} className="recovery__icon recovery__icon--done" />
            ) : (
              <Circle size={20} className="recovery__icon" />
            )}
            <span className="recovery__text">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
