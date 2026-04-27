import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Split payment ID required" },
        { status: 400 }
      );
    }

    const splitPayment = await prisma.splitPayment.findUnique({
      where: { id },
      include: {
        participants: {
          orderBy: { createdAt: "asc" },
        },
        order: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!splitPayment) {
      return NextResponse.json(
        { error: "Split payment not found" },
        { status: 404 }
      );
    }

    // Calculate statistics
    const totalParticipants = splitPayment.participants.length;
    const paidParticipants = splitPayment.participants.filter(p => p.status === "paid").length;
    const paidAmount = splitPayment.participants
      .filter(p => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = splitPayment.totalAmount - paidAmount;

    return NextResponse.json({
      id: splitPayment.id,
      status: splitPayment.status,
      totalAmount: splitPayment.totalAmount,
      paidAmount,
      pendingAmount,
      progress: {
        total: totalParticipants,
        paid: paidParticipants,
        pending: totalParticipants - paidParticipants,
        percentage: totalParticipants > 0 ? Math.round((paidParticipants / totalParticipants) * 100) : 0,
      },
      initiator: {
        name: splitPayment.initiatorName,
        email: splitPayment.initiatorEmail,
      },
      participants: splitPayment.participants.map(p => ({
        id: p.id,
        email: p.email,
        amount: p.amount,
        status: p.status,
        paidAt: p.paidAt,
        paymentLink: p.paymentLink,
      })),
      cartItems: splitPayment.cartItems,
      address: splitPayment.address,
      createdAt: splitPayment.createdAt,
      expiresAt: splitPayment.expiresAt,
      order: splitPayment.order,
    });

  } catch (error) {
    console.error("Failed to fetch split payment status:", error);
    return NextResponse.json(
      { error: "Failed to fetch status", details: error.message },
      { status: 500 }
    );
  }
}
