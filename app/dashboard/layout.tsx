"use client";

import { useState, useRef, useEffect } from "react";

type Theme = "light" | "dark" | "oceanic";

const themes = {
  light: {
    sidebar: "#1e293b",
    sidebarText: "#94a3b8",
    sidebarActive: "#ffffff",
    sidebarActiveBg: "rgba(255,255,255,0.1)",
    sidebarHover: "rgba(255,255,255,0.06)",
    sidebarBorder: "rgba(255,255,255,0.08)",
    sidebarLogo: "#ffffff",
    logoDot: "#6366f1",
    topbar: "#ffffff",
    topbarBorder: "rgba(0,0,0,0.08)",
    topbarText: "#0f172a",
    topbarMuted: "#64748b",
    bg: "#f8f9fa",
    btnBg: "#f1f5f9",
    btnText: "#64748b",
    btnBorder: "rgba(0,0,0,0.08)",
    dropdownBg: "#ffffff",
    dropdownBorder: "rgba(0,0,0,0.08)",
    dropdownHover: "#f1f5f9",
    dropdownText: "#0f172a",
    dropdownMuted: "#64748b",
    activeCheck: "#6366f1",
    avatarBg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    footer: "#f1f5f9",
    footerText: "#94a3b8",
    footerBorder: "rgba(0,0,0,0.06)",
  },
  dark: {
    sidebar: "#020617",
    sidebarText: "#64748b",
    sidebarActive: "#ffffff",
    sidebarActiveBg: "rgba(255,255,255,0.1)",
    sidebarHover: "rgba(255,255,255,0.05)",
    sidebarBorder: "rgba(255,255,255,0.06)",
    sidebarLogo: "#ffffff",
    logoDot: "#818cf8",
    topbar: "#0f172a",
    topbarBorder: "rgba(255,255,255,0.07)",
    topbarText: "#f1f5f9",
    topbarMuted: "#94a3b8",
    bg: "#0f172a",
    btnBg: "#1e293b",
    btnText: "#94a3b8",
    btnBorder: "rgba(255,255,255,0.07)",
    dropdownBg: "#1e293b",
    dropdownBorder: "rgba(255,255,255,0.07)",
    dropdownHover: "#0f172a",
    dropdownText: "#f1f5f9",
    dropdownMuted: "#94a3b8",
    activeCheck: "#818cf8",
    avatarBg: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    footer: "#020617",
    footerText: "#475569",
    footerBorder: "rgba(255,255,255,0.05)",
  },
  oceanic: {
    sidebar: "#060e1c",
    sidebarText: "#38bdf8",
    sidebarActive: "#ffffff",
    sidebarActiveBg: "rgba(14,165,233,0.15)",
    sidebarHover: "rgba(14,165,233,0.08)",
    sidebarBorder: "rgba(56,189,248,0.1)",
    sidebarLogo: "#ffffff",
    logoDot: "#0ea5e9",
    topbar: "#0a1628",
    topbarBorder: "rgba(56,189,248,0.15)",
    topbarText: "#e0f2fe",
    topbarMuted: "#7dd3fc",
    bg: "#0a1628",
    btnBg: "#0f2044",
    btnText: "#7dd3fc",
    btnBorder: "rgba(56,189,248,0.15)",
    dropdownBg: "#0f2044",
    dropdownBorder: "rgba(56,189,248,0.15)",
    dropdownHover: "#071020",
    dropdownText: "#e0f2fe",
    dropdownMuted: "#7dd3fc",
    activeCheck: "#0ea5e9",
    avatarBg: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
    footer: "#060e1c",
    footerText: "#38bdf8",
    footerBorder: "rgba(56,189,248,0.1)",
  },
};

const themeIcons: Record<Theme, string> = {
  light: "☀️",
  dark: "🌙",
  oceanic: "🌊",
};

