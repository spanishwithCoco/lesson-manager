'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/',              icon: '🏠', label: 'Home' },
  { href: '/flashcards',   icon: '🃏', label: 'Flash' },
  { href: '/lessons',      icon: '🎬', label: 'Lesson' },
  { href: '/dict',         icon: '📚', label: 'Dict' },
  { href: '/announcements',icon: '📢', label: 'Announ' },
]

export default function FooterNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {NAV_ITEMS.map(item => {
        const isActive = item.href === '/'
          ? pathname === '/'
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all"
            style={{
              color: isActive ? 'var(--accent)' : 'var(--muted)',
              textDecoration: 'none',
            }}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium leading-none">
              {item.label}
            </span>
            {isActive && (
              <span
                className="absolute bottom-0 w-8 h-0.5 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
