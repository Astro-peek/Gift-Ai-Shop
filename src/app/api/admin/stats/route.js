import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userRecord = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!userRecord || (userRecord.role !== "ADMIN" && userRecord.role !== "OWNER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const totalRevenue = await prisma.order.aggregate({ _sum: { total: true } });
    const activeOrders = await prisma.order.count({ where: { status: { notIn: ["delivered"] } } });
    const totalCustomers = await prisma.user.count({ where: { role: "USER" } });
    const pendingShipments = await prisma.order.count({ where: { status: "packed" } });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    });

    return NextResponse.json({
      stats: [
        { label: "Total Revenue",     value: `₹${(totalRevenue._sum.total || 0).toLocaleString()}`, trend: "+0%" },
        { label: "Active Orders",     value: activeOrders.toString(),    trend: "+0%" },
        { label: "Total Customers",   value: totalCustomers.toString(),  trend: "+0%" },
        { label: "Pending Shipments", value: pendingShipments.toString(), trend: "+0%" },
      ],
      recentOrders: recentOrders.map((o) => ({
        id: o.id.slice(0, 8),
        customer: o.user?.name || o.user?.email || "Guest",
        product: o.items[0]?.product?.name || "Luxury Gift",
        amount: `₹${o.total.toLocaleString()}`,
        status: o.status,
      })),
    });
  } catch (err) {
    console.error("Stats fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
