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
  NLD: 528,
  FRA: 250,
  ESP: 724,
  DEU: 276,
  TUR: 792,
  USA: 840,
}

// Approximate marker positions [lng, lat]
const MARKERS: Record<string, [number, number]> = {
  GBR: [-2.5, 54.5],
  NLD: [5.3, 52.3],
  FRA: [2.3, 46.6],
  ESP: [-3.7, 40.4],
  DEU: [10.5, 51.2],
  TUR: [35.2, 39.0],
  USA: [-99.0, 38.0],
}

const COUNTRY_NAMES: Record<string, string> = {
  GBR: 'Birleşik Krallık',
  NLD: 'Hollanda',
  FRA: 'Fransa',
  ESP: 'İspanya',
  DEU: 'Almanya',
  TUR: 'Türkiye',
  USA: 'ABD',
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
