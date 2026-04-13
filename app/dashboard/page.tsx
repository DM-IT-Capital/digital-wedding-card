"use client";

import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import { safeArrayFromTextarea } from "@/lib/utils";

type CreateResult = {
  message: string;
  card: {
    slug: string;
  };
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  const baseUrl = useMemo(() => {
    if (typeof window !== "undefined") return window.location.origin;
    return process.env.NEXT_PUBLIC_APP_URL || "";
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setResultUrl("");

    const payload = {
      customerName: String(formData.get("customerName") || ""),
      customerEmail: String(formData.get("customerEmail") || ""),
      customerPhone: String(formData.get("customerPhone") || ""),

      groomFullName: String(formData.get("groomFullName") || ""),
      brideFullName: String(formData.get("brideFullName") || ""),
      groomParents: String(formData.get("groomParents") || ""),
      brideParents: String(formData.get("brideParents") || ""),

      eventDate: String(formData.get("eventDate") || ""),
      eventDay: String(formData.get("eventDay") || ""),
      eventTime: String(formData.get("eventTime") || ""),
      eventType: String(formData.get("eventType") || ""),
      venueName: String(formData.get("venueName") || ""),
      venueAddress: String(formData.get("venueAddress") || ""),
      mapLink: String(formData.get("mapLink") || ""),

      rsvpName: String(formData.get("rsvpName") || ""),
      rsvpPhone: String(formData.get("rsvpPhone") || ""),
      rsvpDeadline: String(formData.get("rsvpDeadline") || ""),

      themeColor: String(formData.get("themeColor") || ""),
      style: String(formData.get("style") || ""),
      tone: String(formData.get("tone") || ""),
      designReference: String(formData.get("designReference") || ""),

      hasPhotos: formData.get("hasPhotos") === "on",
      photoUrls: safeArrayFromTextarea(String(formData.get("photoUrls") || "")),
      videoUrl: String(formData.get("videoUrl") || ""),
      invitationText: String(formData.get("invitationText") || ""),

      bankAccountNumber: String(formData.get("bankAccountNumber") || ""),
      bankName: String(formData.get("bankName") || ""),
      duitNowQrUrl: String(formData.get("duitNowQrUrl") || ""),

      dressCodeColor: String(formData.get("dressCodeColor") || ""),
      dressCodeType: String(formData.get("dressCodeType") || ""),

      backgroundMusicUrl: String(formData.get("backgroundMusicUrl") || ""),
      animationVideoInvite: formData.get("animationVideoInvite") === "on",
      countdownEnabled: formData.get("countdownEnabled") === "on",
      qrRsvpUrl: String(formData.get("qrRsvpUrl") || ""),
      navigationButton: formData.get("navigationButton") === "on",

      enquiryName: String(formData.get("enquiryName") || ""),
      enquiryPhone: String(formData.get("enquiryPhone") || ""),
      enquiryEmail: String(formData.get("enquiryEmail") || ""),
      enquiryWhatsappLink: String(formData.get("enquiryWhatsappLink") || ""),

      isPublished: formData.get("isPublished") === "on"
    };

    const res = await fetch("/api/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = (await res.json()) as CreateResult | { error: string };

    setLoading(false);

    if (!res.ok) {
      alert((data as any).error || "Failed to create card");
      return;
    }

    const finalUrl = `${baseUrl}/card/${(data as CreateResult).card.slug}`;
    setResultUrl(finalUrl);
    alert("Card created successfully");
  }

  if (status === "loading") {
    return <main className="container" style={{ padding: "40px 0" }}>Loading...</main>;
  }

  return (
    <main className="container" style={{ padding: "30px 0 60px" }}>
      <div className="topbar" style={{ border: 0, background: "transparent", marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          <div>
            <h1 className="page-title" style={{ marginBottom: 6 }}>
              Dashboard
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              Logged in as {session?.user?.name} ({(session?.user as any)?.username})
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      {resultUrl ? (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 className="section-title">Export / Share</h3>
          <p style={{ wordBreak: "break-all" }}>{resultUrl}</p>
          <a className="btn" href={resultUrl} target="_blank" rel="noreferrer">
            Open Public Card
          </a>
        </div>
      ) : null}

      <form
        action={async (formData) => {
          await handleSubmit(formData);
        }}
        className="grid"
      >
        <div className="card">
          <h3 className="section-title">Customer</h3>
          <div className="grid grid-3">
            <input name="customerName" placeholder="Customer name" required />
            <input name="customerEmail" placeholder="Customer email" />
            <input name="customerPhone" placeholder="Customer phone" />
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Maklumat Pengantin</h3>
          <div className="grid grid-2">
            <input name="groomFullName" placeholder="Nama penuh pengantin lelaki" required />
            <input name="brideFullName" placeholder="Nama penuh pengantin perempuan" required />
            <input name="groomParents" placeholder="Nama ibu bapa lelaki" />
            <input name="brideParents" placeholder="Nama ibu bapa perempuan" />
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Maklumat Majlis</h3>
          <div className="grid grid-3">
            <input name="eventDate" placeholder="Tarikh" required />
            <input name="eventDay" placeholder="Hari" />
            <input name="eventTime" placeholder="Masa" required />
            <select name="eventType" defaultValue="Resepsi">
              <option>Akad Nikah</option>
              <option>Resepsi</option>
              <option>Bertandang</option>
            </select>
            <input name="venueName" placeholder="Nama tempat" required />
            <input name="mapLink" placeholder="Google Maps / Waze link" />
          </div>
          <div style={{ marginTop: 16 }}>
            <textarea name="venueAddress" placeholder="Alamat penuh" required />
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">RSVP / Contact Person</h3>
          <div className="grid grid-3">
            <input name="rsvpName" placeholder="Nama RSVP" />
            <input name="rsvpPhone" placeholder="No telefon / WhatsApp" />
            <input name="rsvpDeadline" placeholder="Tarikh akhir RSVP" />
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Design & Tema</h3>
          <div className="grid grid-2">
            <input name="themeColor" placeholder="Tema warna" />
            <input name="style" placeholder="Style: Elegant / Minimal / Floral / Modern" />
            <input name="tone" placeholder="Formal atau santai" />
            <input name="designReference" placeholder="Contoh design / reference link" />
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Gambar / Video / Ayat Jemputan</h3>
          <div className="grid">
            <label>
              <input type="checkbox" name="hasPhotos" style={{ width: "auto", marginRight: 8 }} />
              Has photos
            </label>
            <textarea
              name="photoUrls"
              placeholder="One image URL per line"
            />
            <input name="videoUrl" placeholder="Video URL" />
            <textarea
              name="invitationText"
              placeholder="Ayat jemputan"
            />
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Hadiah / DuitNow</h3>
          <div className="grid grid-3">
            <input name="bankAccountNumber" placeholder="No akaun bank" />
            <input name="bankName" placeholder="Nama bank" />
            <input name="duitNowQrUrl" placeholder="QR DuitNow image URL" />
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Dress Code / Extra</h3>
          <div className="grid grid-2">
            <input name="dressCodeColor" placeholder="Dress code color" />
            <input name="dressCodeType" placeholder="Jenis pakaian" />
            <input name="backgroundMusicUrl" placeholder="Background music URL" />
            <input name="qrRsvpUrl" placeholder="QR RSVP / Google Form URL" />
          </div>

          <div className="grid grid-3" style={{ marginTop: 16 }}>
            <label>
              <input type="checkbox" name="animationVideoInvite" style={{ width: "auto", marginRight: 8 }} />
              Animation / video invite
            </label>
            <label>
              <input type="checkbox" name="countdownEnabled" style={{ width: "auto", marginRight: 8 }} />
              Countdown
            </label>
            <label>
              <input
                type="checkbox"
                name="navigationButton"
                defaultChecked
                style={{ width: "auto", marginRight: 8 }}
              />
              Button map / navigation
            </label>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Boss / Creator Enquiry Contact</h3>
          <div className="grid grid-2">
            <input name="enquiryName" placeholder="Contact name" />
            <input name="enquiryPhone" placeholder="Contact phone" />
            <input name="enquiryEmail" placeholder="Contact email" />
            <input name="enquiryWhatsappLink" placeholder="WhatsApp enquiry link" />
          </div>

          <div style={{ marginTop: 16 }}>
            <label>
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked
                style={{ width: "auto", marginRight: 8 }}
              />
              Publish this card
            </label>
          </div>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Saving..." : "Create Wedding Card"}
        </button>
      </form>
    </main>
  );
}
