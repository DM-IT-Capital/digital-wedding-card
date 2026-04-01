"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { safeArrayFromTextarea } from "@/lib/utils";

type CardData = {
  id: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  groomFullName: string;
  brideFullName: string;
  groomParents: string | null;
  brideParents: string | null;
  eventDate: string;
  eventDay: string | null;
  eventTime: string;
  eventType: string;
  venueName: string;
  venueAddress: string;
  mapLink: string | null;
  rsvpName: string | null;
  rsvpPhone: string | null;
  rsvpDeadline: string | null;
  themeColor: string | null;
  style: string | null;
  tone: string | null;
  designReference: string | null;
  hasPhotos: boolean;
  photoUrls: string[];
  videoUrl: string | null;
  invitationText: string | null;
  bankAccountNumber: string | null;
  bankName: string | null;
  duitNowQrUrl: string | null;
  dressCodeColor: string | null;
  dressCodeType: string | null;
  backgroundMusicUrl: string | null;
  animationVideoInvite: boolean;
  countdownEnabled: boolean;
  qrRsvpUrl: string | null;
  navigationButton: boolean;
  enquiryName: string | null;
  enquiryPhone: string | null;
  enquiryEmail: string | null;
  enquiryWhatsappLink: string | null;
  isPublished: boolean;
};

export default function EditCardForm({ card }: { card: CardData }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);

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

    const res = await fetch(`/api/cards/${card.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Failed to update card");
      return;
    }

    alert("Card updated successfully");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      action={async (formData) => {
        await handleSubmit(formData);
      }}
      className="grid"
    >
      <div className="card">
        <h3 className="section-title">Customer</h3>
        <div className="grid grid-3">
          <input name="customerName" defaultValue={card.customerName || ""} placeholder="Customer name" required />
          <input name="customerEmail" defaultValue={card.customerEmail || ""} placeholder="Customer email" />
          <input name="customerPhone" defaultValue={card.customerPhone || ""} placeholder="Customer phone" />
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Maklumat Pengantin</h3>
        <div className="grid grid-2">
          <input name="groomFullName" defaultValue={card.groomFullName || ""} placeholder="Nama penuh pengantin lelaki" required />
          <input name="brideFullName" defaultValue={card.brideFullName || ""} placeholder="Nama penuh pengantin perempuan" required />
          <input name="groomParents" defaultValue={card.groomParents || ""} placeholder="Nama ibu bapa lelaki" />
          <input name="brideParents" defaultValue={card.brideParents || ""} placeholder="Nama ibu bapa perempuan" />
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Maklumat Majlis</h3>
        <div className="grid grid-3">
          <input name="eventDate" defaultValue={card.eventDate || ""} placeholder="Tarikh" required />
          <input name="eventDay" defaultValue={card.eventDay || ""} placeholder="Hari" />
          <input name="eventTime" defaultValue={card.eventTime || ""} placeholder="Masa" required />
          <select name="eventType" defaultValue={card.eventType || "Resepsi"}>
            <option>Akad Nikah</option>
            <option>Resepsi</option>
            <option>Bertandang</option>
          </select>
          <input name="venueName" defaultValue={card.venueName || ""} placeholder="Nama tempat" required />
          <input name="mapLink" defaultValue={card.mapLink || ""} placeholder="Google Maps / Waze link" />
        </div>
        <div style={{ marginTop: 16 }}>
          <textarea name="venueAddress" defaultValue={card.venueAddress || ""} placeholder="Alamat penuh" required />
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">RSVP / Contact Person</h3>
        <div className="grid grid-3">
          <input name="rsvpName" defaultValue={card.rsvpName || ""} placeholder="Nama RSVP" />
          <input name="rsvpPhone" defaultValue={card.rsvpPhone || ""} placeholder="No telefon / WhatsApp" />
          <input name="rsvpDeadline" defaultValue={card.rsvpDeadline || ""} placeholder="Tarikh akhir RSVP" />
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Design & Tema</h3>
        <div className="grid grid-2">
          <input name="themeColor" defaultValue={card.themeColor || ""} placeholder="Tema warna" />
          <input name="style" defaultValue={card.style || ""} placeholder="Style: Elegant / Minimal / Floral / Modern" />
          <input name="tone" defaultValue={card.tone || ""} placeholder="Formal atau santai" />
          <input name="designReference" defaultValue={card.designReference || ""} placeholder="Contoh design / reference link" />
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Gambar / Video / Ayat Jemputan</h3>
        <div className="grid">
          <label>
            <input type="checkbox" name="hasPhotos" defaultChecked={card.hasPhotos} style={{ width: "auto", marginRight: 8 }} />
            Has photos
          </label>
          <textarea name="photoUrls" defaultValue={card.photoUrls.join("\n")} placeholder="One image URL per line" />
          <input name="videoUrl" defaultValue={card.videoUrl || ""} placeholder="Video URL" />
          <textarea name="invitationText" defaultValue={card.invitationText || ""} placeholder="Ayat jemputan" />
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Hadiah / DuitNow</h3>
        <div className="grid grid-3">
          <input name="bankAccountNumber" defaultValue={card.bankAccountNumber || ""} placeholder="No akaun bank" />
          <input name="bankName" defaultValue={card.bankName || ""} placeholder="Nama bank" />
          <input name="duitNowQrUrl" defaultValue={card.duitNowQrUrl || ""} placeholder="QR DuitNow image URL" />
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Dress Code / Extra</h3>
        <div className="grid grid-2">
          <input name="dressCodeColor" defaultValue={card.dressCodeColor || ""} placeholder="Dress code color" />
          <input name="dressCodeType" defaultValue={card.dressCodeType || ""} placeholder="Jenis pakaian" />
          <input name="backgroundMusicUrl" defaultValue={card.backgroundMusicUrl || ""} placeholder="Background music URL" />
          <input name="qrRsvpUrl" defaultValue={card.qrRsvpUrl || ""} placeholder="QR RSVP / Google Form URL" />
        </div>

        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <label>
            <input type="checkbox" name="animationVideoInvite" defaultChecked={card.animationVideoInvite} style={{ width: "auto", marginRight: 8 }} />
            Animation / video invite
          </label>
          <label>
            <input type="checkbox" name="countdownEnabled" defaultChecked={card.countdownEnabled} style={{ width: "auto", marginRight: 8 }} />
            Countdown
          </label>
          <label>
            <input type="checkbox" name="navigationButton" defaultChecked={card.navigationButton} style={{ width: "auto", marginRight: 8 }} />
            Button map / navigation
          </label>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Boss / Creator Enquiry Contact</h3>
        <div className="grid grid-2">
          <input name="enquiryName" defaultValue={card.enquiryName || ""} placeholder="Contact name" />
          <input name="enquiryPhone" defaultValue={card.enquiryPhone || ""} placeholder="Contact phone" />
          <input name="enquiryEmail" defaultValue={card.enquiryEmail || ""} placeholder="Contact email" />
          <input name="enquiryWhatsappLink" defaultValue={card.enquiryWhatsappLink || ""} placeholder="WhatsApp enquiry link" />
        </div>

        <div style={{ marginTop: 16 }}>
          <label>
            <input type="checkbox" name="isPublished" defaultChecked={card.isPublished} style={{ width: "auto", marginRight: 8 }} />
            Publish this card
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Updating..." : "Update Wedding Card"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          style={{ maxWidth: 160 }}
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
