import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

// GET /api/admin/countries/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH /api/admin/countries/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
    .update({
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
      published,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Bu slug zaten kullanımda' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE /api/admin/countries/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { error } = await supabase
    .from('countries')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
