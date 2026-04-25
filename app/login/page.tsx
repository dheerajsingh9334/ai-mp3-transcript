"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error: authError } = await authClient.signIn.email({
                email,
                password,
            });

            if (authError) {
                setError(authError.message || "Invalid credentials");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ justifyContent: "center", alignItems: "center" }}>
            <div className="glass animate-fade-in" style={{ padding: "40px", width: "100%", maxWidth: "420px", margin: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h1 className="heading-gradient" style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Audioscribe</h1>
                    <p style={{ color: "var(--text-muted)" }}>Admin Authentication</p>
                </div>

                {error && (
                    <div style={{ background: "rgba(248, 113, 113, 0.1)", border: "1px solid var(--error)", color: "var(--error)", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <User size={16} /> Admin Email
                        </label>
                        <input
                            className="input-field"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Lock size={16} /> Password
                        </label>
                        <input
                            className="input-field"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: "10px" }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Access Dashboard"}
                    </button>
                </form>

                <div style={{ marginTop: "32px", textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    &copy; 2026 Audioscribe AI. All rights reserved.
                </div>
            </div>

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
