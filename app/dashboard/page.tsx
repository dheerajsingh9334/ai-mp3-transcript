"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { AudioUpload } from "@/components/AudioUpload";
import { TranscriptList } from "@/components/TranscriptList";
import { LogoutButton } from "@/components/LogoutButton";
import { Mic, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [checking, setChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: session } = await authClient.getSession();
            if (!session) {
                router.push("/login");
            } else {
                setChecking(false);
            }
        };
        checkSession();
    }, [router]);

    const handleUploadComplete = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (checking) {
        return (
            <main style={{ justifyContent: "center", alignItems: "center" }}>
                <Loader2 className="animate-spin" size={40} color="var(--primary)" />
                <style jsx>{`
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </main>
        );
    }

    return (
        <main style={{ padding: "40px 20px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }} className="animate-fade-in">
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ background: "var(--primary)", padding: "10px", borderRadius: "12px", boxShadow: "0 0 20px var(--primary-glow)" }}>
                            <Mic size={24} color="white" />
                        </div>
                        <h1 className="heading-gradient" style={{ fontSize: "1.75rem" }}>Admin Dashboard</h1>
                    </div>
                    <LogoutButton />
                </header>

                <AudioUpload onUploadComplete={handleUploadComplete} />
                
                <section>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Recent Transcripts</h2>
                        <span style={{ 
                            background: "rgba(255, 255, 255, 0.05)", 
                            padding: "2px 8px", 
                            borderRadius: "12px", 
                            fontSize: "0.75rem", 
                            color: "var(--text-muted)",
                            border: "1px solid var(--card-border)"
                        }}>
                            Admin Only
                        </span>
                    </div>
                    <TranscriptList refreshKey={refreshKey} />
                </section>
            </div>
        </main>
    );
}
