import NextAuth from "next-auth";
import { authOptions } from "@/auth";

// API rotaları için NextAuth işleyicisini kullan
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 