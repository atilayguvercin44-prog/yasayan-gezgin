import CountryForm from '@/components/admin/CountryForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewCountryPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/countries"
          className="inline-flex items-center gap-1.5 text-sm text-[#9A9A9A] hover:text-[#C4956A] font-sans mb-4 transition-colors"
        >
          <ChevronLeft size={15} /> Ülkelere Dön
        </Link>
        <h1 className="font-serif text-4xl font-semibold text-[#1C1C1C]">Yeni Ülke</h1>
        <p className="text-sm text-[#9A9A9A] font-sans mt-1">Yeni bir ülke ekleyin</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-8">
        <CountryForm />
      </div>
    </div>
  )
}
