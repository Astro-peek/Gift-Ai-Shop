import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

// GET — list all products including inactive ones
export async function GET() {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

// POST — add a new product
export async function POST(req) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, price, category, tags, image, badge, desc, stock } = body;

  if (!name || !price || !category || !image || !desc) {
    return NextResponse.json(
      { error: "Missing required fields: name, price, category, image, desc" },
      { status: 400 },
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      price: parseInt(price),
      category,
      tags: tags || [],
      image,
      badge: badge || null,
      desc,
      stock: parseInt(stock) || 100,
      isActive: true,
    },
  });
  return NextResponse.json(product, { status: 201 });
}

// PATCH — update price / stock / image / desc / badge / isActive (NO hard delete, NO rating/reviews edit)
export async function PATCH(req) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { id, name, price, category, tags, image, badge, desc, stock, isActive } = body;

  if (!id) return NextResponse.json({ error: "Product id is required" }, { status: 400 });

  const data = {};
  if (name !== undefined) data.name = name;
  if (price !== undefined) data.price = parseInt(price);
  if (category !== undefined) data.category = category;
  if (tags !== undefined) data.tags = tags;
  if (image !== undefined) data.image = image;
  if (badge !== undefined) data.badge = badge;
  if (desc !== undefined) data.desc = desc;
  if (stock !== undefined) data.stock = parseInt(stock);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  // rating and reviews are intentionally excluded — admin cannot touch them

  const product = await prisma.product.update({ where: { id: parseInt(id) }, data });
  return NextResponse.json(product);
}
