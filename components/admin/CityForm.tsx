'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, Upload, X } from 'lucide-react'
import { slugify, cn } from '@/lib/utils'
import { City, Country } from '@/types/db'

interface CityFormProps {
  initial?: City
}

export default function CityForm({ initial }: CityFormProps) {
  const router = useRouter()
  const isEdit = !!initial

  const [form, setForm] = useState({
    name:                     initial?.name                     ?? '',
    slug:                     initial?.slug                     ?? '',
    country_id:               initial?.country_id               ?? '',
    description:              initial?.description              ?? '',
    cover_image:              initial?.cover_image              ?? '',
    instagram_highlight_name: initial?.instagram_highlight_name ?? '',
    published:                initial?.published                ?? false,
  })
  const [slugManual, setSlugManual]         = useState(isEdit)
  const [countries, setCountries]           = useState<Country[]>([])
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')
  const [success, setSuccess]               = useState('')
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadProgress('Yükleniyor...')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setUploadProgress(`Hata: ${data.error}`); return }
      setForm((f) => ({ ...f, cover_image: data.url }))
      setUploadProgress('Görsel yüklendi!')
      setTimeout(() => setUploadProgress(''), 2500)
    } catch {
      setUploadProgress('Yükleme başarısız')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    fetch('/api/admin/countries')
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setCountries(d))
  }, [])

  useEffect(() => {
    if (!slugManual && form.name) {
      setForm((f) => ({ ...f, slug: slugify(form.name) }))
    }
  }, [form.name, slugManual])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim())       { setError('Şehir adı zorunlu'); return }
    if (!form.slug.trim())       { setError('Slug zorunlu'); return }
    if (!form.country_id.trim()) { setError('Ülke seçimi zorunlu'); return }

    setLoading(true)
    try {
      const url    = isEdit ? `/api/admin/cities/${initial!.id}` : '/api/admin/cities'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Bir hata oluştu')
        return
      }

      setSuccess(isEdit ? 'Şehir güncellendi!' : 'Şehir oluşturuldu!')
      setTimeout(() => router.push('/admin/cities'), 1200)
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = cn(
    'w-full px-4 py-3 rounded-xl border text-sm font-sans',
    'bg-[#FAF7F2] text-[#1C1C1C] placeholder:text-[#C2C2C2]',
    'border-[#E8E2DA] focus:border-[#C4956A] focus:outline-none transition-colors'
  )
  const labelClass = 'block text-xs font-medium text-[#6B6B6B] mb-1.5 uppercase tracking-wider'

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {/* Country */}
      <div>
        <label className={labelClass}>Ülke *</label>
        <select
          value={form.country_id}
          onChange={(e) => setForm({ ...form, country_id: e.target.value })}
          className={inputClass}
        >
          <option value="">— Ülke Seçin —</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div>
        <label className={labelClass}>Şehir Adı *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Örn: Edinburgh"
          className={inputClass}
        />
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>Slug *</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => { setSlugManual(true); setForm({ ...form, slug: e.target.value }) }}
          placeholder="edinburgh"
          className={inputClass}
        />
        <p className="text-xs text-[#9A9A9A] mt-1 font-sans">
          URL: /countries/[ülke]/<strong>{form.slug || 'slug'}</strong>
        </p>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Açıklama</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Bu şehir hakkında kısa bir açıklama..."
          rows={4}
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className={labelClass}>Kapak Görseli</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={form.cover_image}
            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
            placeholder="https://images.unsplash.com/... veya dosya yükleyin"
            className={cn(inputClass, 'flex-1')}
          />
          <label className={cn(
            'flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[#E8E2DA]',
            'text-sm font-sans text-[#6B6B6B] hover:border-[#C4956A] hover:text-[#C4956A]',
            'transition-colors cursor-pointer whitespace-nowrap'
          )}>
            <Upload size={14} />
            Yükle
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          {form.cover_image && (
            <button
              type="button"
              onClick={() => setForm({ ...form, cover_image: '' })}
              className="p-3 rounded-xl border border-[#E8E2DA] text-[#9A9A9A] hover:border-red-300 hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {uploadProgress && (
          <p className="text-xs text-[#C4956A] mt-1 font-sans">{uploadProgress}</p>
        )}
        {form.cover_image && (
          <img
            src={form.cover_image}
            alt="preview"
            className="mt-2 w-full h-40 object-cover rounded-xl"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}
      </div>

      {/* Instagram Highlight */}
      <div>
        <label className={labelClass}>Instagram Highlight Adı</label>
        <input
          type="text"
          value={form.instagram_highlight_name}
          onChange={(e) => setForm({ ...form, instagram_highlight_name: e.target.value })}
          placeholder="Örn: Edinburgh 🏰"
          className={inputClass}
        />
      </div>

      {/* Published */}
      <div className="flex items-center justify-between bg-white border border-[#E8E2DA] rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-medium font-sans text-[#1C1C1C]">Yayında</p>
          <p className="text-xs text-[#9A9A9A] font-sans">Kapalıysa ziyaretçiler göremez</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...form, published: !form.published })}
          className={cn(
            'relative w-11 h-6 rounded-full transition-colors duration-200',
            form.published ? 'bg-[#C4956A]' : 'bg-[#E8E2DA]'
          )}
        >
          <span className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
            form.published && 'translate-x-5'
          )} />
        </button>
      </div>

      {error   && <div className="px-4 py-3 rounded-xl bg-red-50  border border-red-100"><p className="text-sm text-red-600   font-sans">{error}</p></div>}
      {success && <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-100"><p className="text-sm text-green-600 font-sans">{success}</p></div>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1C1C1C] text-white text-sm font-sans font-medium hover:bg-[#C4956A] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {loading ? 'Kaydediliyor…' : isEdit ? 'Güncelle' : 'Kaydet'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/cities')}
          className="px-6 py-3 rounded-xl border border-[#E8E2DA] text-sm font-sans text-[#6B6B6B] hover:border-[#C4956A] hover:text-[#C4956A] transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  )
}
