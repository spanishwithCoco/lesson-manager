import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VOZ 管理',
  description: 'VOZ レッスン管理ページ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
