"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// ── Design tokens ────────────────────────────────────────────────
const GOLD = "#C9A84C";
const DARK = "#0A0804";
const SURFACE = "#13110C";
const CARD = "#1A1710";
const BORDER = "#2E2A1E";
const MUTED = "#6B6248";
const CREAM = "#F0EAD6";

// ── Mock data (matches your Sales schema: month / revenue / orders) ──
const SALES = [
  { m: "Jan", s: 45200, o: 38 },
  { m: "Feb", s: 61800, o: 52 },
  { m: "Mar", s: 53400, o: 44 },
  { m: "Apr", s: 78900, o: 67 },
  { m: "May", s: 92100, o: 81 },
  { m: "Jun", s: 87300, o: 74 },
  { m: "Jul", s: 104500, o: 93 },
  { m: "Aug", s: 98200, o: 88 },
];

const TOP_PRODUCTS = [
  { id: 1, name: "Belgian Luxury Chocolate Box", category: "Gourmet Food", price: 2499, orders: 623, trend: +18 },
  { id: 2, name: "Sony WH-1000XM5 Headphones", category: "Premium Tech", price: 6999, orders: 891, trend: +34 },
  { id: 3, name: "Japanese Cast Iron Tea Set", category: "Home & Lifestyle", price: 4299, orders: 178, trend: -4 },
  { id: 4, name: "Hermès-Style Silk Scarf", category: "Luxury Fashion", price: 3499, orders: 312, trend: +9 },
  { id: 5, name: "Rare Orchid in Glazed Pot", category: "Botanicals", price: 2199, orders: 134, trend: +2 },
];

// ── Tiny helpers ─────────────────────────────────────────────────
const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
const fmtK = (n) => n >= 1000 ? `₹${(n / 1000).toFixed(0)}k` : fmt(n);

