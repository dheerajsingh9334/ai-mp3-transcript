"use client";

import { useState, useRef } from "react";
import { transcribeAudio } from "@/lib/actions/transcribe";
import { Upload, FileAudio, Loader2, CheckCircle2, XCircle } from "lucide-react";

export function AudioUpload({ onUploadComplete }: { onUploadComplete: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit for demo
                setStatus({ type: "error", message: "File too large. Max 10MB." });
                return;
            }
            setFile(selectedFile);
            setStatus(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append("audio", file);

        try {
            const result = await transcribeAudio(formData);
            if (result.success) {
                setStatus({ type: "success", message: "Transcription complete!" });
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                onUploadComplete();
            } else {
                setStatus({ type: "error", message: result.error || "Failed to transcribe." });
            }
        } catch (error) {
            setStatus({ type: "error", message: "An unexpected error occurred." });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="glass" style={{ padding: "24px", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "16px", fontWeight: "600" }}>Upload Audio</h2>
            
            <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                    border: "2px dashed var(--card-border)", 
                    borderRadius: "12px", 
                    padding: "40px", 
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: "rgba(255, 255, 255, 0.02)"
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="audio/*" 
                    style={{ display: "none" }} 
                />
                
                {file ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                        <FileAudio size={48} color="var(--primary)" />
                        <div>
                            <p style={{ fontWeight: "500" }}>{file.name}</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                        <Upload size={48} color="var(--text-muted)" />
                        <p style={{ color: "var(--text-muted)" }}>Click or drag audio file here</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Supports MP3, WAV, M4A (Max 1 min)</p>
                    </div>
                )}
            </div>

            {status && (
                <div style={{ 
                    marginTop: "16px", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    color: status.type === "success" ? "var(--success)" : "var(--error)",
                    fontSize: "0.9rem"
                }}>
                    {status.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    {status.message}
                </div>
            )}

            <button 
                className="btn-primary" 
                onClick={handleUpload} 
                disabled={!file || uploading} 
                style={{ width: "100%", marginTop: "20px" }}
            >
                {uploading ? <Loader2 className="animate-spin" size={20} /> : "Transcribe Now"}
            </button>

            <style jsx>{`
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
