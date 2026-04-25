import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    secret: process.env.AUTH_SECRET,
    baseURL: process.env.AUTH_URL,
    trustedOrigins: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    emailAndPassword: {
        enabled: true,
    },
});
