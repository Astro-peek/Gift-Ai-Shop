import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Predefined templates — admins cannot write free-form messages
const TEMPLATES = {
  ORDER_CONFIRMED: (order) =>
    `Your order #${order.id.slice(0, 8).toUpperCase()} has been confirmed and is being prepared.`,
  ORDER_PACKED: (order) =>
    `Good news! Your order #${order.id.slice(0, 8).toUpperCase()} has been packed and is ready for pickup by the courier.`,
  ORDER_SHIPPED: (order, trackingId) =>
    `Your order #${order.id.slice(0, 8).toUpperCase()} is on its way!${trackingId ? ` Tracking ID: ${trackingId}.` : ""}`,
  ORDER_DELIVERED: (order) =>
    `Your order #${order.id.slice(0, 8).toUpperCase()} has been delivered. We hope you love it! 🎁`,
  STOCK_ALERT: (_, __, productName) => `"${productName}" is back in stock. Don't miss it!`,
};

async function requireAdmin() {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!user || (user.role !== "ADMIN" && user.role !== "OWNER")) return null;
  return { userId: session.user.id, role: user.role };
}

// GET — list all notifications (admin view)
export async function GET() {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, order: { select: { id: true } } },
    take: 100,
  });
  return NextResponse.json(notifications);
}

// POST — trigger a predefined template notification
// Body: { template, orderId?, productName? }
// orderId is required for all ORDER_* templates
// productName is required for STOCK_ALERT
export async function POST(req) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { template, orderId, productName } = body;

  if (!template || !TEMPLATES[template]) {
    return NextResponse.json(
      {
        error: `Invalid template. Allowed values: ${Object.keys(TEMPLATES).join(", ")}`,
      },
      { status: 400 },
    );
  }

  // For order-based templates, resolve the order and its customer
  if (template !== "STOCK_ALERT") {
    if (!orderId) return NextResponse.json({ error: "orderId is required for order templates" }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true, trackingId: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (!order.userId) return NextResponse.json({ error: "Order has no associated user" }, { status: 400 });

    const message = TEMPLATES[template](order, order.trackingId);

    const notification = await prisma.notification.create({
      data: { userId: order.userId, orderId, template, message },
    });
    return NextResponse.json(notification, { status: 201 });
  }

  // STOCK_ALERT — send to all users
  if (!productName) return NextResponse.json({ error: "productName is required for STOCK_ALERT" }, { status: 400 });

  const users = await prisma.user.findMany({ where: { role: "USER" }, select: { id: true } });
  const message = TEMPLATES.STOCK_ALERT(null, null, productName);

  await prisma.notification.createMany({
    data: users.map((u) => ({ userId: u.id, template, message })),
  });

  return NextResponse.json({ sent: users.length }, { status: 201 });
}
