"use client";

import { useEffect, useState } from "react";
import { getTranscripts } from "@/lib/actions/transcribe";
import { FileText, Calendar, Clock } from "lucide-react";

type Transcript = {
    id: string;
    content: string;
    fileName: string | null;
    createdAt: Date;
};

export function TranscriptList({ refreshKey }: { refreshKey: number }) {
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTranscripts = async () => {
            setLoading(true);
            try {
                const data = await getTranscripts();
                setTranscripts(data);
            } catch (error) {
                console.error("Failed to fetch transcripts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTranscripts();
    }, [refreshKey]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                Loading your transcripts...
            </div>
        );
    }

    if (transcripts.length === 0) {
        return (
            <div className="glass" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <FileText size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
                <p>No transcripts found. Upload an audio file to get started.</p>
            </div>
        );
    }

    return (
        <div style={{ display: "grid", gap: "16px" }}>
            {transcripts.map((t) => (
                <div key={t.id} className="glass animate-fade-in" style={{ padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                        <div>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "4px" }}>{t.fileName || "Unnamed Audio"}</h3>
                            <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Calendar size={14} /> {new Date(t.createdAt).toLocaleDateString()}
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Clock size={14} /> {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ 
                        background: "rgba(255, 255, 255, 0.02)", 
                        padding: "16px", 
                        borderRadius: "8px", 
                        border: "1px solid var(--card-border)",
                        lineHeight: "1.6",
                        color: "#e2e8f0"
                    }}>
                        {t.content}
                    </div>
                </div>
            ))}
        </div>
    );
}
