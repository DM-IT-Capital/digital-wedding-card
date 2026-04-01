import { prisma } from "@/lib/prisma";
import ShareButtons from "@/components/ShareButtons";
import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export default async function PublicCardPage({ params }: Props) {
  const card = await prisma.weddingCard.findUnique({
    where: { slug: params.slug }
  });

  if (!card || !card.isPublished) {
    notFound();
  }

  const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/card/${card.slug}`;

  return (
    <main className="container" style={{ padding: "40px 0 70px" }}>
      <div className="card" style={{ marginBottom: 20 }}>
        <span className="pill">{card.eventType}</span>
        <h1 className="page-title" style={{ marginTop: 12 }}>
          {card.brideFullName} & {card.groomFullName}
        </h1>
        <p className="muted">
          {card.eventDate} {card.eventDay ? `• ${card.eventDay}` : ""} • {card.eventTime}
        </p>

        {card.invitationText ? (
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
            {card.invitationText}
          </p>
        ) : null}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 className="section-title">Majlis</h3>
          <p><strong>Venue:</strong> {card.venueName}</p>
          <p style={{ whiteSpace: "pre-wrap" }}>
            <strong>Address:</strong> {card.venueAddress}
          </p>
          {card.navigationButton && card.mapLink ? (
            <a className="btn" href={card.mapLink} target="_blank" rel="noreferrer">
              Open Map
            </a>
          ) : null}
        </div>

        <div className="card">
          <h3 className="section-title">RSVP</h3>
          {card.rsvpName ? <p><strong>Name:</strong> {card.rsvpName}</p> : null}
          {card.rsvpPhone ? (
            <p>
              <strong>WhatsApp:</strong>{" "}
              <a href={`https://wa.me/${card.rsvpPhone.replace(/\D/g, "")}`}>
                {card.rsvpPhone}
              </a>
            </p>
          ) : null}
          {card.rsvpDeadline ? (
            <p><strong>Deadline:</strong> {card.rsvpDeadline}</p>
          ) : null}
        </div>
      </div>

      {(card.photoUrls.length > 0 || card.videoUrl) && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 className="section-title">Gallery / Video</h3>

          {card.photoUrls.length > 0 ? (
            <div className="photo-grid" style={{ marginBottom: 14 }}>
              {card.photoUrls.map((url) => (
                <img key={url} src={url} alt="Wedding" />
              ))}
            </div>
          ) : null}

          {card.videoUrl ? (
            <p>
              <a className="btn" href={card.videoUrl} target="_blank" rel="noreferrer">
                Watch Video
              </a>
            </p>
          ) : null}
        </div>
      )}

      {(card.bankAccountNumber || card.duitNowQrUrl) && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 className="section-title">Gift</h3>
          {card.bankName ? <p><strong>Bank:</strong> {card.bankName}</p> : null}
          {card.bankAccountNumber ? (
            <p><strong>Account:</strong> {card.bankAccountNumber}</p>
          ) : null}
          {card.duitNowQrUrl ? (
            <div style={{ marginTop: 10 }}>
              <img
                src={card.duitNowQrUrl}
                alt="DuitNow QR"
                style={{ maxWidth: 220, borderRadius: 12 }}
              />
            </div>
          ) : null}
        </div>
      )}

      {(card.dressCodeColor || card.dressCodeType) && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 className="section-title">Dress Code</h3>
          {card.dressCodeColor ? <p><strong>Color:</strong> {card.dressCodeColor}</p> : null}
          {card.dressCodeType ? <p><strong>Type:</strong> {card.dressCodeType}</p> : null}
        </div>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <h3 className="section-title">Share / Export</h3>
        <ShareButtons
          url={pageUrl}
          videoUrl={card.videoUrl}
          photoUrls={card.photoUrls}
        />
      </div>

      {(card.enquiryName || card.enquiryPhone || card.enquiryEmail || card.enquiryWhatsappLink) && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 className="section-title">Enquiry</h3>
          {card.enquiryName ? <p><strong>Contact:</strong> {card.enquiryName}</p> : null}
          {card.enquiryPhone ? <p><strong>Phone:</strong> {card.enquiryPhone}</p> : null}
          {card.enquiryEmail ? <p><strong>Email:</strong> {card.enquiryEmail}</p> : null}
          {card.enquiryWhatsappLink ? (
            <a
              className="btn"
              href={card.enquiryWhatsappLink}
              target="_blank"
              rel="noreferrer"
            >
              Contact via WhatsApp
            </a>
          ) : null}
        </div>
      )}
    </main>
  );
}
