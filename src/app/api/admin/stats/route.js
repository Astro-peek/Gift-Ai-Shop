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
    
    const userRole = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    
    if (!userRole || userRole.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
    });
    
    const activeOrders = await prisma.order.count({
      where: { status: { notIn: ["delivered", "cancelled"] } },
    });

    const totalCustomers = await prisma.user.count({
      where: { role: "USER" },
    });

    const pendingShipments = await prisma.order.count({
      where: { status: "confirmed" },
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    return NextResponse.json({
      stats: [
        { label: "Total Revenue", value: `₹${(totalRevenue._sum.total || 0).toLocaleString()}`, trend: "+0%", icon: "💰" },
        { label: "Active Orders", value: activeOrders.toString(), trend: "+0%", icon: "📦" },
        { label: "Total Customers", value: totalCustomers.toString(), trend: "+0%", icon: "👥" },
        { label: "Pending Shipments", value: pendingShipments.toString(), trend: "+0%", icon: "🚚" },
      ],
      recentOrders: recentOrders.map(o => ({
        id: o.id.slice(0, 8),
        customer: o.user?.name || o.user?.email || "Guest",
        product: "Luxury Gift", // Simplified as we would need to join OrderItem
        amount: `₹${o.total.toLocaleString()}`,
        status: o.status,
      })),
    });
  } catch (err) {
    console.error("Stats fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
