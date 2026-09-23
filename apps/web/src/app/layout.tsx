import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PrepForge',
  description: 'Personalized interview preparation for software engineers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
