import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Complaint Management System",
    template: "%s | Complaint Management System",
  },
  description: "Complaint triage and tracking dashboard for review teams",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root { --font-jetbrains-mono: 'JetBrains Mono', monospace; }
        `}</style>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <TooltipProvider delay={300}>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#26262c",
                  border: "1px solid #404048",
                  color: "#dcdcde",
                },
              }}
            />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