const navItems = [
  { icon: "⊞", label: "Dashboard", href: "/dashboard/customer" },
  { icon: "≡", label: "My Complaints", href: "/dashboard/customer/complaints" },
  { icon: "＋", label: "New Complaint", href: "/dashboard/customer/complaints/new" },
  { icon: "◎", label: "Profile", href: "/dashboard/customer/profile" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [active, setActive] = useState("Dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = themes[theme];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeSelect = (th: Theme) => {
    setTheme(th);
    setDropdownOpen(false);
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      background: t.bg,
      transition: "background 0.4s",
    }}>

      {/* Sidebar */}
      <div style={{
        width: 220,
        background: t.sidebar,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        padding: "20px 12px",
        transition: "background 0.4s",
      }}>

        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px 20px",
          borderBottom: `0.5px solid ${t.sidebarBorder}`,
          marginBottom: 8,
        }}>
          <div style={{
            width: 8, height: 8,
            borderRadius: "50%",
            background: t.logoDot,
            flexShrink: 0,
            transition: "background 0.4s",
          }} />
          <span style={{ fontSize: 15, fontWeight: 500, color: t.sidebarLogo }}>
            ComplaintTrack
          </span>
        </div>

        {/* Nav Items */}
        {navItems.map((item) => (
          <div
            key={item.label}
            onClick={() => setActive(item.label)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              color: active === item.label ? t.sidebarActive : t.sidebarText,
              background: active === item.label ? t.sidebarActiveBg : "transparent",
              fontSize: 13,
              cursor: "pointer",
              marginBottom: 2,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (active !== item.label)
                (e.currentTarget as HTMLDivElement).style.background = t.sidebarHover;
            }}
            onMouseLeave={(e) => {
              if (active !== item.label)
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </div>
        ))}

        {/* Bottom - User Info */}
        <div style={{
          marginTop: "auto",
          borderTop: `0.5px solid ${t.sidebarBorder}`,
          paddingTop: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: "50%",
              background: t.avatarBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 500,
              color: "#fff",
              flexShrink: 0,
            }}>
              MK
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "#fff", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Mayank Kumar
              </div>
              <div style={{ fontSize: 11, color: t.sidebarText }}>Customer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <div style={{
          background: t.topbar,
          borderBottom: `0.5px solid ${t.topbarBorder}`,
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          transition: "background 0.4s",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: t.topbarText, transition: "color 0.4s" }}>
              {active}
            </div>
            <div style={{ fontSize: 12, color: t.topbarMuted, marginTop: 1, transition: "color 0.4s" }}>
              Welcome back, Mayank
            </div>
          </div>

          {/* Theme Dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>

            {/* Trigger Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                borderRadius: 8,
                border: `0.5px solid ${t.btnBorder}`,
                background: t.btnBg,
                color: t.btnText,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 14 }}>{themeIcons[theme]}</span>
              <span style={{ textTransform: "capitalize" }}>{theme}</span>
              <span style={{
                fontSize: 9,
                transition: "transform 0.3s",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                display: "inline-block",
                marginLeft: 2,
              }}>▼</span>
            </button>

            {/* Dropdown Menu */}
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              background: t.dropdownBg,
              border: `0.5px solid ${t.dropdownBorder}`,
              borderRadius: 10,
              overflow: "hidden",
              width: 160,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              opacity: dropdownOpen ? 1 : 0,
              transform: dropdownOpen ? "translateY(0px)" : "translateY(-8px)",
              pointerEvents: dropdownOpen ? "all" : "none",
              transition: "opacity 0.25s ease, transform 0.25s ease",
              zIndex: 100,
            }}>

              {/* Dropdown Label */}
              <div style={{
                padding: "8px 12px 6px",
                fontSize: 10,
                color: t.dropdownMuted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                borderBottom: `0.5px solid ${t.dropdownBorder}`,
              }}>
                Choose Theme
              </div>

              {(["light", "dark", "oceanic"] as Theme[]).map((th) => (
                <div
                  key={th}
                  onClick={() => handleThemeSelect(th)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: theme === th ? t.dropdownHover : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = t.dropdownHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      theme === th ? t.dropdownHover : "transparent";
                  }}
                >
                  <span style={{ fontSize: 16 }}>{themeIcons[th]}</span>
                  <span style={{
                    fontSize: 13,
                    color: t.dropdownText,
                    textTransform: "capitalize",
                    flex: 1,
                  }}>
                    {th}
                  </span>
                  {theme === th && (
                    <span style={{ fontSize: 12, color: t.activeCheck }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1 }}>
            {children}
          </div>

          {/* Footer */}
          <div style={{
            background: t.footer,
            borderTop: `0.5px solid ${t.footerBorder}`,
            padding: "14px 24px",
            textAlign: "center",
            fontSize: 12,
            color: t.footerText,
            flexShrink: 0,
            transition: "all 0.4s",
          }}>
            © {new Date().getFullYear()} PDV Pvt Limited. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}