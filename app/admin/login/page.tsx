'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Eye, EyeOff, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm]         = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.username.trim() || !form.password.trim()) {
      setError('Tüm alanları doldurun')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Giriş başarısız')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-[#C4956A]/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full bg-[#7B9E87]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <Globe size={22} strokeWidth={1.5} className="text-[#C4956A]" />
            <span className="font-serif text-2xl font-semibold text-[#1C1C1C]">
              Yaşayan<span className="text-[#C4956A]"> Gezgin</span>
            </span>
          </div>
          <p className="text-sm text-[#9A9A9A] font-sans">Admin Paneli</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_50px_rgba(0,0,0,0.08)] p-8">
          <h1 className="font-serif text-2xl font-semibold text-[#1C1C1C] mb-1">Giriş Yap</h1>
          <p className="text-sm text-[#9A9A9A] mb-8">Yönetim paneline erişin</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-2 uppercase tracking-wider">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                autoComplete="username"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border text-sm font-sans',
                  'bg-[#FAF7F2] text-[#1C1C1C] placeholder:text-[#C2C2C2]',
                  'border-[#E8E2DA] focus:border-[#C4956A] focus:outline-none',
                  'transition-colors duration-200'
                )}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-2 uppercase tracking-wider">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className={cn(
                    'w-full px-4 py-3 pr-11 rounded-xl border text-sm font-sans',
                    'bg-[#FAF7F2] text-[#1C1C1C] placeholder:text-[#C2C2C2]',
                    'border-[#E8E2DA] focus:border-[#C4956A] focus:outline-none',
                    'transition-colors duration-200'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-[#1C1C1C] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-sm text-red-600 font-sans">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl',
                'bg-[#1C1C1C] text-white font-sans text-sm font-medium',
                'hover:bg-[#C4956A] transition-colors duration-300',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={15} />
              )}
              {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#C2C2C2] mt-6 font-sans">
          Sadece yetkili admin erişebilir
        </p>
      </div>
    </div>
  )
}
