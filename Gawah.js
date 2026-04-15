// ═══════════════════════════════════════════════════════════════
//  GAWAH — Act 1: Raat ki Gali
//  A choice-based story game
//  Add to BBN Multiplex: import Gawah from './Gawah'
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef, useCallback } from "react";

// ── Google Font loader ────────────────────────────────────────
const FONT_URL = "https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap";

// ── Game Scenes Data ──────────────────────────────────────────
const SCENES = [
  {
    id: "intro",
    sceneTitle: "FARIDABAD · RAAT 11:47",
    svgType: "walking",
    lines: [
      { speaker: "", text: "Aaj ka din thaka dene wala tha." },
      { speaker: "", text: "Office, boss ki daant, bus miss — sab kuch." },
      { speaker: "", text: "Abhi sirf ghar pahunchna tha." },
      { speaker: "TUMHARA DIMAG", text: "Seedhi gali se jao ya road cross karke shortcut lena hai?" },
    ],
    choices: [
      {
        text: "Seedhi gali se jao — safe rehna chahte ho",
        effect: { fear: -5, courage: 5 },
        consequence: "Tumne safe rasta chuna. Phir bhi wahi hua.",
        next: "murder_scene",
      },
      {
        text: "Shortcut lo — jaldi ghar pahunchna hai",
        effect: { fear: 5, courage: -5 },
        consequence: "Shortcut lene ka faisla... aaj ki raat badal dega sab kuch.",
        next: "murder_scene",
      },
    ],
  },
  {
    id: "murder_scene",
    sceneTitle: "ANDHERE MEIN KYA HUA",
    svgType: "murder",
    flash: true,
    flashAt: 3,
    memory: true,
    lines: [
      { speaker: "", text: "Ek gaadi ruk gayi — 50 meter aage." },
      { speaker: "", text: "Shouting. Do mard. Ek aurat ki awaaz." },
      { speaker: "", text: "Phir..." },
      { speaker: "", text: "DHAAAANG." },
      { speaker: "", text: "Tumhara dil ek pal ke liye ruk gaya." },
      { speaker: "TUMHARA DIMAG", text: "Kya karna chahiye abhi?" },
    ],
    choices: [
      {
        text: "Bhaago — yahan se niklo jaldi",
        effect: { fear: 20, courage: -15 },
        consequence: "Tumne bhaagna chaha. Yahi dekha ek aadmi ne.",
        next: "police_arrives",
        memory: true,
      },
      {
        text: "Chupp khade raho — kuch mat karo",
        effect: { fear: 10, courage: -5 },
        consequence: "Tumne dekha — par kuch nahi kiya. Court mein poochhenge.",
        next: "police_arrives",
        memory: true,
      },
      {
        text: "Help ke liye chillao",
        effect: { fear: 15, courage: 10 },
        consequence: "Tumhari awaaz sunayi di. Police ne bhi suna.",
        next: "police_arrives",
        memory: true,
      },
    ],
  },
  {
    id: "police_arrives",
    sceneTitle: "NEELI BATTI",
    svgType: "police",
    lines: [
      { speaker: "", text: "2 minute baad — neeli-laal roshni." },
      { speaker: "", text: "Gaadi ke paas ek laash thi." },
      { speaker: "", text: "Aur tum — akele khade the." },
      { speaker: "INSPECTOR RATHOD", text: '"Ruko. Kahan ja rahe ho itni raat ko?"' },
      { speaker: "ANJAAN AADMI", text: '"Saab! Yahi tha — maine dekha! Yeh bhaag raha tha!"' },
      { speaker: "", text: "Tumne us aadmi ko pehle kabhi nahi dekha tha." },
    ],
    choices: [
      {
        text: '"Main toh bas rasta cross kar raha tha saab"',
        effect: { fear: 10, courage: 5 },
        consequence: "Sach bola — lekin koi witness nahi tha.",
        next: "arrested",
      },
      {
        text: '"Maine kuch nahi kiya — woh jhooth bol raha hai!"',
        effect: { fear: 15, courage: 10 },
        consequence: "Tum gusse mein the. Rathod ki aankhon mein shak.",
        next: "arrested",
      },
      {
        text: "Chup raho — kuch mat bolo",
        effect: { fear: 20, courage: -10 },
        consequence: "Chuppi ne tumhe aur suspicious banaya.",
        next: "arrested",
      },
    ],
  },
  {
    id: "arrested",
    sceneTitle: "HANDCUFFS",
    svgType: "arrested",
    lines: [
      { speaker: "INSPECTOR RATHOD", text: '"Chal station. Baat karte hain wahan."' },
      { speaker: "", text: "Tumhare haath peeth ke peeche bandh ho gaye." },
      { speaker: "", text: "Thandi lohe ki khanak." },
      { speaker: "", text: "Ek constable ne phone nikal liya — camera." },
      { speaker: "", text: "Flash." },
      { speaker: "", text: '"Murder Suspect Arrested" — kal ka headline ban gaya tha tum.' },
      { speaker: "TUMHARA DIMAG", text: "Phone pe kise message karna chahoge abhi — ek hi chance hai." },
    ],
    choices: [
      {
        text: "Maa ko message karo",
        effect: { fear: -10, courage: 10, evidence: 5 },
        consequence: "Maa ko pata chal gaya. Woh kaanp rahi hogi abhi.",
        next: "act1_end",
      },
      {
        text: "Dost Priya ko message karo — journalist hai",
        effect: { fear: -5, courage: 15, evidence: 15 },
        consequence: "Priya ko khabar mili. Shayad woh kuch kar sake.",
        next: "act1_end",
      },
      {
        text: "Kisi ko mat batao — khud sambhaaloge",
        effect: { fear: 10, courage: -10, evidence: 0 },
        consequence: "Akele ladte rahoge. Abhi ke liye.",
        next: "act1_end",
      },
    ],
  },
  {
    id: "act1_end",
    sceneTitle: "ACT 1 · KHATAM",
    svgType: "cell",
    isEnd: true,
    lines: [
      { speaker: "", text: "Gaadi ruk gayi. Station aa gaya." },
      { speaker: "", text: "Ek kamre mein band kar diya gaya." },
      { speaker: "", text: "Ek bulb. Ek table. Ek kursi." },
      { speaker: "INSPECTOR RATHOD", text: '"Aaram se soch. Sach batao. Sab theek ho jayega."' },
      { speaker: "", text: '"Sab theek ho jayega."' },
      { speaker: "", text: "Tumne yeh line pehle films mein suni thi." },
      { speaker: "", text: "Wahan bhi jhooth thi." },
    ],
    choices: [],
  },
];

