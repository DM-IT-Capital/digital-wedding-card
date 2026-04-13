import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const username = process.env.SEED_ADMIN_USERNAME;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || "Boss";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Missing seed env values" },
      { status: 500 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { username }
  });

  if (existing) {
    return NextResponse.json({ message: "Admin already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      name,
      passwordHash,
      role: "ADMIN"
    }
  });

  return NextResponse.json({
    message: "Admin created",
    username: user.username
  });
}