import { NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

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
      // 1. Upsert User
      const user = await prisma.user.upsert({
        where: { email: orderDetails.userEmail },
        update: { name: orderDetails.userName },
        create: { 
          id: orderDetails.userId, // Use Supabase ID
          email: orderDetails.userEmail, 
          name: orderDetails.userName 
        },
      });

      // 2. Create Order
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          total: orderDetails.total,
          address: orderDetails.address,
          paymentMethod: "RAZORPAY",
          status: "confirmed",
          items: {
            create: orderDetails.items.map(i => ({
              productId: i.id,
              qty: i.qty,
              price: i.price
            }))
          }
        }
      });

      return NextResponse.json({ verified: true, orderId: order.id });
    } else {
      return NextResponse.json({ verified: false }, { status: 400 });
    }
  } catch (err) {
    console.error("Verification failed:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}

