import Header        from '@/components/layout/Header'
import Footer        from '@/components/layout/Footer'
import Hero          from '@/components/sections/Hero'
import About         from '@/components/sections/About'
import Countries     from '@/components/sections/Countries'
import FeaturedCities from '@/components/sections/FeaturedCities'
import WorldMap      from '@/components/sections/WorldMap'
import Stats         from '@/components/sections/Stats'
import Stories       from '@/components/sections/Stories'
import Instagram     from '@/components/sections/Instagram'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Countries />
        <FeaturedCities />
        <WorldMap />
        <Stats />
        <Stories />
        <Instagram />
      </main>
      <Footer />
    </>
  )
}
