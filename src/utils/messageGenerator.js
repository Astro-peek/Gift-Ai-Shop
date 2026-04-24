const SMS_TEMPLATES = {
  PLACED: (name, orderId, total) =>
    `Hi ${name} 👋 Your order #${orderId} of ₹${total} has been placed successfully.`,
  SHIPPED: (name, orderId) => `Good news ${name}! 🚚 Your order #${orderId} has been shipped.`,
  DELIVERED: (name, orderId) => `Hey ${name} 🎉 Your order #${orderId} has been delivered. Enjoy!`,
  CANCELLED: (name, orderId) => `Hi ${name}, your order #${orderId} has been cancelled.`,
};

function normalizeName(name) {
  const safe = String(name || "").trim();
  return safe || "Customer";
}

function normalizeOrderId(orderId) {
  return String(orderId || "").trim() || "N/A";
}

function normalizeTotal(total) {
  const value = Number(total);
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-IN");
}

export function generateSMS(type, name, orderId, total) {
  const normalizedType = String(type || "").toUpperCase();
  const template = SMS_TEMPLATES[normalizedType];

  if (!template) {
    throw new Error(`Unsupported SMS type: ${type}`);
  }

  return template(
    normalizeName(name),
    normalizeOrderId(orderId),
    normalizeTotal(total),
  );
}

