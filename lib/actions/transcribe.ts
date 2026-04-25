"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function transcribeAudio(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const file = formData.get("audio") as File;
    if (!file) {
        throw new Error("No file uploaded");
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        // Call Gemini
        const result = await model.generateContent([
            {
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: file.type || "audio/mpeg",
                },
            },
            "Transcribe this audio file accurately. Return only the transcript text.",
        ]);

        const transcriptText = result.response.text();

        // Store in DB
        const transcript = await prisma.transcript.create({
            data: {
                content: transcriptText,
                fileName: file.name,
                userId: session.user.id,
            },
        });

        return { success: true, transcript };
    } catch (error) {
        console.error("Transcription error:", error);
        return { success: false, error: "Failed to transcribe audio" };
    }
}

export async function getTranscripts() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return [];
    }

    return prisma.transcript.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
