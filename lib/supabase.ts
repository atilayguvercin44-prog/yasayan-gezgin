import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase ortam değişkenleri eksik. .env dosyasını kontrol et.')
}

// Service role client — tüm server-side işlemler için (API routes, server components)
// Bu istemci RLS'yi bypass eder, sadece server-side kullanılmalı
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})
