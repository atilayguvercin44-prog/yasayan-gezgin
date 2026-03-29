import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { data, error } = await supabase
    .from('cities')
    .select('*, countries(id, name, slug)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { name, country_id, description, cover_image, instagram_highlight_name, published } = body

  if (!name?.trim())       return NextResponse.json({ error: 'Şehir adı zorunlu' }, { status: 400 })
  if (!country_id?.trim()) return NextResponse.json({ error: 'Ülke seçimi zorunlu' }, { status: 400 })

  const slug = body.slug?.trim() || slugify(name)

  const { data, error } = await supabase
    .from('cities')
    .update({ name: name.trim(), slug, country_id, description, cover_image, instagram_highlight_name, published })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Bu ülkede bu slug zaten mevcut' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { error } = await supabase.from('cities').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
