export interface Country {
  id: string
  name: string
  slug: string
  // Kısa açıklama — kartlarda gösterilir
  short_description: string | null
  // Uzun açıklama — ülke sayfasında gösterilir (eski 'description' sütunu)
  description: string | null
  cover_image: string | null
  hero_image: string | null
  flag: string | null
  continent: string | null
  visited_year: number | null
  city_count: number | null
  highlights: string[] | null
  lat: number | null
  lng: number | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface City {
  id: string
  country_id: string
  name: string
  slug: string
  // Ana görsel
  hero_image: string | null
  // cover_image eski alan — hero_image yoksa fallback
  cover_image: string | null
  // Kısa alıntı — kartlarda gösterilir
  excerpt: string | null
  // Uzun açıklama — şehir sayfasında (eski 'description' sütunu)
  description: string | null
  // Tam açıklama (yeni alan — description ile aynı amaca hizmet eder)
  full_description: string | null
  highlights: string[] | null
  gallery: string[] | null
  lat: number | null
  lng: number | null
  visit_duration: string | null
  tags: string[] | null
  tips: string[] | null
  must_see: { name: string; description: string }[] | null
  instagram_highlight_name: string | null
  published: boolean
  created_at: string
  updated_at: string
  // join
  countries?: Pick<Country, 'id' | 'name' | 'slug' | 'flag'>
}

export interface CountryWithCities extends Country {
  cities: City[]
}

// Form tipler (create / update)
export type CountryInput = {
  name: string
  slug: string
  short_description?: string
  description?: string
  cover_image?: string
  hero_image?: string
  flag?: string
  continent?: string
  visited_year?: number
  highlights?: string[]
  lat?: number
  lng?: number
  published: boolean
}

export type CityInput = {
  country_id: string
  name: string
  slug: string
  hero_image?: string
  cover_image?: string
  excerpt?: string
  description?: string
  full_description?: string
  highlights?: string[]
  gallery?: string[]
  visit_duration?: string
  tags?: string[]
  tips?: string[]
  must_see?: { name: string; description: string }[]
  instagram_highlight_name?: string
  lat?: number
  lng?: number
  published: boolean
}
