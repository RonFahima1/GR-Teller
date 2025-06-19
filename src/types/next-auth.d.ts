import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    status: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      status: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    status: string;
  }
} 