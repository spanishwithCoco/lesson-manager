import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ブラウザ・サーバー共用のクライアント
// （管理ページは認証済みユーザーのみなので anon key で十分）
export const supabase = createClient(supabaseUrl, supabaseKey)

export const STORAGE_BUCKET = 'audio'
