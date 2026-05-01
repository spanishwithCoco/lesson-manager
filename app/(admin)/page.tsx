'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import type { WipLesson, DashboardStats } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats]     = useState<DashboardStats | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [synced, setSynced]   = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const fetchStats = useCallback(async () => {
    setSyncing(true)
    try {
      const [
        { count: lessonCount },
        { count: dictCount },
        { count: flashcardCount },
        { count: announcementCount },
        { data: wipData },
      ] = await Promise.all([
        supabase.from('lessons').select('*', { count: 'exact', head: true }),
        supabase.from('dict').select('*', { count: 'exact', head: true }),
        supabase.from('flashcards').select('*', { count: 'exact', head: true }),
        supabase.from('announcements').select('*', { count: 'exact', head: true }),
        supabase.from('wip').select('*').order('date', { ascending: false }),
      ])

      const wipLessons: WipLesson[] = (wipData || []).map(r => ({
        id:         r.id,
        name:       r.name,
        step:       r.step || 1,
        audioCount: r.audio_count || 0,
        audioData:  r.audio_data || [],
        date:       r.date || '',
        url:        r.url || '',
      }))

      setStats({
        lessonCount:       lessonCount ?? 0,
        dictCount:         dictCount ?? 0,
        flashcardCount:    flashcardCount ?? 0,
        announcementCount: announcementCount ?? 0,
        wipLessons,
      })
      setSynced(true)
    } catch (e) {
      console.warn('fetch error:', e)
      setSynced(false)
    } finally {
      setSyncing(false)
    }
  }, [])

  useEffect(() => {
    // ユーザー情報取得
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? '')
    })
    fetchStats()
  }, [fetchStats])

  async function deleteWip(id: string, name: string) {
    if (!confirm(`「${name}」の作成を削除しますか？\n（入力したデータは消えます）`)) return
    await supabase.from('wip').delete().eq('id', id)
    fetchStats()
  }

  return (
    <>
      <Header syncing={syncing} synced={synced} userEmail={userEmail} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* ── 作成中のレッスン ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
            作成中のレッスン
          </h2>

          <div className="space-y-2">
            {/* WIPレッスン一覧 */}
            {!stats ? (
              // ローディング
              <div className="rounded-2xl p-4 animate-pulse"
                   style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="h-4 rounded w-1/2"
                     style={{ background: 'var(--surface2)' }} />
              </div>
            ) : stats.wipLessons.length === 0 ? (
              <div className="rounded-2xl p-4 text-sm text-center"
                   style={{
                     background: 'var(--surface)',
                     border: '1px solid var(--border)',
                     color: 'var(--muted)',
                   }}>
                作成中のレッスンはありません
              </div>
            ) : (
              stats.wipLessons.map(wip => (
                <div
                  key={wip.id}
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  {/* ステップバッジ */}
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--accent-soft, rgba(200,98,42,0.1))', color: 'var(--accent)' }}
                  >
                    S{wip.step}
                  </span>

                  {/* 名前・日付 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate"
                       style={{ color: 'var(--text)' }}>
                      {wip.name || '名前未設定'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {formatDate(wip.date)} · {wip.audioCount}ブロック
                    </p>
                  </div>

                  {/* アクション */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/lessons/edit/${wip.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: 'var(--accent)',
                        color: '#fff',
                        textDecoration: 'none',
                      }}
                    >
                      再開
                    </Link>
                    <button
                      onClick={() => deleteWip(wip.id, wip.name)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: 'var(--surface2)',
                        color: 'var(--red)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* 新規レッスン作成 */}
            <Link
              href="/lessons/new"
              className="block rounded-2xl p-4 text-sm font-medium text-center transition-all hover:opacity-80"
              style={{
                background: 'var(--surface)',
                border: '2px dashed var(--border)',
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              ＋ 新しいレッスンを作成する
            </Link>
          </div>
        </section>

        {/* ── クイックアクセス ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
            クイックアクセス
          </h2>

          <div className="space-y-2">
            <NavButton
              href="/vocab"
              icon="🔤"
              label="レッスンで登録された語彙を確認"
            />
          </div>
        </section>

        {/* ── 統計 ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
            データ件数
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <StatCard icon="🎬" label="レッスン"       count={stats?.lessonCount} />
            <StatCard icon="📚" label="辞書"           count={stats?.dictCount} />
            <StatCard icon="🃏" label="フラッシュカード" count={stats?.flashcardCount} />
            <StatCard icon="📢" label="アナウンス"      count={stats?.announcementCount} />
          </div>
        </section>

      </div>
    </>
  )
}

// ── サブコンポーネント ────────────────────────────

function NavButton({ href, icon, label }: {
  href: string
  icon: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl p-4 transition-all hover:opacity-80"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        textDecoration: 'none',
        color: 'var(--text)',
      }}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium flex-1">{label}</span>
      <span style={{ color: 'var(--muted)' }}>→</span>
    </Link>
  )
}

function StatCard({ icon, label, count }: {
  icon: string
  label: string
  count?: number
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
        {count ?? (
          <span className="text-sm" style={{ color: 'var(--muted)' }}>—</span>
        )}
      </p>
    </div>
  )
}
