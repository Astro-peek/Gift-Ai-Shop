import { NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { createOrderWithNotifications, OrderValidationError } from "../../../../controllers/orderController";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isMatch = expectedSignature === razorpay_signature;

    if (isMatch) {
      const order = await createOrderWithNotifications({
        prisma,
        orderDetails,
        paymentMethod: "RAZORPAY",
        paymentId: razorpay_payment_id,
        status: "pending",
      });

      return NextResponse.json({ verified: true, orderId: order.id });
    } else {
      return NextResponse.json({ verified: false }, { status: 400 });
    }
  } catch (err) {
    console.error("Verification failed:", err);
    if (err instanceof OrderValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