// ── SVG Scene Illustrations ───────────────────────────────────
function SceneSVG({ type }) {
  const figures = {
    walking: (
      <>
        <g transform="translate(300,148)">
          <circle cx="0" cy="-30" r="7" fill="#3a3a5a" />
          <rect x="-5" y="-23" width="10" height="18" fill="#2a2a4a" rx="2" />
          <rect x="-3" y="-5" width="3" height="12" fill="#2a2a4a" />
          <rect x="0" y="-5" width="3" height="12" fill="#2a2a4a" />
        </g>
      </>
    ),
    murder: (
      <>
        <g transform="translate(120,148)">
          <circle cx="0" cy="-30" r="7" fill="#1a1a2a" />
          <rect x="-5" y="-23" width="10" height="18" fill="#111120" rx="2" />
          <rect x="-3" y="-5" width="3" height="12" fill="#111120" />
          <rect x="0" y="-5" width="3" height="12" fill="#111120" />
        </g>
        <g transform="translate(155,155)">
          <ellipse cx="0" cy="0" rx="12" ry="5" fill="#1a0505" opacity="0.8" />
          <circle cx="0" cy="-8" r="6" fill="#1a1a28" />
          <rect x="-4" y="-3" width="8" height="12" fill="#1a1a28" rx="1" />
        </g>
        <circle cx="165" cy="152" r="8" fill="rgba(180,0,0,0.3)" />
        <g transform="translate(320,148)">
          <circle cx="0" cy="-30" r="7" fill="#3a3a5a" />
          <rect x="-5" y="-23" width="10" height="18" fill="#2a2a4a" rx="2" />
          <rect x="-3" y="-5" width="3" height="12" fill="#2a2a4a" />
          <rect x="0" y="-5" width="3" height="12" fill="#2a2a4a" />
        </g>
      </>
    ),
    police: (
      <>
        <g transform="translate(155,155)">
          <ellipse cx="0" cy="0" rx="12" ry="5" fill="#1a0505" opacity="0.8" />
          <circle cx="0" cy="-8" r="6" fill="#1a1a28" />
          <rect x="-4" y="-3" width="8" height="12" fill="#1a1a28" rx="1" />
        </g>
        <g transform="translate(300,148)">
          <circle cx="0" cy="-30" r="7" fill="#3a3a5a" />
          <rect x="-5" y="-23" width="10" height="18" fill="#2a2a4a" rx="2" />
          <rect x="-3" y="-5" width="3" height="12" fill="#2a2a4a" />
          <rect x="0" y="-5" width="3" height="12" fill="#2a2a4a" />
        </g>
        <g transform="translate(380,145)">
          <circle cx="0" cy="-30" r="7" fill="#1a2a4a" />
          <rect x="-5" y="-23" width="10" height="18" fill="#1a2a4a" rx="2" />
          <rect x="-3" y="-5" width="3" height="12" fill="#1a2a4a" />
          <rect x="0" y="-5" width="3" height="12" fill="#1a2a4a" />
          <rect x="-6" y="-36" width="12" height="4" fill="#223366" rx="1" />
        </g>
        <ellipse cx="380" cy="158" rx="25" ry="8" fill="rgba(0,80,255,0.12)" />
      </>
    ),
    arrested: (
      <>
        <g transform="translate(240,148)">
          <circle cx="0" cy="-30" r="7" fill="#3a3a5a" />
          <rect x="-5" y="-23" width="10" height="18" fill="#2a2a4a" rx="2" />
          <rect x="-3" y="-5" width="3" height="12" fill="#2a2a4a" />
          <rect x="0" y="-5" width="3" height="12" fill="#2a2a4a" />
          <rect x="-12" y="-8" width="24" height="3" fill="#888" rx="1" opacity="0.8" />
        </g>
        <g transform="translate(295,145)">
          <circle cx="0" cy="-30" r="7" fill="#1a2a4a" />
          <rect x="-5" y="-23" width="10" height="18" fill="#1a2a4a" rx="2" />
          <rect x="-3" y="-5" width="3" height="12" fill="#1a2a4a" />
          <rect x="0" y="-5" width="3" height="12" fill="#1a2a4a" />
          <rect x="-6" y="-36" width="12" height="4" fill="#223366" rx="1" />
        </g>
      </>
    ),
    cell: (
      <>
        <rect x="100" y="60" width="280" height="130" fill="#0a0a14" stroke="rgba(255,255,255,0.06)" strokeWidth="1" rx="2" />
        <rect x="360" y="70" width="20" height="110" fill="#0d0d18" />
        <rect x="363" y="70" width="2" height="110" fill="rgba(255,255,255,0.05)" />
        <rect x="370" y="70" width="2" height="110" fill="rgba(255,255,255,0.05)" />
        <rect x="377" y="70" width="2" height="110" fill="rgba(255,255,255,0.05)" />
        <circle cx="240" cy="75" r="8" fill="rgba(255,200,80,0.5)" />
        <ellipse cx="240" cy="110" rx="60" ry="40" fill="rgba(255,180,50,0.04)" />
        <g transform="translate(220,140)">
          <circle cx="0" cy="-30" r="7" fill="#3a3a5a" />
          <rect x="-5" y="-23" width="10" height="18" fill="#2a2a4a" rx="2" />
          <rect x="-3" y="-5" width="3" height="12" fill="#2a2a4a" />
          <rect x="0" y="-5" width="3" height="12" fill="#2a2a4a" />
        </g>
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 480 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Sky */}
      <rect width="480" height="200" fill="#060610" />
      {/* Stars */}
      <circle cx="50" cy="20" r="1" fill="rgba(255,255,255,0.4)" />
      <circle cx="120" cy="12" r="1.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="200" cy="30" r="1" fill="rgba(255,255,255,0.5)" />
      <circle cx="310" cy="15" r="1" fill="rgba(255,255,255,0.3)" />
      <circle cx="400" cy="25" r="1.5" fill="rgba(255,255,255,0.4)" />
      {/* Buildings */}
      <rect x="0" y="60" width="80" height="140" fill="#0d0d18" />
      <rect x="10" y="50" width="55" height="150" fill="#0d0d18" />
      <rect x="80" y="80" width="60" height="120" fill="#0f0f1a" />
      <rect x="150" y="55" width="70" height="145" fill="#0d0d18" />
      <rect x="240" y="70" width="90" height="130" fill="#0f0f1a" />
      <rect x="350" y="45" width="80" height="155" fill="#0d0d18" />
      <rect x="420" y="75" width="60" height="125" fill="#0f0f1a" />
      {/* Windows */}
      <rect x="20" y="65" width="8" height="6" fill="rgba(255,220,100,0.15)" rx="1" />
      <rect x="35" y="65" width="8" height="6" fill="#1a1a2e" rx="1" />
      <rect x="165" y="70" width="8" height="6" fill="rgba(255,220,100,0.12)" rx="1" />
      <rect x="180" y="85" width="8" height="6" fill="rgba(255,220,100,0.08)" rx="1" />
      <rect x="360" y="60" width="8" height="6" fill="rgba(255,220,100,0.15)" rx="1" />
      {/* Road */}
      <rect x="0" y="155" width="480" height="45" fill="#0c0c14" />
      <rect x="60" y="175" width="30" height="3" fill="rgba(255,255,255,0.07)" rx="1" />
      <rect x="150" y="175" width="30" height="3" fill="rgba(255,255,255,0.07)" rx="1" />
      <rect x="240" y="175" width="30" height="3" fill="rgba(255,255,255,0.07)" rx="1" />
      <rect x="330" y="175" width="30" height="3" fill="rgba(255,255,255,0.07)" rx="1" />
      {/* Streetlight */}
      <rect x="230" y="100" width="4" height="55" fill="#1a1a2a" />
      <rect x="220" y="98" width="24" height="5" fill="#1a1a2a" rx="2" />
      <ellipse cx="232" cy="110" rx="50" ry="28" fill="rgba(255,120,0,0.06)" />
      <circle cx="232" cy="100" r="4" fill="rgba(255,160,40,0.9)" />
      {/* Dynamic figures */}
      {figures[type] || figures.walking}
    </svg>
  );
}

