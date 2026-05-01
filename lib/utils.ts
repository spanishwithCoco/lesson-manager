export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function nowStr(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

export function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return dateStr.slice(0, 10)
}

export const VISIBILITY_LABELS: Record<string, { label: string; color: string }> = {
  public:  { label: '🌐 無料公開',    color: 'text-green-700 bg-green-50 border-green-200' },
  members: { label: '🔒 メンバー限定', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  premium: { label: '⭐ プレミアム',   color: 'text-orange-700 bg-orange-50 border-orange-200' },
  private: { label: '🚫 非公開',      color: 'text-gray-500 bg-gray-50 border-gray-200' },
}
