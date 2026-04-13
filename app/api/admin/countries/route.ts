import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

// GET /api/admin/countries — tüm ülkeler
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search    = searchParams.get('search') ?? ''
  const published = searchParams.get('published')

  let query = supabase
    .from('countries')
    .select('*')
    .order('name', { ascending: true })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }
  if (published === 'true')  query = query.eq('published', true)
  if (published === 'false') query = query.eq('published', false)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/countries — yeni ülke
export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    name, description, short_description, cover_image, hero_image,
    flag, continent, visited_year, highlights, lat, lng, published,
  } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Ülke adı zorunlu' }, { status: 400 })
  }

  const slug = body.slug?.trim() || slugify(name)

  const { data, error } = await supabase
    .from('countries')
    .insert({
      name: name.trim(),
      slug,
      description,
      short_description,
      cover_image,
      hero_image,
      flag,
      continent,
      visited_year: visited_year ? Number(visited_year) : null,
      highlights: highlights ?? [],
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      published: published ?? false,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Bu slug zaten kullanımda' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
