import { sendSMS } from "../utils/sendSMS";
import { sendEmail } from "../utils/sendEmail";

const STATUS_TEMPLATE_MAP = {
  pending: "ORDER_CONFIRMED",
  packed: "ORDER_PACKED",
  shipped: "ORDER_SHIPPED",
  delivered: "ORDER_DELIVERED",
};

export class OrderValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "OrderValidationError";
  }
}

function extractPhone(orderDetails = {}) {
  if (orderDetails.phone) return String(orderDetails.phone).trim();
  if (!orderDetails.address) return "";

  const match = String(orderDetails.address).match(/PH:\s*([^)]+)/i);
  return match ? match[1].trim() : "";
}

function toTitleCase(value) {
  return String(value || "")
    .replace(/[_-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatItemsForEmail(order) {
  if (!Array.isArray(order?.items) || order.items.length === 0) {
    return "- No items available";
  }

  return order.items
    .map((item) => {
      const name = item.product?.name || item.name || `Product #${item.productId || "N/A"}`;
      const qty = Number(item.qty || 1);
      const price = Number(item.price || 0);
      return `- ${name} x${qty} - INR ${price.toLocaleString("en-IN")}`;
    })
    .join("\n");
}

function orderConfirmationEmail(order) {
  return [
    "Your order has been placed successfully.",
    "",
    `Order ID: ${order.id}`,
    "Items:",
    formatItemsForEmail(order),
    `Total price: INR ${Number(order.total || 0).toLocaleString("en-IN")}`,
  ].join("\n");
}

function orderStatusEmail(order, status) {
  return [
    "Your order status has been updated.",
    "",
    `Order ID: ${order.id}`,
    `Updated Status: ${toTitleCase(status)}`,
  ].join("\n");
}

async function saveInternalNotification(prisma, { orderId, userId, status, message }) {
  if (!userId) return;

  const template = STATUS_TEMPLATE_MAP[String(status || "").toLowerCase()] || "ORDER_CONFIRMED";

  try {
    await prisma.notification.create({
      data: {
        userId,
        orderId,
        template,
        message,
      },
    });
  } catch (error) {
    console.error("Internal notification log failed:", error);
  }
}

function normalizeOrderInput(orderDetails = {}) {
  if (!orderDetails || typeof orderDetails !== "object") {
    throw new OrderValidationError("orderDetails payload is required");
  }

  const resolvedEmail = orderDetails.userEmail || orderDetails.email;
  if (!resolvedEmail) {
    throw new OrderValidationError("userEmail (or email) is required");
  }

  if (!orderDetails.address) {
    throw new OrderValidationError("address is required");
  }

  if (!Array.isArray(orderDetails.items) || orderDetails.items.length === 0) {
    throw new OrderValidationError("items must be a non-empty array");
  }

  const total = Number(orderDetails.total);
  if (!Number.isFinite(total) || total < 0) {
    throw new OrderValidationError("total must be a valid number");
  }

  const items = orderDetails.items.map((item) => {
    const productId = Number(item.id ?? item.productId);
    const qty = Number(item.qty || 1);
    const price = Number(item.price || 0);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new OrderValidationError("Each item must have a valid numeric product id");
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      throw new OrderValidationError("Each item must have a positive integer quantity");
    }

    if (!Number.isFinite(price) || price < 0) {
      throw new OrderValidationError("Each item must have a valid price");
    }

    return { productId, qty, price };
  });

  return {
    userId: orderDetails.userId,
    userEmail: String(resolvedEmail).trim(),
    userName: orderDetails.userName || null,
    phone: extractPhone(orderDetails),
    total: Math.round(total),
    address: String(orderDetails.address).trim(),
    items,
  };
}

export async function notifyOrderCreated({ prisma, order }) {
  const smsMessage = `Thank you for shopping with us. Your order ${order.id} has been placed.`;

  await Promise.allSettled([
    sendSMS({
      to: order.user?.phone,
      message: smsMessage,
    }),
    sendEmail({
      to: order.user?.email,
      subject: "Order Confirmation",
      text: orderConfirmationEmail(order),
    }),
  ]);

  await saveInternalNotification(prisma, {
    orderId: order.id,
    userId: order.userId,
    status: order.status,
    message: smsMessage,
  });
}

export async function notifyOrderStatusUpdated({ prisma, order, status }) {
  const nextStatus = String(status || order.status || "").toLowerCase();
  const smsMessage = `Your order ${order.id} is now ${toTitleCase(nextStatus)}`;

  await Promise.allSettled([
    sendSMS({
      to: order.user?.phone,
      message: smsMessage,
    }),
    sendEmail({
      to: order.user?.email,
      subject: "Order Update",
      text: orderStatusEmail(order, nextStatus),
    }),
  ]);

  await saveInternalNotification(prisma, {
    orderId: order.id,
    userId: order.userId,
    status: nextStatus,
    message: smsMessage,
  });
}

export async function createOrderWithNotifications({
  prisma,
  orderDetails,
  paymentMethod = "COD",
  status = "pending",
  paymentId = null,
}) {
  const normalizedInput = normalizeOrderInput(orderDetails);

  const userUpsertPayload = {
    name: normalizedInput.userName,
  };

  if (normalizedInput.phone) {
    userUpsertPayload.phone = normalizedInput.phone;
  }

  const user = await prisma.user.upsert({
    where: { email: normalizedInput.userEmail },
    update: userUpsertPayload,
    create: {
      ...(normalizedInput.userId ? { id: normalizedInput.userId } : {}),
      email: normalizedInput.userEmail,
      ...userUpsertPayload,
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total: normalizedInput.total,
      address: normalizedInput.address,
      paymentMethod,
      status,
      paymentId,
      items: {
        create: normalizedInput.items,
      },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
  });

  await notifyOrderCreated({ prisma, order });

  return order;
}
