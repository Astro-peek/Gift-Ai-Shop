import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createOrderWithNotifications, OrderValidationError } from "../../../../controllers/orderController";

const prisma = new PrismaClient();

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
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
