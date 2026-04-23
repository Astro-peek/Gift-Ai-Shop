"use client";
import { useState, useEffect, useRef } from "react";

// ── Design tokens ────────────────────────────────────────────────
const GOLD    = "#C9A84C";
const DARK    = "#0A0804";
const SURFACE = "#13110C";
const CARD    = "#1A1710";
const BORDER  = "#2E2A1E";
const MUTED   = "#6B6248";
const CREAM   = "#F0EAD6";

// ── Mock data (matches your Sales schema: month / revenue / orders) ──
const SALES = [
  { m: "Jan", s: 45200,  o: 38  },
  { m: "Feb", s: 61800,  o: 52  },
  { m: "Mar", s: 53400,  o: 44  },
  { m: "Apr", s: 78900,  o: 67  },
  { m: "May", s: 92100,  o: 81  },
  { m: "Jun", s: 87300,  o: 74  },
  { m: "Jul", s: 104500, o: 93  },
  { m: "Aug", s: 98200,  o: 88  },
];

const TOP_PRODUCTS = [
  { id: 1, name: "Belgian Luxury Chocolate Box",  category: "Gourmet Food",    price: 2499, orders: 623, trend: +18 },
  { id: 2, name: "Sony WH-1000XM5 Headphones",    category: "Premium Tech",    price: 6999, orders: 891, trend: +34 },
  { id: 3, name: "Japanese Cast Iron Tea Set",     category: "Home & Lifestyle",price: 4299, orders: 178, trend: -4  },
  { id: 4, name: "Hermès-Style Silk Scarf",        category: "Luxury Fashion",  price: 3499, orders: 312, trend: +9  },
  { id: 5, name: "Rare Orchid in Glazed Pot",      category: "Botanicals",      price: 2199, orders: 134, trend: +2  },
];

const RECENT_SALES = [
  { id: "ORD-2934", cust: "Aarav S.",   product: "Hermès-Style Silk Scarf",    amount: 3499,  status: "confirmed", time: "2 min ago"  },
  { id: "ORD-2933", cust: "Priya M.",   product: "Sony WH-1000XM5",            amount: 6999,  status: "shipped",   time: "18 min ago" },
  { id: "ORD-2932", cust: "Rohan K.",   product: "Chocolate Box × 2",          amount: 4998,  status: "delivered", time: "1 hr ago"   },
  { id: "ORD-2931", cust: "Sneha L.",   product: "Rare Orchid",                amount: 2199,  status: "placed",    time: "2 hr ago"   },
  { id: "ORD-2930", cust: "Vikram T.",  product: "Cast Iron Tea Set",           amount: 4299,  status: "shipped",   time: "3 hr ago"   },
];

const STATUS_COLOR = {
  delivered: "#52b788",
  shipped:   GOLD,
  confirmed: "#378add",
  placed:    MUTED,
};

