"use client";

import { logout } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <button 
            onClick={() => logout()}
            className="glass"
            style={{ 
                padding: "8px 16px", 
                borderRadius: "8px", 
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.05)",
                fontSize: "0.9rem"
            }}
        >
            <LogOut size={16} /> Logout
        </button>
    );
}
