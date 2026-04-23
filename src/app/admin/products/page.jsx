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

const EMPTY_FORM = {
  id: null,
  name: "",
  price: "",
  category: "",
  tags: "",
  image: "",
  badge: "",
  desc: "",
  stock: "100",
};

const inputStyle = {
  background: "#13110C",
  border: "1px solid #2E2A1E",
  borderRadius: "10px",
  color: "#F0EAD6",
  padding: "12px 16px",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "14px",
  outline: "none",
  width: "100%",
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

const iconButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  border: `1px solid ${BORDER}`,
  background: SURFACE,
  color: CREAM,
  borderRadius: "8px",
  padding: "7px 10px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
};

const labelStyle = {
  fontSize: "11px",
  color: MUTED,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  fontWeight: 700,
  marginBottom: "8px",
};

const requiredFields = ["name", "price", "category", "image", "desc"];

const fmtINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch products");
      }
      setForbidden(false);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setApiError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setFormMode("add");
    setForm(EMPTY_FORM);
    setErrors({});
    setApiError("");
  }

  function handleEdit(product) {
    setFormMode("edit");
    setForm({
      id: product.id,
      name: product.name || "",
      price: String(product.price ?? ""),
      category: product.category || "",
      tags: (product.tags || []).join(", "),
      image: product.image || "",
      badge: product.badge || "",
      desc: product.desc || "",
      stock: String(product.stock ?? 100),
    });
    setErrors({});
    setApiError("");
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!String(form.price).trim()) nextErrors.price = "Price is required";
    if (!form.category.trim()) nextErrors.category = "Category is required";
    if (!form.image.trim()) nextErrors.image = "Image URL is required";
    if (!form.desc.trim()) nextErrors.desc = "Description is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        image: form.image.trim(),
        badge: form.badge.trim() || null,
        desc: form.desc.trim(),
        stock: Number(form.stock || 100),
      };

      if (formMode === "edit") {
        payload.id = form.id;
      }

      const res = await fetch("/api/admin/products", {
        method: formMode === "add" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save product");
      }

      await loadProducts();
      resetForm();
    } catch (err) {
      setApiError(err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleVisibility(product) {
    try {
      setActionLoadingId(product.id);
      setApiError("");
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, isActive: !product.isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update product status");
      }
      await loadProducts();
    } catch (err) {
      setApiError(err.message || "Failed to update product status");
    } finally {
      setActionLoadingId(null);
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
          Loading products...
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
        }}
      >
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
                Products
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
                color: DARK,
                background: GOLD,
                borderColor: GOLD,
              }}
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              style={{
                ...tabBaseStyle,
                color: MUTED,
                background: "transparent",
              }}
            >
              Orders
            </Link>
          </div>
        </div>

        <div
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            marginBottom: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 22px",
              borderBottom: `1px solid ${BORDER}`,
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
              Product Catalog
            </h2>
            <span style={{ fontSize: "12px", color: MUTED, fontWeight: 700 }}>{products.length} items</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "920px" }}>
              <thead>
                <tr>
                  {["Image", "Name", "Category", "Price", "Stock", "Status", "Actions"].map((label) => (
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
                {products.map((product) => (
                  <tr
                    key={product.id}
                    style={{
                      opacity: product.isActive ? 1 : 0.5,
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    <td style={{ padding: "14px 18px" }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: `1px solid ${BORDER}`,
                          background: SURFACE,
                        }}
                      />
                    </td>
                    <td style={{ padding: "14px 18px", fontWeight: 700, color: CREAM, fontSize: "14px" }}>
                      {product.name}
                    </td>
                    <td style={{ padding: "14px 18px", color: MUTED, fontSize: "13px" }}>{product.category}</td>
                    <td
                      style={{
                        padding: "14px 18px",
                        color: GOLD,
                        fontWeight: 800,
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "20px",
                      }}
                    >
                      {fmtINR(product.price)}
                    </td>
                    <td style={{ padding: "14px 18px", color: CREAM, fontWeight: 700 }}>{product.stock}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <span
                        style={{
                          ...badgeStyle,
                          background: product.isActive ? "rgba(82, 183, 136, 0.16)" : "rgba(226, 75, 74, 0.16)",
                          color: product.isActive ? "#52b788" : "#e24b4a",
                        }}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button type="button" onClick={() => handleEdit(product)} style={iconButtonStyle}>
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleVisibility(product)}
                          disabled={actionLoadingId === product.id}
                          style={{
                            ...iconButtonStyle,
                            opacity: actionLoadingId === product.id ? 0.65 : 1,
                            cursor: actionLoadingId === product.id ? "not-allowed" : "pointer",
                          }}
                        >
                          👁 {product.isActive ? "Hide" : "Show"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "22px", textAlign: "center", color: MUTED }}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            style={{
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
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
              {formMode === "add" ? "Add New Product" : "Edit Product"}
            </h2>
            {formMode === "edit" && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  border: `1px solid ${BORDER}`,
                  background: "transparent",
                  color: MUTED,
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel Edit
              </button>
            )}
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

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(220px, 1fr))", gap: "14px" }}>
              <div>
                <div style={labelStyle}>Name</div>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  style={inputStyle}
                  placeholder="Product name"
                />
                {errors.name && <div style={{ color: "#e24b4a", fontSize: "12px", marginTop: "6px" }}>{errors.name}</div>}
              </div>
              <div>
                <div style={labelStyle}>Price</div>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  style={inputStyle}
                  placeholder="Price in INR"
                />
                {errors.price && (
                  <div style={{ color: "#e24b4a", fontSize: "12px", marginTop: "6px" }}>{errors.price}</div>
                )}
              </div>
              <div>
                <div style={labelStyle}>Category</div>
                <input
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  style={inputStyle}
                  placeholder="Category"
                />
                {errors.category && (
                  <div style={{ color: "#e24b4a", fontSize: "12px", marginTop: "6px" }}>{errors.category}</div>
                )}
              </div>
              <div>
                <div style={labelStyle}>Tags (comma-separated)</div>
                <input
                  value={form.tags}
                  onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                  style={inputStyle}
                  placeholder="luxury, gift, premium"
                />
              </div>
              <div>
                <div style={labelStyle}>Image URL</div>
                <input
                  value={form.image}
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                  style={inputStyle}
                  placeholder="https://..."
                />
                {errors.image && (
                  <div style={{ color: "#e24b4a", fontSize: "12px", marginTop: "6px" }}>{errors.image}</div>
                )}
              </div>
              <div>
                <div style={labelStyle}>Badge (optional)</div>
                <input
                  value={form.badge}
                  onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                  style={inputStyle}
                  placeholder="Limited Edition"
                />
              </div>
              <div>
                <div style={labelStyle}>Stock</div>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                  style={inputStyle}
                  placeholder="100"
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={labelStyle}>Description</div>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))}
                  style={{ ...inputStyle, minHeight: "110px", resize: "vertical" }}
                  placeholder="Describe the product..."
                />
                {errors.desc && <div style={{ color: "#e24b4a", fontSize: "12px", marginTop: "6px" }}>{errors.desc}</div>}
              </div>
            </div>

            <div style={{ marginTop: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: "#C9A84C",
                  color: "#0A0804",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  fontWeight: 800,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.75 : 1,
                }}
              >
                {submitting ? "Saving..." : formMode === "add" ? "Add Product" : "Update Product"}
              </button>
              <span style={{ fontSize: "12px", color: MUTED }}>
                Required fields: {requiredFields.join(", ")}
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
