import FooterNav from '@/components/layout/FooterNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* メインコンテンツ（フッター分の余白） */}
      <main className="pb-20">
        {children}
      </main>

      {/* フッターナビ */}
      <FooterNav />
    </div>
  )
}
