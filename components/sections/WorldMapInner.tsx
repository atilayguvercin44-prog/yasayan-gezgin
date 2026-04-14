'use client'

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { useState } from 'react'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const NUMERIC_CODES: Record<string, number> = {
  GBR: 826, AZE:  31, ROU: 642, EGY: 818, CZE: 203,
  AUT:  40, SVK: 703, TUR: 792, CHE: 756, ITA: 380,
  LIE: 438, BHR:  48, NLD: 528, BEL:  56, DEU: 276,
  ESP: 724, SWE: 752, DNK: 208, GRC: 300, BGR: 100,
  MKD: 807, SRB: 688, BIH:  70, HRV: 191, MNE: 499,
  ALB:   8,
}

const MARKERS: Record<string, [number, number]> = {
  GBR: [ -2.0,  54.0], AZE: [47.5,  40.4], ROU: [25.0,  45.8],
  EGY: [ 30.0,  27.0], CZE: [15.5,  49.8], AUT: [14.5,  47.5],
  SVK: [ 19.0,  48.7], TUR: [35.2,  39.0], CHE: [ 8.2,  46.8],
  ITA: [ 12.5,  42.5], LIE: [ 9.5,  47.1], BHR: [50.6,  26.0],
  NLD: [  5.3,  52.3], BEL: [ 4.5,  50.5], DEU: [10.5,  51.2],
  ESP: [ -3.7,  40.4], SWE: [18.0,  59.5], DNK: [10.0,  56.0],
  GRC: [ 22.0,  39.0], BGR: [25.5,  42.7], MKD: [21.7,  41.6],
  SRB: [ 21.0,  44.0], BIH: [17.8,  44.2], HRV: [15.5,  45.1],
  MNE: [ 19.3,  42.7], ALB: [20.2,  41.2],
}

const LABELS: Record<string, string> = {
  GBR: 'Birleşik Krallık', AZE: 'Azerbaycan',   ROU: 'Romanya',
  EGY: 'Mısır',            CZE: 'Çekya',         AUT: 'Avusturya',
  SVK: 'Slovakya',         TUR: 'Türkiye',        CHE: 'İsviçre',
  ITA: 'İtalya',           LIE: 'Liechtenstein',  BHR: 'Bahreyn',
  NLD: 'Hollanda',         BEL: 'Belçika',        DEU: 'Almanya',
  ESP: 'İspanya',          SWE: 'İsveç',          DNK: 'Danimarka',
  GRC: 'Yunanistan',       BGR: 'Bulgaristan',    MKD: 'K. Makedonya',
  SRB: 'Sırbistan',        BIH: 'Bosna-Hersek',   HRV: 'Hırvatistan',
  MNE: 'Karadağ',          ALB: 'Arnavutluk',
}

const OCEAN          = '#0D1B2A'
const LAND_UNVISITED = '#162535'
const LAND_BORDER    = '#0D1B2A'
const VISITED_FILL   = '#C4956A'
const VISITED_HOVER  = '#D4AA87'
const SELECTED_FILL  = '#E8C49A'

interface Props {
  visitedCountryCodes: string[]
  selectedCode: string | null
  onCountryClick: (code: string) => void
}

export default function WorldMapInner({
  visitedCountryCodes,
  selectedCode,
  onCountryClick,
}: Props) {
  const [zoom, setZoom] = useState(1)
  const visitedNumerics = visitedCountryCodes.map((c) => NUMERIC_CODES[c])

  // Markers ekranda sabit büyüklükte kalsın — zoom arttıkça ters orantılı küçül
  const s = 1 / zoom  // scale factor

  // Zoom eşiğine göre label göster/gizle
  // Düşük zoom'da sadece seçili ülkenin label'ı görünür
  // Yüksek zoom'da (yaklaştırınca) tüm label'lar görünür
  const showAllLabels = zoom >= 3

  return (
    <div style={{ position: 'absolute', inset: 0, background: OCEAN, overflow: 'hidden' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 148, center: [14, 38] }}
        style={{ width: '100%', height: '100%' }}
        width={960}
        height={540}
      >
        <ZoomableGroup
          zoom={zoom}
          center={[14, 38]}
          minZoom={0.6}
          maxZoom={20}
          onMoveEnd={({ zoom: z }: { zoom: number; coordinates: [number, number] }) => setZoom(z)}
        >
          <rect x="-5000" y="-5000" width="10000" height="10000" fill={OCEAN} />

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numId     = Number(geo.id)
                const isVisited = visitedNumerics.includes(numId)
                const code      = visitedCountryCodes.find((c) => NUMERIC_CODES[c] === numId)
                const isSelected = code === selectedCode

                const fillColor = isSelected
                  ? SELECTED_FILL
                  : isVisited
                    ? VISITED_FILL
                    : LAND_UNVISITED

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => code && onCountryClick(code)}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: LAND_BORDER,
                        strokeWidth: 0.4 * s,
                        outline: 'none',
                        cursor: isVisited ? 'pointer' : 'default',
                      },
                      hover: {
                        fill: isSelected
                          ? SELECTED_FILL
                          : isVisited
                            ? VISITED_HOVER
                            : '#1E3248',
                        stroke: LAND_BORDER,
                        strokeWidth: 0.4 * s,
                        outline: 'none',
                        cursor: isVisited ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: isVisited ? SELECTED_FILL : LAND_UNVISITED,
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* Markers — tüm boyutlar s (1/zoom) ile çarpılıyor */}
          {visitedCountryCodes.map((code) => {
            const coords     = MARKERS[code]
            const isSelected = code === selectedCode
            const showLabel  = showAllLabels || isSelected
            if (!coords) return null

            // Temel boyutlar (zoom=1'deki referans değerler)
            const pulseR  = isSelected ? 12 : 9
            const outerR  = isSelected ? 7  : 5
            const innerR  = isSelected ? 4  : 3
            const labelY  = -(innerR + 6) * s
            const fontSize = isSelected ? 8.5 : 7

            return (
              <Marker
                key={code}
                coordinates={coords}
                onClick={() => onCountryClick(code)}
              >
                {/* Pulse halkası */}
                <circle
                  r={pulseR * s}
                  fill={isSelected ? '#E8C49A' : '#C4956A'}
                  fillOpacity={isSelected ? 0.28 : 0.16}
                  stroke="none"
                  className={isSelected ? 'map-pulse' : ''}
                  style={{ cursor: 'pointer' }}
                />

                {/* Dış halka */}
                <circle
                  r={outerR * s}
                  fill="none"
                  stroke={isSelected ? '#E8C49A' : '#C4956A'}
                  strokeWidth={1.5 * s}
                  strokeOpacity={0.7}
                  style={{ cursor: 'pointer' }}
                />

                {/* Merkez nokta */}
                <circle
                  r={innerR * s}
                  fill={isSelected ? '#E8C49A' : '#C4956A'}
                  stroke={OCEAN}
                  strokeWidth={0.8 * s}
                  style={{ cursor: 'pointer' }}
                />

                {/* Label — zoom eşiğinde veya seçiliyse göster */}
                {showLabel && (
                  <text
                    y={labelY}
                    textAnchor="middle"
                    style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: `${fontSize * s}px`,
                      fill: isSelected ? '#E8C49A' : 'rgba(250,247,242,0.82)',
                      fontWeight: isSelected ? '700' : '500',
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.95))',
                    }}
                  >
                    {LABELS[code]}
                  </text>
                )}
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
