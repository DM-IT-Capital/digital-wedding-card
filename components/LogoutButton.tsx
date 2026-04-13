"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      className="btn-secondary"
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{ maxWidth: 160 }}
    >
      Logout
    </button>
  );
}
