import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShopperAgent | AI Fashion Curator',
  description: 'AI-powered personal shopping. Upload a photo, choose your aesthetic, build your cart.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
