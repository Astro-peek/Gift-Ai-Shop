import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Manual notifications are only allowed for stock alerts.
const TEMPLATES = {
  STOCK_ALERT: (_, __, productName) => `"${productName}" is back in stock. Don't miss it!`,
};

async function requireAdmin() {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!user || (user.role !== "ADMIN" && user.role !== "OWNER")) return null;
  return { userId: session.user.id, role: user.role };
}

// GET - list all notifications (admin view)
export async function GET() {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, order: { select: { id: true } } },
    take: 100,
  });
  return NextResponse.json(notifications);
}

// POST - trigger stock alert notifications only
// Body: { template: "STOCK_ALERT", productName }
export async function POST(req) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { template, productName } = body;

  if (!template || !TEMPLATES[template]) {
    return NextResponse.json(
      {
        error: `Invalid template. Allowed values: ${Object.keys(TEMPLATES).join(", ")}`,
      },
      { status: 400 },
    );
  }

  if (!productName) {
    return NextResponse.json({ error: "productName is required for STOCK_ALERT" }, { status: 400 });
  }

  const users = await prisma.user.findMany({ where: { role: "USER" }, select: { id: true } });
  const message = TEMPLATES.STOCK_ALERT(null, null, productName);

  await prisma.notification.createMany({
    data: users.map((u) => ({ userId: u.id, template, message })),
  });

  return NextResponse.json({ sent: users.length }, { status: 201 });
}
