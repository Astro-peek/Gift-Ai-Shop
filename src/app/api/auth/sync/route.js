import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { id: session.user.id },
      update: {
        email: session.user.email,
        name:
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          undefined,
      },
      create: {
        id: session.user.id,
        email: session.user.email,
        name:
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          null,
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error("Auth sync failed:", err);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
