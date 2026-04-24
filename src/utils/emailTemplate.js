function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatStatus(status) {
  const normalized = String(status || "").trim().toUpperCase();
  if (!normalized) return "PLACED";
  return normalized;
}

function formatTotal(total) {
  const value = Number(total);
  if (!Number.isFinite(value)) return "₹0";
  return `₹${value.toLocaleString("en-IN")}`;
}

export function generateOrderEmail({ name, orderId, total, status }) {
  const safeName = escapeHtml(name || "Customer");
  const safeOrderId = escapeHtml(orderId || "N/A");
  const safeTotal = escapeHtml(formatTotal(total));
  const safeStatus = escapeHtml(formatStatus(status));

  return `
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f4f5f8;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f5f8;padding:20px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e8e8ef;">
            <tr>
              <td style="background:#0f172a;padding:22px 24px;">
                <div style="font-size:24px;font-weight:700;color:#f8fafc;letter-spacing:0.5px;">GiftAI</div>
                <div style="font-size:13px;color:#cbd5e1;margin-top:6px;">Order Notification</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 12px 0;font-size:16px;color:#111827;">Hi ${safeName},</p>
                <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#374151;">
                  We wanted to share an update on your GiftAI order.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;">
                      <span style="display:inline-block;font-size:12px;color:#6b7280;width:90px;">Order ID</span>
                      <span style="font-size:13px;color:#111827;font-weight:600;">${safeOrderId}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;">
                      <span style="display:inline-block;font-size:12px;color:#6b7280;width:90px;">Total</span>
                      <span style="font-size:13px;color:#111827;font-weight:600;">${safeTotal}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px;">
                      <span style="display:inline-block;font-size:12px;color:#6b7280;width:90px;">Status</span>
                      <span style="font-size:13px;color:#111827;font-weight:700;">${safeStatus}</span>
                    </td>
                  </tr>
                </table>

                <p style="margin:20px 0 0 0;font-size:12px;line-height:1.6;color:#6b7280;">
                  Thank you for shopping with GiftAI. If you have questions, reply to this email and our support team will help.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();
}

