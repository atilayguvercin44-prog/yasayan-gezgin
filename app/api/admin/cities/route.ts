import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

// GET /api/admin/cities
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search     = searchParams.get('search') ?? ''
  const published  = searchParams.get('published')
  const countryId  = searchParams.get('country_id')

  let query = supabase
    .from('cities')
    .select('*, countries(id, name, slug, flag)')
    .order('name', { ascending: true })

  if (search)     query = query.ilike('name', `%${search}%`)
  if (countryId)  query = query.eq('country_id', countryId)
  if (published === 'true')  query = query.eq('published', true)
  if (published === 'false') query = query.eq('published', false)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/cities
export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    name, country_id, hero_image, cover_image, excerpt,
    description, full_description, highlights, gallery,
    visit_duration, tags, tips, must_see,
    instagram_highlight_name, lat, lng, published,
  } = body

  if (!name?.trim())       return NextResponse.json({ error: 'Şehir adı zorunlu' }, { status: 400 })
  if (!country_id?.trim()) return NextResponse.json({ error: 'Ülke seçimi zorunlu' }, { status: 400 })

  const slug = body.slug?.trim() || slugify(name)

  const { data, error } = await supabase
    .from('cities')
    .insert({
      name: name.trim(),
      slug,
      country_id,
      hero_image,
      cover_image,
      excerpt,
      description,
      full_description,
      highlights: highlights ?? [],
      gallery: gallery ?? [],
      visit_duration,
      tags: tags ?? [],
      tips: tips ?? [],
      must_see: must_see ?? [],
      instagram_highlight_name,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      published: published ?? false,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Bu ülkede bu slug zaten mevcut' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
