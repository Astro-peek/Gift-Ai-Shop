import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json(orders.map(o => ({
      id: o.id.slice(0, 8),
      product: o.items[0]?.product?.name || "Luxury Gift",
      image: o.items[0]?.product?.image || "",
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      amount: o.total,
      addr: o.address,
      steps: ["placed", "confirmed", "shipped", "delivered"],
      cur: ["placed", "confirmed", "shipped", "delivered"].indexOf(o.status),
    })));
  } catch (err) {
    console.error("Orders fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
