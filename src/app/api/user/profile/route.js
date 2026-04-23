import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return NextResponse.json(user);
}

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, phone, address } = await req.json();

  const user = await prisma.user.upsert({
    where: { id: session.user.id },
    update: { name, phone, address },
    create: { id: session.user.id, email: session.user.email, name, phone, address },
  });

  return NextResponse.json(user);
}