// ── Animated counter ─────────────────────────────────────────────
function Counter({ target, prefix = "", suffix = "", duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{prefix}{val.toLocaleString("en-IN")}{suffix}</>;
}

// ── Inside dynamic CSS ──────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;600;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes barGrow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes sparkDraw {
    to { stroke-dashoffset: 0; }
  }

  .gai-card {
    background: ${CARD};
    border: 1px solid ${BORDER};
    border-radius: 16px;
    animation: fadeUp 0.5s ease both;
  }
  .gai-metric-card {
    position: relative;
    overflow: hidden;
  }
  .gai-metric-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 60%, rgba(201,168,76,0.04) 100%);
    pointer-events: none;
  }
  .gai-bar {
    transform-origin: bottom;
    animation: barGrow 0.8s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .gai-row:hover {
    background: rgba(201,168,76,0.03);
    transition: background 0.2s;
  }
  .gai-sparkline {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    animation: sparkDraw 1s ease forwards 0.8s;
  }
  .gai-trend-up   { color: #52b788; }
  .gai-trend-down { color: #e24b4a; }
`;

// ── Sparkline SVG ────────────────────────────────────────────────
function Sparkline({ data, color, width = 72, height = 28 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline className="gai-sparkline" points={pts} stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Metric card ──────────────────────────────────────────────────
function MetricCard({ label, value, sub, color, prefix = "", suffix = "", delay = 0, sparkData }) {
  return (
    <div className="gai-card gai-metric-card" style={{ padding: "22px 24px", animationDelay: `${delay}ms` }}>
      <div style={{ fontSize: "10px", color: MUTED, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: "14px" }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", fontWeight: 700, color, lineHeight: 1, marginBottom: "6px" }}>
        <Counter target={value} prefix={prefix} suffix={suffix} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
        <span style={{ fontSize: "11px", color: MUTED }}>{sub}</span>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>
    </div>
  );
}

// ── Bar chart ─────────────────────────────────────────────────────
function BarChart({ data }) {
  const maxS = Math.max(...data.map((d) => d.s));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "180px", paddingBottom: "28px", position: "relative" }}>
      {data.map((d, i) => {
        const h = Math.max((d.s / maxS) * 152, 6);
        return (
          <div key={d.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", position: "relative" }}>
            <div className="gai-bar" style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              height: `${h}px`,
              background: `linear-gradient(180deg, ${GOLD}CC 0%, ${GOLD}66 100%)`,
              animationDelay: `${i * 80}ms`,
            }} />
            <div style={{ fontSize: "11px", color: MUTED, fontWeight: 600, position: "absolute", bottom: 0 }}>{d.m}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Donut ring for product share ─────────────────────────────────
function MiniDonut({ value, max, color, size = 36 }) {
  const r = 14, c = 2 * Math.PI * r;
  const pct = value / max;
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="18" cy="18" r={r} fill="none" stroke={BORDER} strokeWidth="3" />
      <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${c * pct} ${c * (1 - pct)}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.status === 403) {
          setForbidden(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      } catch (err) {
        console.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: DARK, color: "#F0EAD6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "40px", color: GOLD, marginBottom: "16px" }}>Access Denied</h1>
        <p style={{ color: MUTED, marginBottom: "24px" }}>You do not have administrative privileges to view this page.</p>
        <a href="/" style={{ background: GOLD, color: DARK, padding: "12px 24px", borderRadius: "8px", fontWeight: 700, textDecoration: "none" }}>Back to Home</a>
      </div>
    );
  }

  const STATUS_COLOR = {
    delivered: "#52b788",
    shipped: "#C9A84C",
    packed: "#378add",
    pending: "#6B6248",
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ fontFamily: "'Nunito', sans-serif", color: CREAM, minHeight: "100vh", background: DARK, padding: "40px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "32px", animation: "fadeUp 0.4s ease both" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "11px", color: MUTED, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px", fontWeight: 700 }}>
                Administration
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 700, lineHeight: 1, color: CREAM }}>
                Dashboard
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: MUTED, marginBottom: "4px" }}>Logged in as</div>
              <div style={{ fontSize: "13px", color: GOLD, fontWeight: 700 }}>Admin Staff</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px" }}>
            <div style={{ flex: 1, height: "1px", background: BORDER }} />
            <div style={{ color: GOLD, fontSize: "16px", opacity: 0.6 }}>◆</div>
            <div style={{ flex: 1, height: "1px", background: BORDER }} />
          </div>
          <div style={{ marginTop: "18px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "999px",
                border: `1px solid ${GOLD}`,
                padding: "9px 16px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                color: DARK,
                background: GOLD,
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "999px",
                border: `1px solid ${BORDER}`,
                padding: "9px 16px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                color: MUTED,
                background: "transparent",
              }}
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "999px",
                border: `1px solid ${BORDER}`,
                padding: "9px 16px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                color: MUTED,
                background: "transparent",
              }}
            >
              Orders
            </Link>
          </div>
        </div>

        {/* ── Metric cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {(stats || []).map((m, i) => (
            <MetricCard
              key={m.label}
              label={m.label}
              value={parseInt(m.value.replace(/[^0-9]/g, ""))}
              prefix={m.label.includes("Revenue") ? "₹" : ""}
              color={i === 0 ? GOLD : i === 1 ? "#52b788" : i === 2 ? "#378add" : "#d4537e"}
              sub={m.trend || "Live"}
              delay={i * 80}
              sparkData={[4, 7, 5, 9, 8, 12, 10, 15]} // Placeholder for sparkline
            />
          ))}
        </div>

        {/* ── Charts & Products ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px", marginBottom: "20px" }}>
          <div className="gai-card" style={{ padding: "28px" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: CREAM, marginBottom: "24px" }}>Monthly Revenue Graph</div>
            <BarChart data={SALES} />
          </div>
          <div className="gai-card" style={{ padding: "24px" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: CREAM, marginBottom: "20px" }}>Top Inventory Items</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <MiniDonut value={p.orders} max={1000} color={GOLD} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", color: CREAM, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: "11px", color: MUTED }}>{p.orders} sold · {fmt(p.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Sales ── */}
        <div className="gai-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "22px 28px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: CREAM }}>Recent Activity</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 110px 100px", gap: "12px", padding: "10px 28px", borderBottom: `1px solid ${BORDER}` }}>
            {["Order ID", "Customer", "Product", "Amount", "Status"].map((h) => (
              <div key={h} style={{ fontSize: "10px", color: MUTED, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {(recentOrders || []).map((o, i) => (
            <div key={o.id} className="gai-row" style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 110px 100px", gap: "12px", padding: "16px 28px", borderBottom: i < recentOrders.length - 1 ? `1px solid ${BORDER}` : "none", alignItems: "center" }}>
              <div style={{ fontSize: "12px", color: MUTED, fontWeight: 700, fontFamily: "monospace" }}>#{o.id}</div>
              <div style={{ fontWeight: 700, fontSize: "14px", color: CREAM }}>{o.customer}</div>
              <div style={{ fontSize: "13px", color: MUTED }}>{o.product}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 700, color: GOLD }}>{o.amount}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "10px", fontWeight: 800, padding: "4px 10px", borderRadius: "20px", background: STATUS_COLOR[o.status] + "1A", color: STATUS_COLOR[o.status] }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: STATUS_COLOR[o.status], display: "inline-block" }} />
                {o.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
