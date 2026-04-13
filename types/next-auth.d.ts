import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: "ADMIN" | "CREATOR";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    role: "ADMIN" | "CREATOR";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: "ADMIN" | "CREATOR";
  }
}
