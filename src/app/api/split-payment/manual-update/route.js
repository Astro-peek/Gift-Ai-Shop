import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const dynamic = "force-dynamic";

// Manual update for testing (simulates webhook)
export async function POST(req) {
  try {
    const body = await req.json();
    const { participantId, status } = body;

    if (!participantId) {
      return NextResponse.json({ error: "Missing participantId" }, { status: 400 });
    }

    // Update participant
    const updated = await prisma.splitPaymentParticipant.update({
      where: { id: participantId },
      data: {
        status: status || "paid",
        paidAt: status === "paid" ? new Date() : null,
      },
    });

    // Get split payment and check status
    const splitPayment = await prisma.splitPayment.findUnique({
      where: { id: updated.splitPaymentId },
      include: { participants: true },
    });

    const allPaid = splitPayment.participants.every(p => p.status === "paid");
    const anyPaid = splitPayment.participants.some(p => p.status === "paid");

    let newStatus = splitPayment.status;
    if (allPaid) newStatus = "paid";
    else if (anyPaid) newStatus = "partial_paid";

    await prisma.splitPayment.update({
      where: { id: updated.splitPaymentId },
      data: { status: newStatus },
    });

    // Create order if all paid
    if (allPaid && !splitPayment.orderId) {
      try {
        const { createOrderWithNotifications } = await import("../../../../controllers/orderController");
        
        const order = await createOrderWithNotifications({
          prisma,
          orderDetails: {
            userId: splitPayment.initiatorId,
            userEmail: splitPayment.initiatorEmail,
            userName: splitPayment.initiatorName,
            total: splitPayment.totalAmount,
            address: splitPayment.address,
            paymentMethod: "SPLIT_PAYMENT",
            items: splitPayment.cartItems,
          },
          paymentMethod: "SPLIT_PAYMENT",
          status: "pending",
        });

        await prisma.splitPayment.update({
          where: { id: updated.splitPaymentId },
          data: { orderId: order.id },
        });

        return NextResponse.json({
          success: true,
          message: "Payment updated and order created",
          orderId: order.id,
        });
      } catch (err) {
        console.error("Order creation failed:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment updated",
      splitPaymentStatus: newStatus,
    });

  } catch (error) {
    console.error("Manual update failed:", error);
    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500 }
    );
  }
}
