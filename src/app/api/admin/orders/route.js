import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LIFECYCLE = ["pending", "packed", "shipped", "delivered"];

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

// GET — list all orders with user and items
export async function GET() {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { product: { select: { name: true, image: true } } } },
    },
  });
  return NextResponse.json(orders);
}

// PATCH — advance order status in fixed lifecycle, add trackingId / deliveryNote
// Restrictions:
//   - Cannot modify a "delivered" order
//   - Cannot go backward in the lifecycle
//   - Cannot touch total, paymentMethod, paymentId, address, userId
export async function PATCH(req) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { id, status, trackingId, deliveryNote } = body;

  if (!id) return NextResponse.json({ error: "Order id is required" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id }, select: { status: true } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Block edits on completed orders
  if (order.status === "delivered") {
    return NextResponse.json({ error: "Completed orders cannot be modified" }, { status: 403 });
  }

  const data = {};

  if (status !== undefined) {
    if (!LIFECYCLE.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${LIFECYCLE.join(", ")}` },
        { status: 400 },
      );
    }
    const currentIdx = LIFECYCLE.indexOf(order.status);
    const newIdx = LIFECYCLE.indexOf(status);
    if (newIdx < currentIdx) {
      return NextResponse.json({ error: "Cannot move order backward in the lifecycle" }, { status: 400 });
    }
    data.status = status;
  }

  if (trackingId !== undefined) data.trackingId = trackingId;
  if (deliveryNote !== undefined) data.deliveryNote = deliveryNote;

  const updated = await prisma.order.update({ where: { id }, data });
  return NextResponse.json(updated);
}
