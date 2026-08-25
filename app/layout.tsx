import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkyMap — Explore Any Home From Anywhere",
  description: "Explore, measure, and customize properties in immersive 3D with SkyMap's AI-powered property intelligence platform.",
  generator: "Next.js",
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0f" },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark bg-background" suppressHydrationWarning>
      <body className={`${geist.className} font-sans antialiased`}>
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}
