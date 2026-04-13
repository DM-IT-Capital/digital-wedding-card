import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const updateSchema = z.object({
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

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const card = await prisma.weddingCard.findUnique({
    where: { id: params.id }
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json({ card });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.weddingCard.findUnique({
    where: { id: params.id }
  });

  if (!existing) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  let slug = existing.slug;
  const newBaseSlug = slugify(
    `${parsed.data.brideFullName}-${parsed.data.groomFullName}`
  );

  if (newBaseSlug && newBaseSlug !== existing.slug) {
    const duplicate = await prisma.weddingCard.findFirst({
      where: {
        slug: newBaseSlug,
        NOT: { id: params.id }
      }
    });

    slug = duplicate ? `${newBaseSlug}-${Date.now()}` : newBaseSlug;
  }

  const updated = await prisma.weddingCard.update({
    where: { id: params.id },
    data: {
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail || null,
      customerPhone: parsed.data.customerPhone || null,

      groomFullName: parsed.data.groomFullName,
      brideFullName: parsed.data.brideFullName,
      groomParents: parsed.data.groomParents || null,
      brideParents: parsed.data.brideParents || null,

      eventDate: parsed.data.eventDate,
      eventDay: parsed.data.eventDay || null,
      eventTime: parsed.data.eventTime,
      eventType: parsed.data.eventType,
      venueName: parsed.data.venueName,
      venueAddress: parsed.data.venueAddress,
      mapLink: parsed.data.mapLink || null,

      rsvpName: parsed.data.rsvpName || null,
      rsvpPhone: parsed.data.rsvpPhone || null,
      rsvpDeadline: parsed.data.rsvpDeadline || null,

      themeColor: parsed.data.themeColor || null,
      style: parsed.data.style || null,
      tone: parsed.data.tone || null,
      designReference: parsed.data.designReference || null,

      hasPhotos: parsed.data.hasPhotos,
      photoUrls: parsed.data.photoUrls,
      videoUrl: parsed.data.videoUrl || null,
      invitationText: parsed.data.invitationText || null,

      bankAccountNumber: parsed.data.bankAccountNumber || null,
      bankName: parsed.data.bankName || null,
      duitNowQrUrl: parsed.data.duitNowQrUrl || null,

      dressCodeColor: parsed.data.dressCodeColor || null,
      dressCodeType: parsed.data.dressCodeType || null,

      backgroundMusicUrl: parsed.data.backgroundMusicUrl || null,
      animationVideoInvite: parsed.data.animationVideoInvite,
      countdownEnabled: parsed.data.countdownEnabled,
      qrRsvpUrl: parsed.data.qrRsvpUrl || null,
      navigationButton: parsed.data.navigationButton,

      enquiryName: parsed.data.enquiryName || null,
      enquiryPhone: parsed.data.enquiryPhone || null,
      enquiryEmail: parsed.data.enquiryEmail || null,
      enquiryWhatsappLink: parsed.data.enquiryWhatsappLink || null,

      isPublished: parsed.data.isPublished,
      slug
    }
  });

  return NextResponse.json({
    message: "Card updated successfully",
    card: updated
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.weddingCard.findUnique({
    where: { id: params.id }
  });

  if (!existing) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  await prisma.weddingCard.delete({
    where: { id: params.id }
  });

  return NextResponse.json({
    message: "Card deleted successfully"
  });
}
