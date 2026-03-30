'use client'

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ISO 3166-1 numeric codes for visited countries
const NUMERIC_CODES: Record<string, number> = {
  GBR: 826,
  AZE: 31,
  ROU: 642,
  EGY: 818,
  CZE: 203,
  AUT: 40,
  SVK: 703,
  TUR: 792,
  CHE: 756,
  ITA: 380,
  LIE: 438,
  BHR: 48,
  NLD: 528,
  BEL: 56,
  DEU: 276,
  ESP: 724,
  SWE: 752,
  DNK: 208,
  GRC: 300,
  BGR: 100,
  MKD: 807,
  SRB: 688,
  BIH: 70,
  HRV: 191,
  MNE: 499,
  ALB: 8,
}

// Approximate marker positions [lng, lat]
const MARKERS: Record<string, [number, number]> = {
  GBR: [-2.5, 54.5],
  AZE: [47.5, 40.4],
  ROU: [25.0, 45.8],
  EGY: [30.0, 27.0],
  CZE: [15.5, 49.8],
  AUT: [14.5, 47.5],
  SVK: [19.0, 48.7],
  TUR: [35.2, 39.0],
  CHE: [8.2, 46.8],
  ITA: [12.5, 42.5],
  LIE: [9.5, 47.1],
  BHR: [50.6, 26.0],
  NLD: [5.3, 52.3],
  BEL: [4.5, 50.5],
  DEU: [10.5, 51.2],
  ESP: [-3.7, 40.4],
  SWE: [18.0, 59.5],
  DNK: [10.0, 56.0],
  GRC: [22.0, 39.0],
  BGR: [25.5, 42.7],
  MKD: [21.7, 41.6],
  SRB: [21.0, 44.0],
  BIH: [17.8, 44.2],
  HRV: [15.5, 45.1],
  MNE: [19.3, 42.7],
  ALB: [20.2, 41.2],
}

const COUNTRY_NAMES: Record<string, string> = {
  GBR: 'Birleşik Krallık',
  AZE: 'Azerbaycan',
  ROU: 'Romanya',
  EGY: 'Mısır',
  CZE: 'Çekya',
  AUT: 'Avusturya',
  SVK: 'Slovakya',
  TUR: 'Türkiye',
  CHE: 'İsviçre',
  ITA: 'İtalya',
  LIE: 'Liechtenstein',
  BHR: 'Bahreyn',
  NLD: 'Hollanda',
  BEL: 'Belçika',
  DEU: 'Almanya',
  ESP: 'İspanya',
  SWE: 'İsveç',
  DNK: 'Danimarka',
  GRC: 'Yunanistan',
  BGR: 'Bulgaristan',
  MKD: 'Kuzey Makedonya',
  SRB: 'Sırbistan',
  BIH: 'Bosna-Hersek',
  HRV: 'Hırvatistan',
  MNE: 'Karadağ',
  ALB: 'Arnavutluk',
}

interface Props {
  visitedCountryCodes: string[]
  onCountryClick: (code: string) => void
}

export default function WorldMapInner({ visitedCountryCodes, onCountryClick }: Props) {
  const visitedNumerics = visitedCountryCodes.map((c) => NUMERIC_CODES[c])

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '420px' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140, center: [10, 35] }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1} center={[10, 35]} maxZoom={4}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numId = Number(geo.id)
                const isVisited = visitedNumerics.includes(numId)
                const code = visitedCountryCodes.find(
                  (c) => NUMERIC_CODES[c] === numId
                )

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => code && onCountryClick(code)}
                    style={{
                      default: {
                        fill: isVisited ? '#C4956A' : '#1E2D3D',
                        stroke: '#0F1923',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: isVisited ? 'pointer' : 'default',
                        transition: 'fill 0.2s ease',
                      },
                      hover: {
                        fill: isVisited ? '#D4AA87' : '#263545',
                        stroke: '#0F1923',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: isVisited ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: isVisited ? '#A67952' : '#1E2D3D',
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* Animated markers for visited countries */}
          {visitedCountryCodes.map((code) => {
            const coords = MARKERS[code]
            if (!coords) return null

            return (
              <Marker
                key={code}
                coordinates={coords}
                onClick={() => onCountryClick(code)}
              >
                {/* Pulse ring */}
                <circle
                  r={8}
                  fill="#C4956A"
                  fillOpacity={0.2}
                  stroke="none"
                  className="map-pulse"
                />
                {/* Center dot */}
                <circle
                  r={4}
                  fill="#C4956A"
                  stroke="#FAF7F2"
                  strokeWidth={1.5}
                  style={{ cursor: 'pointer' }}
                />
                {/* Label */}
                <text
                  y={-10}
                  textAnchor="middle"
                  style={{
                    fontFamily: 'var(--font-inter), system-ui',
                    fontSize: '7px',
                    fill: '#FAF7F2',
                    opacity: 0.8,
                    pointerEvents: 'none',
                  }}
                >
                  {COUNTRY_NAMES[code]}
                </text>
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
