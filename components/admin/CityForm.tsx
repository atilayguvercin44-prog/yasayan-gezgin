'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, Upload, X, Plus, Trash2 } from 'lucide-react'
import { slugify, cn } from '@/lib/utils'
import { City, Country } from '@/types/db'

interface CityFormProps {
  initial?: City
}

interface MustSeeItem {
  name: string
  description: string
}

export default function CityForm({ initial }: CityFormProps) {
  const router = useRouter()
  const isEdit = !!initial

  const [form, setForm] = useState({
    name:                     initial?.name                     ?? '',
    slug:                     initial?.slug                     ?? '',
    country_id:               initial?.country_id               ?? '',
    excerpt:                  initial?.excerpt                  ?? '',
    description:              (initial?.full_description ?? initial?.description) ?? '',
    hero_image:               (initial?.hero_image ?? initial?.cover_image)       ?? '',
    visit_duration:           initial?.visit_duration           ?? '',
    instagram_highlight_name: initial?.instagram_highlight_name ?? '',
    published:                initial?.published                ?? false,
  })
  const [highlights, setHighlights] = useState<string[]>(initial?.highlights ?? [])
  const [gallery, setGallery]       = useState<string[]>(initial?.gallery    ?? [])
  const [tags, setTags]             = useState<string[]>(initial?.tags       ?? [])
  const [tips, setTips]             = useState<string[]>(initial?.tips       ?? [])
  const [mustSee, setMustSee]       = useState<MustSeeItem[]>(
    (initial?.must_see ?? []) as MustSeeItem[]
  )

  const [slugManual, setSlugManual]         = useState(isEdit)
  const [countries, setCountries]           = useState<Country[]>([])
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')
  const [success, setSuccess]               = useState('')
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadProgress('Yükleniyor...')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setUploadProgress(`Hata: ${data.error}`); return }
      onSuccess(data.url)
      setUploadProgress('Yüklendi!')
      setTimeout(() => setUploadProgress(''), 2500)
    } catch {
      setUploadProgress('Yükleme başarısız')
    }
    e.target.value = ''
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
        body: JSON.stringify({
          name:                     form.name.trim(),
          slug:                     form.slug,
          country_id:               form.country_id,
          hero_image:               form.hero_image  || null,
          cover_image:              form.hero_image  || null,
          excerpt:                  form.excerpt     || null,
          full_description:         form.description || null,
          description:              form.description || null,
          visit_duration:           form.visit_duration || null,
          instagram_highlight_name: form.instagram_highlight_name || null,
          highlights,
          gallery,
          tags,
          tips,
          must_see: mustSee.filter((m) => m.name.trim()),
          published: form.published,
        }),
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
  const sectionHead = 'pb-1 border-b border-[#E8E2DA] pt-3'
  const sectionLabel = 'text-xs font-sans uppercase tracking-widest text-[#C4956A]'

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">

      {/* ── Temel Bilgiler ── */}
      <div className={sectionHead}><p className={sectionLabel}>Temel Bilgiler</p></div>

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

      {/* Visit Duration */}
      <div>
        <label className={labelClass}>Ziyaret Süresi</label>
        <input
          type="text"
          value={form.visit_duration}
          onChange={(e) => setForm({ ...form, visit_duration: e.target.value })}
          placeholder="Örn: 2-3 gün"
          className={inputClass}
        />
      </div>

      {/* ── İçerik ── */}
      <div className={sectionHead}><p className={sectionLabel}>İçerik</p></div>

      {/* Excerpt */}
      <div>
        <label className={labelClass}>Kısa Alıntı <span className="text-[#9A9A9A] normal-case tracking-normal">(kartlarda görünür)</span></label>
        <input
          type="text"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          placeholder="Şehri tek cümleyle anlatan etkileyici bir ifade"
          className={inputClass}
        />
      </div>

      {/* Full Description */}
      <div>
        <label className={labelClass}>Tam Açıklama <span className="text-[#9A9A9A] normal-case tracking-normal">(şehir sayfasında görünür)</span></label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Gezi rehberi düzeyinde detaylı açıklama. Atmosfer, tarihi önem, neden gidilmeli, ne hissettirdi?"
          rows={6}
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass}>Etiketler</label>
        <div className="space-y-2">
          {tags.map((t, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={t}
                onChange={(e) => {
                  const next = [...tags]; next[i] = e.target.value; setTags(next)
                }}
                placeholder="Örn: Tarih"
                className={cn(inputClass, 'flex-1')}
              />
              <button type="button" onClick={() => setTags(tags.filter((_, j) => j !== i))}
                className="p-3 rounded-xl border border-[#E8E2DA] text-[#9A9A9A] hover:border-red-300 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setTags([...tags, ''])}
            className="flex items-center gap-1.5 text-xs text-[#C4956A] hover:text-[#B07A50] font-sans transition-colors">
            <Plus size={13} /> Etiket Ekle
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div>
        <label className={labelClass}>Öne Çıkanlar</label>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={h}
                onChange={(e) => {
                  const next = [...highlights]; next[i] = e.target.value; setHighlights(next)
                }}
                placeholder="Örn: Edinburgh Castle"
                className={cn(inputClass, 'flex-1')}
              />
              <button type="button" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))}
                className="p-3 rounded-xl border border-[#E8E2DA] text-[#9A9A9A] hover:border-red-300 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setHighlights([...highlights, ''])}
            className="flex items-center gap-1.5 text-xs text-[#C4956A] hover:text-[#B07A50] font-sans transition-colors">
            <Plus size={13} /> Ekle
          </button>
        </div>
      </div>

      {/* ── Gezi Notları ── */}
      <div className={sectionHead}><p className={sectionLabel}>Gezi Notları</p></div>

      <div>
        <label className={labelClass}>İpuçları</label>
        <div className="space-y-2">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={tip}
                onChange={(e) => {
                  const next = [...tips]; next[i] = e.target.value; setTips(next)
                }}
                placeholder="Yararlı bir gezi ipucu"
                className={cn(inputClass, 'flex-1')}
              />
              <button type="button" onClick={() => setTips(tips.filter((_, j) => j !== i))}
                className="p-3 rounded-xl border border-[#E8E2DA] text-[#9A9A9A] hover:border-red-300 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setTips([...tips, ''])}
            className="flex items-center gap-1.5 text-xs text-[#C4956A] hover:text-[#B07A50] font-sans transition-colors">
            <Plus size={13} /> İpucu Ekle
          </button>
        </div>
      </div>

      {/* ── Mutlaka Görülmeli ── */}
      <div className={sectionHead}><p className={sectionLabel}>Mutlaka Görülmeli</p></div>

      <div className="space-y-4">
        {mustSee.map((item, i) => (
          <div key={i} className="p-4 rounded-xl border border-[#E8E2DA] bg-white space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-sans text-[#9A9A9A]">#{i + 1}</span>
              <button type="button" onClick={() => setMustSee(mustSee.filter((_, j) => j !== i))}
                className="text-[#9A9A9A] hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
            <input
              type="text"
              value={item.name}
              onChange={(e) => {
                const next = [...mustSee]; next[i] = { ...next[i], name: e.target.value }; setMustSee(next)
              }}
              placeholder="Yer adı (Örn: Edinburgh Castle)"
              className={inputClass}
            />
            <textarea
              value={item.description}
              onChange={(e) => {
                const next = [...mustSee]; next[i] = { ...next[i], description: e.target.value }; setMustSee(next)
              }}
              placeholder="Neden görülmeli? Kısa açıklama."
              rows={2}
              className={cn(inputClass, 'resize-none')}
            />
          </div>
        ))}
        <button type="button"
          onClick={() => setMustSee([...mustSee, { name: '', description: '' }])}
          className="flex items-center gap-1.5 text-xs text-[#C4956A] hover:text-[#B07A50] font-sans transition-colors">
          <Plus size={13} /> Yer Ekle
        </button>
      </div>

      {/* ── Görseller ── */}
      <div className={sectionHead}><p className={sectionLabel}>Görseller</p></div>

      {/* Hero Image */}
      <div>
        <label className={labelClass}>Ana Görsel (Hero)</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={form.hero_image}
            onChange={(e) => setForm({ ...form, hero_image: e.target.value })}
            placeholder="https://images.unsplash.com/..."
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
              onChange={(e) => handleFileUpload(e, (url) => setForm((f) => ({ ...f, hero_image: url })))}
            />
          </label>
          {form.hero_image && (
            <button type="button" onClick={() => setForm({ ...form, hero_image: '' })}
              className="p-3 rounded-xl border border-[#E8E2DA] text-[#9A9A9A] hover:border-red-300 hover:text-red-400 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        {uploadProgress && <p className="text-xs text-[#C4956A] mt-1 font-sans">{uploadProgress}</p>}
        {form.hero_image && (
          <img src={form.hero_image} alt="preview"
            className="mt-2 w-full h-40 object-cover rounded-xl"
            onError={(e) => (e.currentTarget.style.display = 'none')} />
        )}
      </div>

      {/* Gallery */}
      <div>
        <label className={labelClass}>Galeri <span className="text-[#9A9A9A] normal-case tracking-normal">(URL veya yükle)</span></label>
        <div className="space-y-2">
          {gallery.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  const next = [...gallery]; next[i] = e.target.value; setGallery(next)
                }}
                placeholder="https://images.unsplash.com/..."
                className={cn(inputClass, 'flex-1')}
              />
              <button type="button" onClick={() => setGallery(gallery.filter((_, j) => j !== i))}
                className="p-3 rounded-xl border border-[#E8E2DA] text-[#9A9A9A] hover:border-red-300 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button" onClick={() => setGallery([...gallery, ''])}
              className="flex items-center gap-1.5 text-xs text-[#C4956A] hover:text-[#B07A50] font-sans transition-colors">
              <Plus size={13} /> URL Ekle
            </button>
            <label className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#C4956A] font-sans cursor-pointer transition-colors">
              <Upload size={13} /> Dosya Yükle
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (url) => setGallery((g) => [...g, url]))}
              />
            </label>
          </div>
        </div>
        {gallery.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {gallery.filter(Boolean).map((url, i) => (
              <img key={i} src={url} alt={`galeri ${i + 1}`}
                className="w-full h-20 object-cover rounded-lg"
                onError={(e) => (e.currentTarget.style.display = 'none')} />
            ))}
          </div>
        )}
      </div>

      {/* ── Diğer ── */}
      <div className={sectionHead}><p className={sectionLabel}>Diğer</p></div>

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
