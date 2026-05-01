'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface HeaderProps {
  syncing?: boolean
  synced?: boolean
  userEmail?: string
}

export default function Header({ syncing, synced, userEmail }: HeaderProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // メニュー外クリックで閉じる
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    document.cookie = 'voz_access_token=; path=/; max-age=0'
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 h-14"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {/* 左：タイトル */}
      <div className="flex items-center gap-3">
        <span className="font-serif-display text-xl"
              style={{ color: 'var(--accent)' }}>
          VOZ
        </span>
        <span className="text-xs hidden sm:inline"
              style={{ color: 'var(--muted)' }}>
          管理者ページ
        </span>
      </div>

      {/* 中央：同期バッジ */}
      <div className="flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full inline-block transition-all"
          style={{
            background: syncing
              ? 'var(--accent)'
              : synced
              ? 'var(--green)'
              : 'var(--muted)',
            animation: syncing ? 'pulse 1s infinite' : 'none',
          }}
        />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {syncing ? '同期中...' : synced ? '同期済み' : 'オフライン'}
        </span>
      </div>

      {/* 右：ユーザーアイコン */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all"
          style={{
            background: menuOpen ? 'var(--accent)' : 'var(--surface2)',
            color: menuOpen ? '#fff' : 'var(--text)',
            border: '1px solid var(--border)',
          }}
        >
          {userEmail ? userEmail[0].toUpperCase() : '?'}
        </button>

        {/* ドロップダウン */}
        {menuOpen && (
          <div
            className="absolute right-0 top-11 w-52 rounded-xl py-2 z-50"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {userEmail && (
              <div className="px-4 py-2 border-b"
                   style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  ログイン中
                </p>
                <p className="text-sm font-medium truncate"
                   style={{ color: 'var(--text)' }}>
                  {userEmail}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:opacity-70"
              style={{ color: 'var(--red)' }}
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
