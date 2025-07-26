import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { GradientBackground } from "@/components/ui/gradient-background";

export const metadata: Metadata = {
  title: "SecureSight Dashboard",
  description: "Modern surveillance dashboard for security monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthSessionProvider>
            <GradientBackground variant="subtle">
              {children}
            </GradientBackground>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
