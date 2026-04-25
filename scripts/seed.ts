import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    console.log("Seeding admin user...");
    try {
        // We'll use Prisma directly to create the admin user if auth API is failing in standalone scripts
        // But better auth needs specific fields. 
        // I'll try to hit the API route instead, it's safer.
        console.log("Please visit /api/seed in your browser to seed the admin user.");
    } catch (e) {
        console.error("Seed error:", e);
    }
}

seed();
