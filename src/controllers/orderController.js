import { sendSMS } from "../utils/sendSMS";
import { sendEmail } from "../utils/sendEmail";
import { generateSMS } from "../utils/messageGenerator";
import { generateOrderEmail } from "../utils/emailTemplate";

const TEMPLATE_BY_TYPE = {
  PLACED: "ORDER_CONFIRMED",
  SHIPPED: "ORDER_SHIPPED",
  DELIVERED: "ORDER_DELIVERED",
  CANCELLED: "ORDER_CANCELLED",
};

const SUBJECT_BY_TYPE = {
  PLACED: "Order Confirmed 🎉",
  SHIPPED: "Your Order is on the way 🚚",
  DELIVERED: "Order Delivered 🎉",
  CANCELLED: "Order Cancelled",
};

const TYPE_BY_STATUS = {
  pending: "PLACED",
  shipped: "SHIPPED",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
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

function getCustomerName(order) {
  const fromName = String(order?.user?.name || "").trim();
  if (fromName) return fromName;

  const email = String(order?.user?.email || "").trim();
  if (!email) return "Customer";
  return email.split("@")[0] || "Customer";
}

function getStatusType(status) {
  return TYPE_BY_STATUS[String(status || "").toLowerCase()] || null;
}

async function saveInternalNotification(prisma, { orderId, userId, type, message }) {
  if (!userId || !type) return;

  const template = TEMPLATE_BY_TYPE[type];
  if (!template) return;

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

async function dispatchOrderNotifications({ prisma, order, type }) {
  if (!type || !SUBJECT_BY_TYPE[type]) {
    return;
  }

  const name = getCustomerName(order);
  const smsMessage = generateSMS(type, name, order.id, order.total);
  const emailHtml = generateOrderEmail({
    name,
    orderId: order.id,
    total: order.total,
    status: type,
  });
  const emailSubject = SUBJECT_BY_TYPE[type];

  try {
    await sendSMS(order.user?.phone, smsMessage);
  } catch (error) {
    console.error("SMS notification failed:", error);
  }

  try {
    await sendEmail(order.user?.email, emailSubject, emailHtml);
  } catch (error) {
    console.error("Email notification failed:", error);
  }

  await saveInternalNotification(prisma, {
    orderId: order.id,
    userId: order.userId,
    type,
    message: smsMessage,
  });
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
  await dispatchOrderNotifications({
    prisma,
    order,
    type: "PLACED",
  });
}

export async function notifyOrderStatusUpdated({ prisma, order, status }) {
  const type = getStatusType(status || order.status);
  await dispatchOrderNotifications({
    prisma,
    order,
    type,
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

