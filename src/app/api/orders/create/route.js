import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { orderDetails } = await req.json();

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
        paymentMethod: orderDetails.paymentMethod || "COD",
        status: "pending",
        items: {
          create: orderDetails.items.map(i => ({
            productId: i.id,
            qty: i.qty,
            price: i.price
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
