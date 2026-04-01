import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const schema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().optional().or(z.literal("")),
  customerPhone: z.string().optional().or(z.literal("")),

  groomFullName: z.string().min(1),
  brideFullName: z.string().min(1),
  groomParents: z.string().optional().or(z.literal("")),
  brideParents: z.string().optional().or(z.literal("")),

  eventDate: z.string().min(1),
  eventDay: z.string().optional().or(z.literal("")),
  eventTime: z.string().min(1),
  eventType: z.string().min(1),
  venueName: z.string().min(1),
  venueAddress: z.string().min(1),
  mapLink: z.string().optional().or(z.literal("")),

  rsvpName: z.string().optional().or(z.literal("")),
  rsvpPhone: z.string().optional().or(z.literal("")),
  rsvpDeadline: z.string().optional().or(z.literal("")),

  themeColor: z.string().optional().or(z.literal("")),
  style: z.string().optional().or(z.literal("")),
  tone: z.string().optional().or(z.literal("")),
  designReference: z.string().optional().or(z.literal("")),

  hasPhotos: z.boolean().default(false),
  photoUrls: z.array(z.string()).default([]),
  videoUrl: z.string().optional().or(z.literal("")),
  invitationText: z.string().optional().or(z.literal("")),

  bankAccountNumber: z.string().optional().or(z.literal("")),
  bankName: z.string().optional().or(z.literal("")),
  duitNowQrUrl: z.string().optional().or(z.literal("")),

  dressCodeColor: z.string().optional().or(z.literal("")),
  dressCodeType: z.string().optional().or(z.literal("")),

  backgroundMusicUrl: z.string().optional().or(z.literal("")),
  animationVideoInvite: z.boolean().default(false),
  countdownEnabled: z.boolean().default(false),
  qrRsvpUrl: z.string().optional().or(z.literal("")),
  navigationButton: z.boolean().default(true),

  enquiryName: z.string().optional().or(z.literal("")),
  enquiryPhone: z.string().optional().or(z.literal("")),
  enquiryEmail: z.string().optional().or(z.literal("")),
  enquiryWhatsappLink: z.string().optional().or(z.literal("")),

  isPublished: z.boolean().default(true)
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cards = await prisma.weddingCard.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      brideFullName: true,
      groomFullName: true,
      eventDate: true,
      eventTime: true,
      isPublished: true,
      createdAt: true
    }
  });

  return NextResponse.json({ cards });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const baseSlug = slugify(`${data.brideFullName}-${data.groomFullName}`);
  let slug = baseSlug || `card-${Date.now()}`;

  const exists = await prisma.weddingCard.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now()}`;

  const card = await prisma.weddingCard.create({
    data: {
      ...data,
      customerEmail: data.customerEmail || null,
      customerPhone: data.customerPhone || null,
      groomParents: data.groomParents || null,
      brideParents: data.brideParents || null,
      eventDay: data.eventDay || null,
      mapLink: data.mapLink || null,
      rsvpName: data.rsvpName || null,
      rsvpPhone: data.rsvpPhone || null,
      rsvpDeadline: data.rsvpDeadline || null,
      themeColor: data.themeColor || null,
      style: data.style || null,
      tone: data.tone || null,
      designReference: data.designReference || null,
      videoUrl: data.videoUrl || null,
      invitationText: data.invitationText || null,
      bankAccountNumber: data.bankAccountNumber || null,
      bankName: data.bankName || null,
      duitNowQrUrl: data.duitNowQrUrl || null,
      dressCodeColor: data.dressCodeColor || null,
      dressCodeType: data.dressCodeType || null,
      backgroundMusicUrl: data.backgroundMusicUrl || null,
      qrRsvpUrl: data.qrRsvpUrl || null,
      enquiryName: data.enquiryName || null,
      enquiryPhone: data.enquiryPhone || null,
      enquiryEmail: data.enquiryEmail || null,
      enquiryWhatsappLink: data.enquiryWhatsappLink || null,
      slug,
      createdById: session.user.id
    },
    select: {
      id: true,
      slug: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      brideFullName: true,
      groomFullName: true,
      eventDate: true,
      eventTime: true,
      isPublished: true,
      createdAt: true
    }
  });

  return NextResponse.json({
    message: "Card created successfully",
    card
  });
}
