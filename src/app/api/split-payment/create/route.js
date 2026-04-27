import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import { sendSplitPaymentEmail } from "../../../../lib/email";

export const dynamic = "force-dynamic";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      initiatorId, 
      initiatorName, 
      initiatorEmail, 
      cartItems, 
      address, 
      participants, 
      totalAmount 
    } = body;

    // Validate input
    if (!initiatorId || !initiatorEmail || !cartItems || !address || !participants || participants.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate that participant amounts sum up to total
    const participantTotal = participants.reduce((sum, p) => sum + (p.amount || 0), 0);
    if (participantTotal !== totalAmount) {
      return NextResponse.json(
        { error: `Participant amounts (${participantTotal}) must equal total amount (${totalAmount})` },
        { status: 400 }
      );
    }

    // Create split payment record
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 hour expiry

    const splitPayment = await prisma.splitPayment.create({
      data: {
        initiatorId,
        initiatorName,
        initiatorEmail,
        totalAmount,
        cartItems,
        address,
        status: "pending",
        expiresAt,
        participants: {
          create: participants.map(p => ({
            email: p.email,
            amount: p.amount,
            status: "pending",
          })),
        },
      },
      include: {
        participants: true,
      },
    });

    // Create Razorpay Payment Links for each participant
    const updatedParticipants = [];
    
    for (const participant of splitPayment.participants) {
      try {
        const linkPayload = {
          amount: participant.amount * 100, // Convert to paise
          currency: "INR",
          accept_partial: false,
          description: `Split payment contribution for gift order by ${initiatorName}`,
          customer: {
            email: participant.email,
          },
          notify: {
            email: false, // We'll send our own custom email
            sms: false,
          },
          reminder_enable: true,
          notes: {
            splitPaymentId: splitPayment.id,
            participantId: participant.id,
            initiatorName,
            initiatorEmail,
          },
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/split-payment/success`,
          callback_method: "get",
        };

        const paymentLink = await razorpay.paymentLink.create(linkPayload);

        // Update participant with Razorpay link details
        const updated = await prisma.splitPaymentParticipant.update({
          where: { id: participant.id },
          data: {
            razorpayLinkId: paymentLink.id,
            paymentLink: paymentLink.short_url,
          },
        });

        updatedParticipants.push(updated);

        // Send email to participant
        await sendSplitPaymentEmail({
          to: participant.email,
          initiatorName,
          amount: participant.amount,
          paymentLink: paymentLink.short_url,
          orderSummary: cartItems,
        });

      } catch (linkError) {
        console.error(`Failed to create payment link for ${participant.email}:`, linkError);
        // Continue with other participants, this one will have null link
        updatedParticipants.push(participant);
      }
    }

    return NextResponse.json({
      success: true,
      splitPaymentId: splitPayment.id,
      participants: updatedParticipants,
      expiresAt: expiresAt.toISOString(),
      message: "Split payment created and invitations sent",
    });

  } catch (error) {
    console.error("Split payment creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create split payment", details: error.message },
      { status: 500 }
    );
  }
}