// ── Tiny helpers ─────────────────────────────────────────────────
const fmt  = (n) => `₹${n.toLocaleString("en-IN")}`;
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
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  .gai-card {
    background: ${CARD};
    border: 1px solid ${BORDER};
    border-radius: 16px;
    animation: fadeUp 0.5s ease both;
  }
  .gai-card:hover {
    border-color: ${GOLD}44;
    transition: border-color 0.3s;
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
  .gai-bar:hover {
    opacity: 1 !important;
    filter: brightness(1.25);
    transition: filter 0.2s, opacity 0.2s;
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
  @keyframes sparkDraw {
    to { stroke-dashoffset: 0; }
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
  const [hovered, setHovered] = useState(null);
  const maxS = Math.max(...data.map((d) => d.s));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "180px", paddingBottom: "28px", position: "relative" }}>
      {/* Y-axis ghost lines */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <div key={f} style={{
          position: "absolute", left: 0, right: 0,
          bottom: `${28 + f * 152}px`,
          borderTop: `1px dashed ${BORDER}`,
          pointerEvents: "none",
        }} />
      ))}
      {data.map((d, i) => {
        const h = Math.max((d.s / maxS) * 152, 6);
        const isHov = hovered === i;
        return (
          <div key={d.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", position: "relative" }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            {/* Tooltip */}
            {isHov && (
              <div style={{
                position: "absolute", bottom: `calc(${h}px + 36px)`, left: "50%", transform: "translateX(-50%)",
                background: SURFACE, border: `1px solid ${GOLD}55`, borderRadius: "8px",
                padding: "6px 10px", whiteSpace: "nowrap", zIndex: 10,
                fontSize: "11px", color: CREAM, fontWeight: 700,
              }}>
                <div style={{ color: GOLD }}>{fmtK(d.s)}</div>
                <div style={{ color: MUTED, fontWeight: 400 }}>{d.o} orders</div>
              </div>
            )}
            {/* Bar */}
            <div className="gai-bar" style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              height: `${h}px`,
              background: isHov
                ? `linear-gradient(180deg, ${GOLD} 0%, ${GOLD}99 100%)`
                : `linear-gradient(180deg, ${GOLD}CC 0%, ${GOLD}66 100%)`,
              animationDelay: `${i * 80}ms`,
              cursor: "pointer",
              transition: "background 0.2s",
            }} />
            <div style={{ fontSize: "11px", color: isHov ? GOLD : MUTED, fontWeight: 600, position: "absolute", bottom: 0 }}>{d.m}</div>
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
  const maxOrders = Math.max(...TOP_PRODUCTS.map((p) => p.orders));
  const totalRevenue = SALES.reduce((s, d) => s + d.s, 0);
  const totalOrders  = SALES.reduce((s, d) => s + d.o, 0);

  const metrics = [
    {
      label: "Total Revenue",    value: totalRevenue, prefix: "₹", suffix: "",  color: GOLD,
      sub: "+18% this month",    delay: 0,
      sparkData: SALES.map((d) => d.s),
    },
    {
      label: "Total Orders",     value: totalOrders,  prefix: "",  suffix: "",  color: "#52b788",
      sub: "67 this month",      delay: 80,
      sparkData: SALES.map((d) => d.o),
    },
    {
      label: "Active Products",  value: TOP_PRODUCTS.length, prefix: "", suffix: "", color: "#378add",
      sub: "5 categories",       delay: 160,
      sparkData: [3, 4, 4, 5, 5, 5, 5, 5],
    },
    {
      label: "Avg. Order Value", value: Math.round(totalRevenue / totalOrders), prefix: "₹", suffix: "", color: "#d4537e",
      sub: "Per transaction",    delay: 240,
      sparkData: SALES.map((d) => Math.round(d.s / d.o)),
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div style={{ fontFamily: "'Nunito', sans-serif", color: CREAM, minHeight: "100vh", background: DARK }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "32px", animation: "fadeUp 0.4s ease both" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "11px", color: MUTED, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px", fontWeight: 700 }}>
                Overview
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 700, lineHeight: 1, color: CREAM }}>
                Dashboard
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: MUTED, marginBottom: "4px" }}>Last updated</div>
              <div style={{ fontSize: "13px", color: GOLD, fontWeight: 700 }}>April 2026</div>
            </div>
          </div>
          {/* Divider with ornament */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px" }}>
            <div style={{ flex: 1, height: "1px", background: BORDER }} />
            <div style={{ color: GOLD, fontSize: "16px", opacity: 0.6 }}>◆</div>
            <div style={{ flex: 1, height: "1px", background: BORDER }} />
          </div>
        </div>

        {/* ── Metric cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
        </div>

        {/* ── Charts row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px", marginBottom: "20px" }}>

          {/* Bar chart */}
          <div className="gai-card" style={{ padding: "28px", animationDelay: "320ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: CREAM, marginBottom: "2px" }}>Monthly Revenue</div>
                <div style={{ fontSize: "12px", color: MUTED }}>Jan – Aug 2026</div>
              </div>
              <div style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}30`, borderRadius: "8px", padding: "6px 14px", fontSize: "11px", color: GOLD, fontWeight: 800, letterSpacing: "1px" }}>
                YTD
              </div>
            </div>
            <BarChart data={SALES} />
          </div>

          {/* Top products donut list */}
          <div className="gai-card" style={{ padding: "24px", animationDelay: "400ms" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: CREAM, marginBottom: "20px" }}>Top Products</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {TOP_PRODUCTS.map((p, i) => {
                const colors = [GOLD, "#52b788", "#378add", "#d4537e", "#a78bfa"];
                const c = colors[i % colors.length];
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <MiniDonut value={p.orders} max={maxOrders} color={c} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", color: CREAM, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontSize: "11px", color: MUTED }}>{p.orders} orders · {fmt(p.price)}</div>
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: 800 }}
                      className={p.trend >= 0 ? "gai-trend-up" : "gai-trend-down"}>
                      {p.trend >= 0 ? "↑" : "↓"}{Math.abs(p.trend)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Recent Sales ── */}
        <div className="gai-card" style={{ padding: "0", overflow: "hidden", animationDelay: "480ms" }}>
          <div style={{ padding: "22px 28px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: CREAM }}>Recent Sales</div>
            <a href="/admin/orders" style={{ fontSize: "12px", color: GOLD, fontWeight: 700, letterSpacing: "0.5px", textDecoration: "none" }}>
              View all →
            </a>
          </div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 110px 100px 80px", gap: "12px", padding: "10px 28px", borderBottom: `1px solid ${BORDER}` }}>
            {["Order", "Customer", "Product", "Amount", "Status", "Time"].map((h) => (
              <div key={h} style={{ fontSize: "10px", color: MUTED, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>

          {RECENT_SALES.map((o, i) => (
            <div key={o.id} className="gai-row" style={{
              display: "grid", gridTemplateColumns: "110px 1fr 1fr 110px 100px 80px",
              gap: "12px", padding: "16px 28px",
              borderBottom: i < RECENT_SALES.length - 1 ? `1px solid ${BORDER}` : "none",
              alignItems: "center",
            }}>
              <div style={{ fontSize: "12px", color: MUTED, fontWeight: 700, fontFamily: "monospace" }}>{o.id}</div>
              <div style={{ fontWeight: 700, fontSize: "14px", color: CREAM }}>{o.cust}</div>
              <div style={{ fontSize: "13px", color: MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.product}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 700, color: GOLD }}>{fmt(o.amount)}</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                fontSize: "10px", fontWeight: 800, padding: "4px 10px", borderRadius: "20px",
                background: STATUS_COLOR[o.status] + "1A",
                color: STATUS_COLOR[o.status],
                letterSpacing: "0.8px", width: "fit-content",
              }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: STATUS_COLOR[o.status], display: "inline-block" }} />
                {o.status.toUpperCase()}
              </div>
              <div style={{ fontSize: "11px", color: MUTED, textAlign: "right" }}>{o.time}</div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
