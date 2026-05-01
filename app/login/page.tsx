'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
      return
    }

    // セッションをcookieに保存（middleware用）
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      document.cookie = `voz_access_token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}`
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">

        {/* ロゴ */}
        <div className="text-center mb-8">
          <h1 className="font-serif-display text-5xl mb-1"
              style={{ color: 'var(--accent)' }}>
            VOZ
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            管理者ページ
          </p>
        </div>

        {/* カード */}
        <div className="rounded-2xl p-8"
             style={{
               background: 'var(--surface)',
               border: '1px solid var(--border)',
               boxShadow: 'var(--shadow-lg)',
             }}>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* エラー */}
            {error && (
              <p className="text-center text-sm" style={{ color: 'var(--red)' }}>
                {error}
              </p>
            )}

            {/* メール */}
            <div className="space-y-1">
              <label className="text-xs font-medium"
                     style={{ color: 'var(--muted)' }}>
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* パスワード */}
            <div className="space-y-1">
              <label className="text-xs font-medium"
                     style={{ color: 'var(--muted)' }}>
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all mt-2"
              style={{
                background: loading ? 'var(--muted)' : 'var(--accent)',
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
