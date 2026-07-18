import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    twoFactorEnabled?: boolean;
  }
  interface Session {
    user: {
      role?: string;
      id?: string;
      twoFactorPending?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
    twoFactorPending?: boolean;
  }
}