// ── Rain Canvas ───────────────────────────────────────────────
function RainCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const drops = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 4 + Math.random() * 6,
      len: 8 + Math.random() * 12,
      opacity: 0.15 + Math.random() * 0.3,
    }));
    let raf;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach((d) => {
        ctx.globalAlpha = d.opacity;
        ctx.strokeStyle = "rgba(150,180,255,0.6)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) { d.y = -20; d.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", opacity: 0.18, zIndex: 0,
      }}
    />
  );
}

// ── Stat Bar ──────────────────────────────────────────────────
function StatBar({ label, value, color }) {
  return (
    <div style={{ flex: 1, padding: "8px 10px", borderRight: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
      <div style={{ fontSize: 9, letterSpacing: "1.2px", color: "#444", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ fontSize: 11, color: "#666", marginTop: 3, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Gawah() {
  const [screen, setScreen] = useState("title"); // title | game | end
  const [sceneId, setSceneId] = useState("intro");
  const [lineIndex, setLineIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [flash, setFlash] = useState(false);
  const [consequence, setConsequence] = useState("");
  const [showMemory, setShowMemory] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [stats, setStats] = useState({ fear: 20, courage: 75, evidence: 0 });
  const [choices, setChoices] = useState({});
  const [fadeText, setFadeText] = useState(true);

  const scene = SCENES.find((s) => s.id === sceneId) || SCENES[0];
  const currentLine = scene.lines[lineIndex];
  const TOTAL = SCENES.length;

  // Load font
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Load saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gawah_v1");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.sceneId) setSceneId(d.sceneId);
        if (d.stats) setStats(d.stats);
        if (d.choices) setChoices(d.choices);
        if (d.screen) setScreen(d.screen);
      }
    } catch {}
  }, []);

  // Auto save
  useEffect(() => {
    try {
      localStorage.setItem("gawah_v1", JSON.stringify({ sceneId, stats, choices, screen }));
    } catch {}
  }, [sceneId, stats, choices, screen]);

  const showConsequenceMsg = useCallback((msg) => {
    setConsequence(msg);
    setTimeout(() => setConsequence(""), 3000);
  }, []);

  function advanceLine() {
    if (showChoices) return;
    const nextIndex = lineIndex + 1;

    // Flash effect
    if (scene.flash && nextIndex - 1 === scene.flashAt) {
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
    }

    if (nextIndex >= scene.lines.length) {
      if (scene.isEnd) return;
      if (scene.memory) setShowMemory(true);
      setShowChoices(true);
    } else {
      setFadeText(false);
      setTimeout(() => { setLineIndex(nextIndex); setFadeText(true); }, 80);
    }
  }

  function makeChoice(choice) {
    setShowChoices(false);
    setShowMemory(false);
    setChoices((prev) => ({ ...prev, [sceneId]: choice.text }));

    if (choice.effect) {
      setStats((prev) => ({
        fear: Math.max(0, Math.min(100, prev.fear + (choice.effect.fear || 0))),
        courage: Math.max(0, Math.min(100, prev.courage + (choice.effect.courage || 0))),
        evidence: Math.max(0, Math.min(100, prev.evidence + (choice.effect.evidence || 0))),
      }));
    }

    if (choice.consequence) showConsequenceMsg(choice.consequence);

    const nextScene = SCENES.find((s) => s.id === choice.next);
    if (!nextScene) return;
    setSceneProgress((p) => p + 1);

    setTimeout(() => {
      setSceneId(choice.next);
      setLineIndex(0);
      setFadeText(true);
      if (nextScene.isEnd) {
        setTimeout(() => setScreen("end"), nextScene.lines.length * 100 + 2000);
      }
    }, 350);
  }

  function resetGame() {
    localStorage.removeItem("gawah_v1");
    setScreen("title");
    setSceneId("intro");
    setLineIndex(0);
    setShowChoices(false);
    setStats({ fear: 20, courage: 75, evidence: 0 });
    setChoices({});
    setSceneProgress(0);
  }

  const S = {
    root: {
      position: "relative",
      width: "100%",
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e8e0d0",
      fontFamily: "'Rajdhani', 'Arial', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflow: "hidden",
    },
    game: {
      position: "relative",
      zIndex: 1,
      width: "100%",
      maxWidth: 480,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
  };

  // ── TITLE SCREEN ──
  if (screen === "title") {
    return (
      <div style={S.root}>
        <RainCanvas />
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "100vh", gap: 24,
          textAlign: "center", padding: 32,
        }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#ff6600", textTransform: "uppercase" }}>
            Act I — Raat ki Gali
          </div>
          <h1 style={{
            fontSize: 64, fontWeight: 700, letterSpacing: 10,
            color: "#fff", textShadow: "0 0 60px rgba(255,60,0,0.3)",
            margin: 0,
          }}>GAWAH</h1>
          <div style={{ fontSize: 15, color: "#666", letterSpacing: 2, lineHeight: 2, maxWidth: 280 }}>
            Tum innocent ho.<br />
            Koi nahi jaanta.<br />
            <span style={{ color: "#ff4444" }}>Abhi tak.</span>
          </div>
          <div style={{ fontSize: 12, color: "#444", letterSpacing: 1 }}>
            11:47 PM · Faridabad · Tuesday
          </div>
          <button
            onClick={() => setScreen("game")}
            style={{
              marginTop: 16, background: "rgba(255,100,0,0.1)",
              border: "1px solid rgba(255,100,0,0.4)", color: "#ff8844",
              padding: "14px 44px", fontFamily: "'Rajdhani', sans-serif",
              fontSize: 16, fontWeight: 700, letterSpacing: 3,
              cursor: "pointer", borderRadius: 2, textTransform: "uppercase",
            }}
          >SHURU KARO</button>
          {choices && Object.keys(choices).length > 0 && (
            <button
              onClick={resetGame}
              style={{
                background: "transparent", border: "none",
                color: "#444", fontSize: 12, cursor: "pointer", letterSpacing: 1,
              }}
            >↺ Naya Game</button>
          )}
        </div>
      </div>
    );
  }

  // ── END SCREEN ──
  if (screen === "end") {
    return (
      <div style={S.root}>
        <RainCanvas />
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "100vh", gap: 20,
          textAlign: "center", padding: 32,
        }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#ff6600" }}>ACT 1 · KHATAM</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", margin: 0 }}>Interrogation Shuru Hoga</h2>
          <div style={{ fontSize: 14, color: "#666", lineHeight: 1.8, maxWidth: 300 }}>
            Inspector Rathod tumhara intezaar kar raha hai.<br />
            Ek kamra. Ek bulb. Koi gawah nahi.
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,100,0,0.2)", borderRadius: 6, padding: "16px 24px", width: "100%", maxWidth: 300 }}>
            <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, marginBottom: 12 }}>TUMHARI STATS</div>
            {[
              { label: "Darr", val: stats.fear, color: "#ff4444" },
              { label: "Hosla", val: stats.courage, color: "#44aaff" },
              { label: "Seekh", val: stats.evidence, color: "#ffcc44" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#555", minWidth: 50 }}>{s.label}</span>
                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                  <div style={{ width: `${s.val}%`, height: "100%", background: s.color, borderRadius: 2, transition: "width 1s ease" }} />
                </div>
                <span style={{ fontSize: 12, color: "#555", minWidth: 24, textAlign: "right" }}>{s.val}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "#555", letterSpacing: 1 }}>Act 2 — Thane ki Raat · Coming Soon</div>
          <button
            onClick={resetGame}
            style={{
              background: "rgba(255,100,0,0.1)", border: "1px solid rgba(255,100,0,0.3)",
              color: "#ff8844", padding: "12px 32px", fontFamily: "'Rajdhani', sans-serif",
              fontSize: 14, fontWeight: 700, letterSpacing: 2,
              cursor: "pointer", borderRadius: 2, textTransform: "uppercase",
            }}
          >↺ Dobara Khelo</button>
        </div>
      </div>
    );
  }

  // ── GAME SCREEN ──
  return (
    <div style={S.root} onClick={!showChoices ? advanceLine : undefined}>
      <RainCanvas />

      {/* Consequence popup */}
      {consequence && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "rgba(10,10,20,0.97)", border: "1px solid rgba(255,100,0,0.4)",
          color: "#ff9944", padding: "10px 20px", fontSize: 12, letterSpacing: 1,
          borderRadius: 4, zIndex: 100, maxWidth: 280, textAlign: "center",
          pointerEvents: "none",
        }}>{consequence}</div>
      )}

      {/* Flash overlay */}
      {flash && (
        <div style={{
          position: "fixed", inset: 0, background: "#ff0000",
          opacity: 0, zIndex: 50, pointerEvents: "none",
          animation: "gawah-flash 0.4s ease-out forwards",
        }} />
      )}

      <style>{`
        @keyframes gawah-flash { 0%{opacity:0} 20%{opacity:0.65} 100%{opacity:0} }
        @keyframes gawah-fadein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        .gawah-fade { animation: gawah-fadein 0.35s ease forwards; }
        .gawah-choice:hover { background: rgba(255,100,0,0.1) !important; border-color: rgba(255,100,0,0.5) !important; color: #fff !important; transform: translateX(3px); }
      `}</style>

      <div style={S.game}>
        {/* Status bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 16px", background: "rgba(0,0,0,0.7)",
          borderBottom: "1px solid rgba(255,100,0,0.15)",
          fontSize: 11, letterSpacing: 1.5, color: "#555",
        }}>
          <span>ACT 1</span>
          <span style={{ color: "#ff6600", fontWeight: 700, fontSize: 13 }}>11:47 PM</span>
          <span>DIN 0</span>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 4, padding: "8px 16px", background: "rgba(0,0,0,0.5)" }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: i < sceneProgress ? "rgba(255,100,0,0.6)" : i === sceneProgress ? "#ff6600" : "rgba(255,255,255,0.1)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* Scene illustration */}
        <div style={{
          position: "relative", height: 200,
          background: "linear-gradient(180deg, #050508 0%, #0d1020 40%, #1a0f0a 100%)",
          borderBottom: "2px solid rgba(255,60,0,0.1)",
          overflow: "hidden",
        }}>
          <SceneSVG type={scene.svgType} />
          <div style={{
            position: "absolute", bottom: 10, left: 14,
            fontSize: 10, letterSpacing: 2, color: "rgba(255,100,0,0.55)",
            textTransform: "uppercase", fontWeight: 700,
          }}>{scene.sceneTitle}</div>
        </div>

        {/* Memory note */}
        {showMemory && (
          <div style={{
            background: "rgba(255,200,50,0.05)", borderLeft: "2px solid rgba(255,200,50,0.35)",
            padding: "8px 14px", margin: "0 0 0 0",
            fontSize: 12, color: "#aa9944", letterSpacing: 0.5,
          }}>
            YAADDAASHT: Yeh detail court mein kaam aayegi.
          </div>
        )}

        {/* Dialogue */}
        {!showChoices && currentLine && (
          <div style={{
            background: "rgba(5,5,15,0.97)",
            borderTop: "1px solid rgba(255,100,0,0.2)",
            padding: "16px 16px 28px",
            minHeight: 110, position: "relative",
            cursor: "pointer",
          }}>
            {currentLine.speaker && (
              <div style={{
                fontSize: 10, letterSpacing: 2, color: "#ff6600",
                textTransform: "uppercase", marginBottom: 6, fontWeight: 700,
              }}>{currentLine.speaker}</div>
            )}
            <div
              key={`${sceneId}-${lineIndex}`}
              className="gawah-fade"
              style={{ fontSize: 16, lineHeight: 1.65, color: "#ddd8cc", minHeight: 48 }}
            >{currentLine.text}</div>
            {lineIndex < scene.lines.length - 1 && (
              <div style={{
                position: "absolute", bottom: 10, right: 16,
                fontSize: 11, color: "#333", letterSpacing: 1,
                animation: "gawah-flash 1.2s infinite",
              }}>tap karo ▼</div>
            )}
          </div>
        )}

        {/* Choices */}
        {showChoices && (
          <div style={{
            padding: "14px 16px 20px",
            display: "flex", flexDirection: "column", gap: 8,
            background: "rgba(0,0,0,0.7)",
          }}>
            {scene.choices.map((choice, idx) => (
              <button
                key={idx}
                className="gawah-choice"
                onClick={(e) => { e.stopPropagation(); makeChoice(choice); }}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,100,0,0.2)",
                  color: "#ccc", padding: "12px 16px",
                  textAlign: "left", cursor: "pointer",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 14, lineHeight: 1.45,
                  borderRadius: 4, transition: "all 0.15s",
                  borderLeft: "3px solid #ff6600",
                }}
              >
                <span style={{ color: "#ff6600", fontWeight: 700, marginRight: 8 }}>{idx + 1}.</span>
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* End scene message */}
        {scene.isEnd && !showChoices && lineIndex >= scene.lines.length - 1 && (
          <div style={{
            padding: "16px", textAlign: "center",
            background: "rgba(0,0,0,0.5)", color: "#444",
            fontSize: 12, letterSpacing: 2,
          }}>
            ACT 2 · THANE KI RAAT · COMING SOON
          </div>
        )}

        {/* Stats bar */}
        <div style={{
          display: "flex", marginTop: "auto",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(0,0,0,0.85)",
        }}>
          <StatBar label="DARR" value={stats.fear} color="#ff4444" />
          <StatBar label="HOSLA" value={stats.courage} color="#44aaff" />
          <StatBar label="SEEKH" value={stats.evidence} color="#ffcc44" />
          <div style={{ flex: 1, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 9, letterSpacing: "1.2px", color: "#444", textTransform: "uppercase", marginBottom: 4 }}>ACT</div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
              <div style={{ width: `${(sceneProgress / TOTAL) * 100}%`, height: "100%", background: "#ff6600", borderRadius: 2, transition: "width 0.5s" }} />
            </div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 3, fontWeight: 600 }}>1 / 5</div>
          </div>
        </div>
      </div>
    </div>
  );
}
