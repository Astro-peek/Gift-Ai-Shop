import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createOrderWithNotifications, OrderValidationError } from "../../../../controllers/orderController";

export const dynamic = "force-dynamic";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(req) {
  try {
    const { orderDetails } = await req.json();
    const order = await createOrderWithNotifications({
      prisma,
      orderDetails,
      paymentMethod: orderDetails?.paymentMethod || "COD",
      status: "pending",
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("Order creation error:", err);
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create order", details: err.message }, { status: 500 });
  }
}
