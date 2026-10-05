import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
} from "lucide-react";
import Navbar from "../../layouts/Navbar";
import { api } from "../../services/api";

export default function LandingPage() {
  const [stats, setStats] = useState({
    players: 0,
    games: 0,
    volunteers: 0,
    winners: 0,
  });

  useEffect(() => {
    async function loadData() {
      const gRes = await api.getGames();
      const pRes = await api.getPlayers();
      const vRes = await api.getVolunteers();
      const wRes = await api.getWinners();

      setStats({
        players: pRes?.data?.players?.length || 0,
        games: gRes?.data?.length || 12,
        volunteers: vRes?.data?.length || 3,
        winners: wRes?.data?.length || 0,
      });
    }
    loadData();
  }, []);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #090d16 0%, #0f172a 60%, #1e1b4b 100%)",
          color: "#ffffff",
          padding: "70px 20px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow ambient effects */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "5%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(124, 58, 237, 0.28) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "5%",
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "40px",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: "rgba(124, 58, 237, 0.25)",
                border: "1px solid rgba(167, 139, 250, 0.4)",
                color: "#c4b5fd",
                fontSize: "0.84rem",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              <span>🏟️</span> ग्राम सभा सारीपट्टी • भव्य खेल एवं ज्ञान संगम 2026
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                color: "#ffffff",
                lineHeight: 1.15,
                fontWeight: 800,
                margin: "0 0 18px",
              }}
            >
              आरव दो दिवसीय{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #c084fc, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                खेलकूद
              </span>{" "}
              एवं{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #34d399, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                सामान्य ज्ञान
              </span>{" "}
              उत्सव
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "#cbd5e1",
                lineHeight: 1.7,
                marginBottom: "28px",
                maxWidth: "600px",
              }}
            >
              ग्रामीण प्रतिभा, खेल भावना और अनुशासन का महाकुंभ। दौड़, लंबी कूद,
              ऊंची कूद, सामान्य ज्ञान परीक्षा और सांस्कृतिक गतिविधियों में भाग
              लें और अपनी प्रतिभा का लोहा मनवाएं।
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: "12px 24px", fontSize: "1rem" }}
              >
                🏅 अभी पंजीकरण करें (Register Athlete)
              </Link>
              <Link
                to="/games"
                className="btn btn-secondary"
                style={{
                  padding: "12px 20px",
                  fontSize: "1rem",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                📅 कार्यक्रम व खेल सूची (Games Schedule)
              </Link>
            </div>

            {/* Critical Dates & Location badge strip */}
            <div
              style={{
                display: "flex",
                gap: "18px",
                marginTop: "36px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#94a3b8",
                  fontSize: "0.9rem",
                }}
              >
                <Calendar size={18} color="var(--purple-400)" />{" "}
                <strong>06 - 07 नवम्बर 2026</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#94a3b8",
                  fontSize: "0.9rem",
                }}
              >
                <MapPin size={18} color="var(--emerald-500)" />{" "}
                <strong>ग्राम सभा सारीपट्टी, मिर्जापुर</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#94a3b8",
                  fontSize: "0.9rem",
                }}
              >
                <ShieldCheck size={18} color="var(--pink-500)" />{" "}
                <strong>आधार सत्यापित प्रतियोगिता</strong>
              </div>
            </div>
          </div>

          {/* Tournament Showcase Banner Card */}
          <div
            style={{
              background: "rgba(30, 41, 59, 0.7)",
              backdropFilter: "blur(12px)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              padding: "28px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "var(--purple-400)",
                  textTransform: "uppercase",
                }}
              >
                FESTIVAL ATTRACTIONS
              </span>
              <span className="badge-pill badge-approved">सत्यापित आयोजन</span>
            </div>

            <h3
              style={{ color: "#fff", fontSize: "1.4rem", margin: "0 0 12px" }}
            >
              आरव खेलकूद समिति सारीपट्टी
            </h3>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.9rem",
                marginBottom: "20px",
              }}
            >
              12+ विभिन्न खेल, सामान्य ज्ञान प्रश्नोत्तरी, आकर्षक नकद पुरस्कार
              एवं स्वर्ण/रजत पदक।
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ fontSize: "1.4rem" }}>🏃</div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "0.9rem",
                    marginTop: "4px",
                  }}
                >
                  1600m & 1000m Race
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  ब्लॉक स्तर मुकाबले
                </div>
              </div>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ fontSize: "1.4rem" }}>🏆</div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "0.9rem",
                    marginTop: "4px",
                  }}
                >
                  कूद प्रतियोगिताएं
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  हाई जम्प & लॉन्ग जम्प
                </div>
              </div>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ fontSize: "1.4rem" }}>♟</div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "0.9rem",
                    marginTop: "4px",
                  }}
                >
                  शतरंज & GK Quiz
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  ओपन सामान्य ज्ञान मंच
                </div>
              </div>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ fontSize: "1.4rem" }}>🎨</div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "0.9rem",
                    marginTop: "4px",
                  }}
                >
                  चित्रकला & बाल खेल
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  कक्षा 1 से 5 वर्ग
                </div>
              </div>
            </div>

            <Link
              to="/winners"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#c4b5fd",
                fontSize: "0.88rem",
                fontWeight: 600,
              }}
            >
              <span>विजेताओं का पोडियम देखें (Podium Results)</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Real-time stats band */}
      <section
        style={{
          background: "#ffffff",
          borderBottom: "1px solid var(--slate-200)",
          padding: "24px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "var(--purple-600)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {stats.players}+
            </div>
            <div
              style={{
                fontSize: "0.88rem",
                color: "var(--slate-600)",
                fontWeight: 600,
              }}
            >
              पंजीकृत खिलाड़ी (Athletes)
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "var(--emerald-600)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {stats.games}
            </div>
            <div
              style={{
                fontSize: "0.88rem",
                color: "var(--slate-600)",
                fontWeight: 600,
              }}
            >
              प्रतियोगिताएं (Events)
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "var(--blue-600)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {stats.volunteers}
            </div>
            <div
              style={{
                fontSize: "0.88rem",
                color: "var(--slate-600)",
                fontWeight: 600,
              }}
            >
              कार्यक्षेत्र स्वयंसेवक (Volunteers)
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "var(--pink-600)",
                fontFamily: "var(--font-heading)",
              }}
            >
              ₹25,000+
            </div>
            <div
              style={{
                fontSize: "0.88rem",
                color: "var(--slate-600)",
                fontWeight: 600,
              }}
            >
              कुल पुरस्कार व पदक (Awards)
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Operating Lifecycle Section (Blueprint Section 5) */}
      <section style={{ padding: "60px 20px", background: "var(--slate-50)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "var(--purple-600)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              TOURNAMENT OPERATING LIFECYCLE
            </span>
            <h2
              style={{
                fontSize: "2rem",
                color: "var(--slate-900)",
                marginTop: "6px",
              }}
            >
              पारदर्शी एवं चरणबद्ध संचालन प्रक्रिया
            </h2>
            <p
              style={{
                color: "var(--slate-600)",
                maxWidth: "640px",
                margin: "0 auto",
              }}
            >
              पंजीकरण से लेकर प्रमाण-पत्र व पोडियम तक, हर चरण डिजिटल रूप से
              रिकॉर्ड और सत्यापित किया जाता है।
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              {
                num: "1",
                title: "पब्लिक पोर्टल",
                sub: "खिलाड़ी ऑनलाइन पंजीकरण करता है",
              },
              {
                num: "2",
                title: "स्थिति: लंबित",
                sub: "आवेदन समीक्षा की प्रतीक्षा में",
              },
              {
                num: "3",
                title: "दस्तावेज़ सत्यापन",
                sub: "स्वयंसेवक द्वारा आधार व फोटो जांच",
              },
              {
                num: "4",
                title: "स्लॉट आवंटन",
                sub: "स्वीकृत खिलाड़ी को समय व कोर्ट आबंटित",
              },
              {
                num: "5",
                title: "मैच प्रतिस्पर्धा",
                sub: "मैदान पर उपस्थिति एवं मुकाबला",
              },
              {
                num: "6",
                title: "विजेता घोषणा",
                sub: "पोडियम रिजल्ट व प्रमाण पत्र प्रकाशन",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px",
                  boxShadow: "var(--shadow-card)",
                  position: "relative",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "var(--purple-600)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    margin: "0 auto 12px",
                  }}
                >
                  {step.num}
                </div>
                <h4
                  style={{
                    margin: "0 0 6px",
                    fontSize: "1rem",
                    color: "var(--slate-900)",
                  }}
                >
                  {step.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--slate-500)",
                    margin: 0,
                  }}
                >
                  {step.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizers & Committee Registry (Blueprint Section 4.3) */}
      <section className="organizing-section">
        <div className="organizing-container">
          {/* Left Content */}
          <div className="organizing-content">
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "var(--emerald-600)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              ORGANIZING COMMITTEE REGISTRY
            </span>

            <h2>आयोजन समिति एवं संपर्क सूत्र</h2>

            <p
              style={{
                color: "var(--slate-600)",
                lineHeight: 1.7,
                marginBottom: "24px",
              }}
            >
              प्रतियोगिता से संबंधित किसी भी पूछताछ, स्थान विवरण अथवा सहायता
              हेतु हमारे स्वयंसेवकों एवं आयोजन समिति से संपर्क करें:
            </p>

            <div className="contact-list">
              {/* Phone */}
              <div className="contact-item">
                <Phone size={20} color="var(--purple-600)" />

                <div className="contact-text">
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--slate-900)",
                    }}
                  >
                    हेल्पलाइन / स्वयंसेवक डेस्क:
                  </div>

                  <div className="contact-value">
                    +91 98765 00001 / +91 98765 00002
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="contact-item">
                <Mail size={20} color="var(--emerald-600)" />

                <div className="contact-text">
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--slate-900)",
                    }}
                  >
                    आधिकारिक ईमेल:
                  </div>

                  <div className="contact-value">
                    sports@saripatti.org / contact@aaravsports.in
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="contact-item">
                <MapPin size={20} color="var(--pink-600)" />

                <div className="contact-text">
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--slate-900)",
                    }}
                  >
                    स्थान व पता:
                  </div>

                  <div className="contact-value">
                    मुख्य खेल मैदान, ग्राम सभा सारीपट्टी, मिर्जापुर, उत्तर प्रदेश
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Rules Card */}
          <div className="rules-card">
            <h3>प्रतियोगिता के मुख्य नियम व पात्रता</h3>

            <ul>
              <li>
                प्रत्येक खिलाड़ी को आधार कार्ड (Aadhaar Card) सत्यापन अनिवार्य
                है।
              </li>

              <li>
                खिलाड़ी अपने निर्धारित आयु / कक्षा वर्ग के अंतर्गत ही भाग ले
                सकते हैं।
              </li>

              <li>
                मैदान पर रिपोर्टिंग समय से 30 मिनट पूर्व उपस्थित होना अनिवार्य
                है।
              </li>

              <li>
                अनुशासनहीनता की स्थिति में खिलाड़ी को तत्काल अयोग्य घोषित किया
                जाएगा।
              </li>

              <li>
                विजेताओं को समिति द्वारा अधिकृत प्रमाण-पत्र एवं पदक प्रदान किए
                जाएंगे।
              </li>
            </ul>

            <div style={{ marginTop: "24px" }}>
              <Link to="/register" className="btn btn-primary register-btn">
                🏅 तुरंत फॉर्म भरें (Submit Registration)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "var(--slate-950)",
          color: "#94a3b8",
          padding: "40px 20px",
          marginTop: "auto",
          borderTop: "1px solid var(--slate-800)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <strong style={{ color: "#fff", fontSize: "1.1rem" }}>
              आरव खेलकूद उत्सव • Sports Management System
            </strong>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>
              Production-Ready SRS Architecture • React.js + PHP 7.x + MySQL 8.0
            </p>
          </div>
          <div style={{ display: "flex", gap: "16px", fontSize: "0.85rem" }}>
            <Link to="/" style={{ color: "#cbd5e1" }}>
              होम
            </Link>
            <Link to="/games" style={{ color: "#cbd5e1" }}>
              खेल
            </Link>
            <Link to="/winners" style={{ color: "#cbd5e1" }}>
              विजेता
            </Link>
            <Link to="/register" style={{ color: "#cbd5e1" }}>
              पंजीकरण
            </Link>
            <Link to="/login" style={{ color: "#cbd5e1" }}>
              लॉगिन पोर्टल
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
