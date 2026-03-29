export interface Country {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface City {
  id: string
  country_id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  instagram_highlight_name: string | null
  published: boolean
  created_at: string
  updated_at: string
  // join
  countries?: Pick<Country, 'id' | 'name' | 'slug'>
}

export interface CountryWithCities extends Country {
  cities: City[]
}

// Form tipler (create / update)
export type CountryInput = {
  name: string
  slug: string
  description?: string
  cover_image?: string
  published: boolean
}

export type CityInput = {
  country_id: string
  name: string
  slug: string
  description?: string
  cover_image?: string
  instagram_highlight_name?: string
  published: boolean
}
