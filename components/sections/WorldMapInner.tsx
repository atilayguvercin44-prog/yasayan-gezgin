'use client'

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { useState } from 'react'

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ISO 3166-1 numeric → alpha-3
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

// Marker coords [lng, lat]
const MARKERS: Record<string, [number, number]> = {
  GBR: [-2.0,  54.0],
  AZE: [47.5,  40.4],
  ROU: [25.0,  45.8],
  EGY: [30.0,  27.0],
  CZE: [15.5,  49.8],
  AUT: [14.5,  47.5],
  SVK: [19.0,  48.7],
  TUR: [35.2,  39.0],
  CHE: [ 8.2,  46.8],
  ITA: [12.5,  42.5],
  LIE: [ 9.5,  47.1],
  BHR: [50.6,  26.0],
  NLD: [ 5.3,  52.3],
  BEL: [ 4.5,  50.5],
  DEU: [10.5,  51.2],
  ESP: [-3.7,  40.4],
  SWE: [18.0,  59.5],
  DNK: [10.0,  56.0],
  GRC: [22.0,  39.0],
  BGR: [25.5,  42.7],
  MKD: [21.7,  41.6],
  SRB: [21.0,  44.0],
  BIH: [17.8,  44.2],
  HRV: [15.5,  45.1],
  MNE: [19.3,  42.7],
  ALB: [20.2,  41.2],
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
  MKD: 'K. Makedonya',
  SRB: 'Sırbistan',
  BIH: 'Bosna-Hersek',
  HRV: 'Hırvatistan',
  MNE: 'Karadağ',
  ALB: 'Arnavutluk',
}

// Color tokens
const OCEAN      = '#0D1B2A'
const UNVISITED  = '#162535'
const UNVISITED_HOVER = '#1E3248'
const VISITED    = '#C4956A'
const VISITED_HOVER   = '#D4AA87'
const SELECTED   = '#E8C49A'
const BORDER     = '#0D1B2A'

interface Props {
  visitedCountryCodes: string[]
  selectedCode: string | null
  onCountryClick: (code: string) => void
}

export default function WorldMapInner({ visitedCountryCodes, selectedCode, onCountryClick }: Props) {
  const [hoveredCode, setHoveredCode] = useState<string | null>(null)
  const visitedNumerics = visitedCountryCodes.map((c) => NUMERIC_CODES[c])

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '440px', background: OCEAN }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 148, center: [14, 38] }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1} center={[14, 38]} minZoom={0.8} maxZoom={6}>

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numId  = Number(geo.id)
                const isVisited = visitedNumerics.includes(numId)
                const code   = visitedCountryCodes.find((c) => NUMERIC_CODES[c] === numId)
                const isSelected = code === selectedCode
                const isHovered  = code === hoveredCode

                const fillColor = isSelected
                  ? SELECTED
                  : isHovered && isVisited
                    ? VISITED_HOVER
                    : isVisited
                      ? VISITED
                      : isHovered
                        ? UNVISITED_HOVER
                        : UNVISITED

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => code && onCountryClick(code)}
                    onMouseEnter={() => code && setHoveredCode(code)}
                    onMouseLeave={() => setHoveredCode(null)}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: BORDER,
                        strokeWidth: 0.4,
                        outline: 'none',
                        cursor: isVisited ? 'pointer' : 'default',
                        transition: 'fill 0.18s ease',
                      },
                      hover: {
                        fill: isVisited
                          ? (isSelected ? SELECTED : VISITED_HOVER)
                          : UNVISITED_HOVER,
                        stroke: BORDER,
                        strokeWidth: 0.4,
                        outline: 'none',
                        cursor: isVisited ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: isVisited ? SELECTED : UNVISITED,
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* Markers */}
          {visitedCountryCodes.map((code) => {
            const coords    = MARKERS[code]
            const isSelected = code === selectedCode
            const isHovered  = code === hoveredCode
            if (!coords) return null

            return (
              <Marker
                key={code}
                coordinates={coords}
                onClick={() => onCountryClick(code)}
                onMouseEnter={() => setHoveredCode(code)}
                onMouseLeave={() => setHoveredCode(null)}
              >
                {/* Pulse ring (selected or hovered) */}
                {(isSelected || isHovered) && (
                  <circle
                    r={isSelected ? 14 : 10}
                    fill={isSelected ? '#C4956A' : '#C4956A'}
                    fillOpacity={isSelected ? 0.25 : 0.18}
                    stroke="none"
                    className={isSelected ? 'map-pulse' : ''}
                  />
                )}

                {/* Outer ring */}
                <circle
                  r={isSelected ? 8 : 6}
                  fill={isSelected ? '#E8C49A' : '#C4956A'}
                  fillOpacity={0.25}
                  stroke={isSelected ? '#E8C49A' : '#C4956A'}
                  strokeWidth={1.5}
                  strokeOpacity={0.6}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                />

                {/* Center dot */}
                <circle
                  r={isSelected ? 4.5 : 3.5}
                  fill={isSelected ? '#E8C49A' : '#C4956A'}
                  stroke={OCEAN}
                  strokeWidth={1}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                />

                {/* Label — always visible for selected, hover for others */}
                {(isSelected || isHovered) && (
                  <text
                    y={-12}
                    textAnchor="middle"
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: isSelected ? '8px' : '7px',
                      fill: isSelected ? '#E8C49A' : '#FAF7F2',
                      fontWeight: isSelected ? '600' : '400',
                      opacity: isSelected ? 1 : 0.85,
                      pointerEvents: 'none',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    }}
                  >
                    {COUNTRY_NAMES[code]}
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
