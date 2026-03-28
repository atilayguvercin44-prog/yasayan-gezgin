export interface Country {
  id: string
  name: string
  slug: string
  coverImage: string
  shortDescription: string
  longDescription: string
  cityCount: number
  continent: string
  visitedYear: number
  mapCoords: { x: number; y: number } // % position on world map
  highlights: string[]
  flag: string
}

export interface City {
  id: string
  countryId: string
  countryName: string
  name: string
  slug: string
  heroImage: string
  excerpt: string
  fullDescription: string
  highlights: string[]
  gallery: string[]
  coordinates: { lat: number; lng: number }
  visitDuration: string
  tags: string[]
  tips: string[]
  mustSee: { name: string; description: string }[]
}

export interface Story {
  id: string
  title: string
  subtitle: string
  city: string
  country: string
  summary: string
  coverImage: string
  readTime: number
  publishedAt: string
  tags: string[]
  featured: boolean
}

export interface SocialPost {
  id: string
  platform: 'instagram' | 'youtube'
  image: string
  caption: string
  link: string
  likes: number
  location: string
  isVideo?: boolean
}

export interface Stat {
  id: string
  label: string
  value: number
  suffix: string
  description: string
  icon: string
}
