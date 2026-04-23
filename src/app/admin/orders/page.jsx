"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const GOLD = "#C9A84C";
const DARK = "#0A0804";
const CARD = "#1A1710";
const BORDER = "#2E2A1E";
const MUTED = "#6B6248";
const CREAM = "#F0EAD6";
const SURFACE = "#13110C";

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;600;700;800&display=swap');
`;

const LIFECYCLE = ["pending", "packed", "shipped", "delivered"];

const STATUS_COLOR = {
  pending: "#6B6248",
  packed: "#378add",
  shipped: "#C9A84C",
  delivered: "#52b788",
};

const TEMPLATE_BY_STATUS = {
  pending: "ORDER_CONFIRMED",
  packed: "ORDER_PACKED",
  shipped: "ORDER_SHIPPED",
  delivered: "ORDER_DELIVERED",
};

const tabBaseStyle = {
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
  transition: "all 0.2s ease",
};

const actionButtonStyle = {
  border: `1px solid ${BORDER}`,
  background: SURFACE,
  color: CREAM,
  borderRadius: "8px",
  padding: "8px 10px",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
};

function getNextStatus(status) {
  const idx = LIFECYCLE.indexOf(status);
  if (idx === -1 || idx === LIFECYCLE.length - 1) return status;
  return LIFECYCLE[idx + 1];
}

const fmtINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [apiError, setApiError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [notifyOpenId, setNotifyOpenId] = useState(null);
  const [trackingInputId, setTrackingInputId] = useState(null);
  const [trackingDrafts, setTrackingDrafts] = useState({});
  const [toast, setToast] = useState("");

  async function loadOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch orders");
      }
      setForbidden(false);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setApiError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function patchOrder(order, nextStatus) {
    const payload = { id: order.id, status: nextStatus };
    if (nextStatus === "shipped") {
      const trackingId = (trackingDrafts[order.id] || "").trim();
      if (!trackingId) {
        setApiError("Tracking ID is required before moving an order to shipped.");
        return;
      }
      payload.trackingId = trackingId;
    }

    try {
      setSavingId(order.id);
      setApiError("");
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update order");
      }
      if (nextStatus === "shipped") {
        setTrackingInputId(null);
      }
      await loadOrders();
    } catch (err) {
      setApiError(err.message || "Failed to update order");
    } finally {
      setSavingId(null);
    }
  }

  async function handleAdvance(order) {
    const nextStatus = getNextStatus(order.status);
    if (nextStatus === order.status) return;

    if (nextStatus === "shipped" && trackingInputId !== order.id) {
      setTrackingInputId(order.id);
      return;
    }

    await patchOrder(order, nextStatus);
  }

  async function sendNotification(order) {
    const template = TEMPLATE_BY_STATUS[order.status];
    if (!template) return;

    try {
      setSavingId(order.id);
      setApiError("");
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, orderId: order.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send notification");
      }
      setNotifyOpenId(null);
      setToast("Notification sent ✓");
    } catch (err) {
      setApiError(err.message || "Failed to send notification");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <>
        <style>{FONT_IMPORT}</style>
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            minHeight: "100vh",
            background: DARK,
            color: GOLD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading orders...
        </div>
      </>
    );
  }

  if (forbidden) {
    return (
      <>
        <style>{FONT_IMPORT}</style>
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            minHeight: "100vh",
            background: DARK,
            color: CREAM,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", color: GOLD, margin: 0 }}>
            Access Denied
          </h1>
          <p style={{ color: MUTED, margin: 0 }}>You do not have administrative privileges to view this page.</p>
          <Link
            href="/"
            style={{
              background: GOLD,
              color: DARK,
              padding: "12px 22px",
              borderRadius: "10px",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONT_IMPORT}</style>
      <div
        style={{
          fontFamily: "'Nunito', sans-serif",
          minHeight: "100vh",
          background: DARK,
          color: CREAM,
          padding: "40px",
          position: "relative",
        }}
      >
        {toast && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              background: GOLD,
              color: DARK,
              padding: "10px 14px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "13px",
              zIndex: 30,
              border: `1px solid ${GOLD}`,
              boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
            }}
          >
            {toast}
          </div>
        )}

        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p
                style={{
                  fontSize: "11px",
                  color: MUTED,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                  fontWeight: 700,
                  marginTop: 0,
                }}
              >
                Administration
              </p>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "42px",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: CREAM,
                  margin: 0,
                }}
              >
                Orders
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
                ...tabBaseStyle,
                color: MUTED,
                background: "transparent",
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              style={{
                ...tabBaseStyle,
                color: MUTED,
                background: "transparent",
              }}
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              style={{
                ...tabBaseStyle,
                color: DARK,
                background: GOLD,
                borderColor: GOLD,
              }}
            >
              Orders
            </Link>
          </div>
        </div>

        {apiError && (
          <div
            style={{
              marginBottom: "14px",
              background: "rgba(226, 75, 74, 0.12)",
              border: "1px solid rgba(226, 75, 74, 0.4)",
              color: "#f08a89",
              borderRadius: "10px",
              padding: "10px 12px",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {apiError}
          </div>
        )}

        <div
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 22px",
              borderBottom: `1px solid ${BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "28px",
                color: CREAM,
              }}
            >
              Order Tracking
            </h2>
            <span style={{ fontSize: "12px", color: MUTED, fontWeight: 700 }}>{orders.length} orders</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1120px" }}>
              <thead>
                <tr>
                  {["Order ID", "Customer", "Items", "Total", "Status", "Tracking ID", "Actions"].map((label) => (
                    <th
                      key={label}
                      style={{
                        textAlign: "left",
                        padding: "14px 18px",
                        fontSize: "11px",
                        color: MUTED,
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                        fontWeight: 800,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  const isDelivered = order.status === "delivered";
                  const template = TEMPLATE_BY_STATUS[order.status];
                  const statusColor = STATUS_COLOR[order.status] || MUTED;

                  return (
                    <tr key={order.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td
                        style={{
                          padding: "14px 18px",
                          color: MUTED,
                          fontFamily: "monospace",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        #{order.id.slice(0, 8)}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: CREAM }}>
                          {order.user?.name || order.user?.email || "Guest"}
                        </div>
                        {order.user?.email && (
                          <div style={{ fontSize: "12px", color: MUTED, marginTop: "2px" }}>{order.user.email}</div>
                        )}
                      </td>
                      <td style={{ padding: "14px 18px", color: MUTED, fontSize: "13px", maxWidth: "280px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {(order.items || []).map((item) => (
                            <span key={item.id}>{item.product?.name || "Luxury Gift"}</span>
                          ))}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 18px",
                          color: GOLD,
                          fontWeight: 800,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "21px",
                        }}
                      >
                        {fmtINR(order.total)}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            padding: "5px 11px",
                            borderRadius: "999px",
                            background: `${statusColor}22`,
                            color: statusColor,
                            fontSize: "11px",
                            fontWeight: 800,
                            letterSpacing: "0.8px",
                            textTransform: "uppercase",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: statusColor,
                              display: "inline-block",
                            }}
                          />
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", color: order.trackingId ? CREAM : MUTED, fontSize: "13px" }}>
                        {order.trackingId || "—"}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
                          <button
                            type="button"
                            onClick={() => handleAdvance(order)}
                            disabled={isDelivered || savingId === order.id}
                            style={{
                              ...actionButtonStyle,
                              background: isDelivered ? BORDER : SURFACE,
                              color: isDelivered ? MUTED : CREAM,
                              cursor: isDelivered ? "not-allowed" : "pointer",
                              opacity: savingId === order.id ? 0.7 : 1,
                            }}
                          >
                            Advance Status →
                          </button>

                          {trackingInputId === order.id && nextStatus === "shipped" && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <input
                                value={trackingDrafts[order.id] || ""}
                                onChange={(e) =>
                                  setTrackingDrafts((prev) => ({
                                    ...prev,
                                    [order.id]: e.target.value,
                                  }))
                                }
                                placeholder="Tracking ID"
                                style={{
                                  background: SURFACE,
                                  border: `1px solid ${BORDER}`,
                                  borderRadius: "8px",
                                  color: CREAM,
                                  padding: "7px 10px",
                                  width: "130px",
                                  fontSize: "12px",
                                  outline: "none",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => patchOrder(order, "shipped")}
                                disabled={savingId === order.id}
                                style={{
                                  ...actionButtonStyle,
                                  background: GOLD,
                                  borderColor: GOLD,
                                  color: DARK,
                                  padding: "7px 10px",
                                }}
                              >
                                Save
                              </button>
                            </div>
                          )}

                          <div style={{ position: "relative" }}>
                            <button
                              type="button"
                              onClick={() => setNotifyOpenId((prev) => (prev === order.id ? null : order.id))}
                              style={actionButtonStyle}
                              disabled={!template || savingId === order.id}
                            >
                              Notify Customer 🔔
                            </button>
                            {notifyOpenId === order.id && template && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "calc(100% + 6px)",
                                  left: 0,
                                  minWidth: "180px",
                                  background: CARD,
                                  border: `1px solid ${BORDER}`,
                                  borderRadius: "10px",
                                  boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
                                  zIndex: 10,
                                  padding: "6px",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => sendNotification(order)}
                                  style={{
                                    width: "100%",
                                    textAlign: "left",
                                    border: "none",
                                    background: "transparent",
                                    color: CREAM,
                                    padding: "8px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {template}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "22px", textAlign: "center", color: MUTED }}>
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
