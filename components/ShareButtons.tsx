"use client";

import { useState } from "react";

type Props = {
  url: string;
  videoUrl?: string | null;
  photoUrls?: string[];
};

export default function ShareButtons({ url, videoUrl, photoUrls = [] }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const whatsappText = encodeURIComponent(
    `View our digital wedding card here: ${url}${
      videoUrl ? `\nVideo: ${videoUrl}` : ""
    }${photoUrls.length ? `\nPhotos: ${photoUrls.join(", ")}` : ""}`
  );

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <button type="button" className="btn-secondary" onClick={copyLink}>
        {copied ? "Copied" : "Copy Link"}
      </button>

      <a
        className="btn"
        style={{ width: "auto" }}
        href={`https://wa.me/?text=${whatsappText}`}
        target="_blank"
        rel="noreferrer"
      >
        Share WhatsApp
      </a>

      {videoUrl ? (
        <a
          className="btn-secondary"
          style={{ width: "auto" }}
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open Video
        </a>
      ) : null}
    </div>
  );
}
