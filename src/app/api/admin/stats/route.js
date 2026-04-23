import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const LEGACY_STATUS_MAP = {
  placed: "pending",
  confirmed: "packed",
};

function normalizeStatus(status) {
  return LEGACY_STATUS_MAP[status] || status;
}

function buildRevenueSeries(orders) {
  const now = new Date();
  const months = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      m: date.toLocaleString("en-IN", { month: "short" }),
      s: 0,
      o: 0,
    });
  }

  const monthMap = new Map(months.map((month) => [month.key, month]));

  orders.forEach((order) => {
    const createdAt = new Date(order.createdAt);
    const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const bucket = monthMap.get(key);
    if (bucket) {
      bucket.s += order.total;
      bucket.o += 1;
    }
  });

  return months;
}

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

    const [users, orders, recentOrders] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, role: true },
      }),
      prisma.order.findMany({
        select: {
          id: true,
          userId: true,
          status: true,
          total: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
    ]);

    const normalizedOrders = orders.map((order) => ({
      ...order,
      status: normalizeStatus(order.status),
    }));

    const totalRevenue = normalizedOrders.reduce((sum, order) => sum + order.total, 0);
    const activeOrders = normalizedOrders.filter((order) => order.status !== "delivered").length;
    const pendingShipments = normalizedOrders.filter((order) => order.status === "packed").length;

    const customerIds = new Set();
    users.forEach((user) => {
      if (user.role === "USER") {
        customerIds.add(user.id);
      }
    });
    normalizedOrders.forEach((order) => {
      if (order.userId) {
        customerIds.add(order.userId);
      }
    });

    const revenueSeries = buildRevenueSeries(normalizedOrders);

    return NextResponse.json({
      stats: [
        { label: "Total Revenue",     value: `₹${totalRevenue.toLocaleString()}`, trend: `${normalizedOrders.length} orders` },
        { label: "Active Orders",     value: activeOrders.toString(),    trend: "+0%" },
        { label: "Total Customers",   value: customerIds.size.toString(),  trend: `${users.length} accounts` },
        { label: "Pending Shipments", value: pendingShipments.toString(), trend: `${normalizedOrders.filter((order) => order.status === "shipped").length} shipped` },
      ],
      revenueSeries,
      recentOrders: recentOrders.map((o) => ({
        id: o.id.slice(0, 8),
        customer: o.user?.name || o.user?.email || "Guest",
        product: o.items[0]?.product?.name || "Luxury Gift",
        amount: `₹${o.total.toLocaleString()}`,
        status: normalizeStatus(o.status),
      })),
    });
  } catch (err) {
    console.error("Stats fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
