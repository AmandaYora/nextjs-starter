import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { AppToaster } from "@/shared/ui/toaster";
import { createThemeCssVariables } from "@/shared/config/theme";
import { env } from "@/shared/config/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Starter Dashboard",
  description: "Production-ready Next.js starter with auth and Prisma.",
};

const themeCssVariables = createThemeCssVariables(env.THEME_VARIANT);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCssVariables }} />
      </head>
      <body data-sidebar-collapsed="false" className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
