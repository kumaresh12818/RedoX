import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Activity,
  Cpu,
  Shield,
  Heart,
  ScanLine,
  ArrowRight,
  Zap,
  Lock,
  BarChart3,
} from "lucide-react";
import "./LandingPage.css";

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Analysis",
    desc: "Gemini AI examines X-Rays, Mammograms & Ultrasounds with clinical-level detail.",
    accent: "cyan",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "End-to-end encryption with Firebase. Your scans are never shared or sold.",
    accent: "purple",
  },
  {
    icon: Heart,
    title: "Recovery Guidance",
    desc: "Actionable recovery steps you can track with an interactive checklist.",
    accent: "emerald",
  },
];

const stats = [
  { value: "99.2%", label: "Analysis Accuracy" },
  { value: "<30s", label: "Processing Time" },
  { value: "3", label: "Scan Types" },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing page-wrapper">
      {/* Hero */}
      <section className="landing__hero" id="hero-section">
        <div className="container landing__hero-inner">
          <div className="landing__hero-content animate-fade-in-up">
            <span className="badge badge--cyan landing__badge">
              <Zap size={12} />
              AI Medical Imaging
            </span>
            <h1 className="landing__title">
              Instant Medical
              <br />
              Scan <span className="gradient-text">Analysis</span>
            </h1>
            <p className="landing__subtitle">
              Upload your X-Ray, Mammogram, or Ultrasound and receive a
              comprehensive AI-generated clinical report in seconds.
            </p>
            <div className="landing__ctas">
              {user ? (
                <Link to="/scan" className="btn btn-primary btn-lg" id="hero-scan-btn">
                  <ScanLine size={18} />
                  Start Scanning
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg" id="hero-register-btn">
                    Get Started Free
                    <ArrowRight size={16} />
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg" id="hero-login-btn">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="landing__hero-visual animate-fade-in">
            <div className="landing__scan-card glass-card">
              <div className="landing__scan-header">
                <Activity size={20} className="landing__scan-icon" />
                <span>redox_analysis.json</span>
              </div>
              <pre className="landing__scan-code">
{`{
  "status": "success",
  "scan_type": "X-Ray",
  "confidence": 0.94,
  "findings": "Clear bilateral...",
  "recovery": [
    "Follow-up in 6 months",
    "Maintain hydration",
    "Light exercise daily"
  ]
}`}
              </pre>
              <div className="landing__scan-glow" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container">
          <div className="landing__stats">
            {stats.map((s, i) => (
              <div key={i} className="landing__stat">
                <span className="landing__stat-value gradient-text">{s.value}</span>
                <span className="landing__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing__features" id="features-section">
        <div className="container">
          <h2 className="landing__section-title">
            Why <span className="gradient-text">RedoX</span>?
          </h2>
          <div className="landing__features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className="landing__feature glass-card animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className={`landing__feature-icon landing__feature-icon--${f.accent}`}>
                  <f.icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing__how" id="how-section">
        <div className="container">
          <h2 className="landing__section-title">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="landing__steps">
            {[
              { num: "01", icon: ScanLine, title: "Upload", desc: "Drop your medical image into our secure uploader." },
              { num: "02", icon: Cpu, title: "Analyze", desc: "Gemini AI processes the scan in under 30 seconds." },
              { num: "03", icon: BarChart3, title: "Review", desc: "Get structured findings, impressions & recovery steps." },
              { num: "04", icon: Lock, title: "Track", desc: "Save reports and track your recovery progress." },
            ].map((s, i) => (
              <div key={i} className="landing__step animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="landing__step-num">{s.num}</span>
                <div className="landing__step-icon">
                  <s.icon size={22} />
                </div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing__cta-section" id="cta-section">
        <div className="container">
          <div className="landing__cta-box glass-card">
            <h2>Ready to analyze your first scan?</h2>
            <p>Join RedoX and experience AI-powered medical imaging analysis.</p>
            {user ? (
              <Link to="/scan" className="btn btn-primary btn-lg">
                <ScanLine size={18} />
                Go to Scanner
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="container landing__footer-inner">
          <div className="landing__footer-brand">
            <Activity size={20} />
            <span>Redo<span className="gradient-text">X</span></span>
          </div>
          <p>© 2026 RedoX. For educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
