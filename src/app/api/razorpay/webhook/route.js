import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendPaymentConfirmationEmail } from "../../../../lib/email";

export const dynamic = "force-dynamic";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Verify Razorpay webhook signature
function verifyWebhookSignature(body, signature, secret) {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    console.log(`Received Razorpay webhook: ${eventType}`);

    // Handle payment link paid event
    if (eventType === "payment_link.paid" || eventType === "payment.captured") {
      const paymentLinkEntity = event.payload?.payment_link?.entity;
      const paymentEntity = event.payload?.payment?.entity;

      if (!paymentLinkEntity) {
        return NextResponse.json({ received: true });
      }

      // Extract our custom notes
      const notes = paymentLinkEntity.notes || {};
      const splitPaymentId = notes.splitPaymentId;
      const participantId = notes.participantId;
      const initiatorEmail = notes.initiatorEmail;
      const initiatorName = notes.initiatorName;

      if (!participantId) {
        console.log("No participant ID in webhook, ignoring");
        return NextResponse.json({ received: true });
      }

      // Update participant status
      const updatedParticipant = await prisma.splitPaymentParticipant.update({
        where: { id: participantId },
        data: {
          status: "paid",
          paidAt: new Date(),
          razorpayPaymentId: paymentEntity?.id || null,
        },
      });

      console.log(`Updated participant ${participantId} to paid status`);

      // Send confirmation email to initiator (non-blocking)
      if (initiatorEmail) {
        try {
          await sendPaymentConfirmationEmail({
            to: initiatorEmail,
            initiatorName,
            amount: updatedParticipant.amount,
            paidBy: updatedParticipant.email,
          });
        } catch (emailErr) {
          console.error("Failed to send confirmation email:", emailErr);
        }
      }

      // Check if all participants have paid
      const splitPayment = await prisma.splitPayment.findUnique({
        where: { id: splitPaymentId },
        include: { participants: true },
      });

      if (splitPayment) {
        const allPaid = splitPayment.participants.every(p => p.status === "paid");
        const anyPaid = splitPayment.participants.some(p => p.status === "paid");

        let newStatus = splitPayment.status;
        if (allPaid) {
          newStatus = "paid";
        } else if (anyPaid) {
          newStatus = "partial_paid";
        }

        await prisma.splitPayment.update({
          where: { id: splitPaymentId },
          data: { status: newStatus },
        });

        // If all paid, create the actual order (idempotent - check again)
        if (allPaid) {
          // Double-check order hasn't been created (race condition protection)
          const freshSplitPayment = await prisma.splitPayment.findUnique({
            where: { id: splitPaymentId },
            select: { orderId: true }
          });
          
          if (!freshSplitPayment?.orderId) {
            try {
              const { createOrderWithNotifications } = await import("../../../../controllers/orderController");
              
              const orderDetails = {
                userId: splitPayment.initiatorId,
                userEmail: splitPayment.initiatorEmail,
                userName: splitPayment.initiatorName,
                total: splitPayment.totalAmount,
                address: splitPayment.address,
                paymentMethod: "SPLIT_PAYMENT",
                items: splitPayment.cartItems,
              };

              const order = await createOrderWithNotifications({
                prisma,
                orderDetails,
                paymentMethod: "SPLIT_PAYMENT",
                status: "pending",
              });

              await prisma.splitPayment.update({
                where: { id: splitPaymentId },
                data: { orderId: order.id },
              });

              console.log(`Created order ${order.id} for split payment ${splitPaymentId}`);
            } catch (orderError) {
              console.error("Failed to create order after split payment completion:", orderError);
              // Don't fail the webhook - order can be created manually later
            }
          }
        }
      }
    }

    // Handle payment link expired event
    if (eventType === "payment_link.expired") {
      const paymentLinkEntity = event.payload?.payment_link?.entity;
      const notes = paymentLinkEntity?.notes || {};
      const participantId = notes.participantId;

      if (participantId) {
        await prisma.splitPaymentParticipant.update({
          where: { id: participantId },
          data: { status: "expired" },
        });

        // Check and update overall status
        const splitPaymentId = notes.splitPaymentId;
        if (splitPaymentId) {
          const splitPayment = await prisma.splitPayment.findUnique({
            where: { id: splitPaymentId },
            include: { participants: true },
          });

          const anyExpired = splitPayment.participants.some(p => p.status === "expired");
          if (anyExpired && splitPayment.status === "pending") {
            await prisma.splitPayment.update({
              where: { id: splitPaymentId },
              data: { status: "expired" },
            });
          }
        }
      }
    }

    // Handle payment failed event
    if (eventType === "payment.failed") {
      const paymentEntity = event.payload?.payment?.entity;
      const notes = paymentEntity?.notes || {};
      const participantId = notes.participantId;

      if (participantId) {
        await prisma.splitPaymentParticipant.update({
          where: { id: participantId },
          data: { status: "failed" },
        });
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}
