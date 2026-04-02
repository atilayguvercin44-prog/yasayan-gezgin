'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function latLngTo3D(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ]
}

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  GBR: { lat: 54.5, lng: -2.5 },
  AZE: { lat: 40.4, lng: 47.5 },
  ROU: { lat: 45.9, lng: 25.0 },
  EGY: { lat: 26.8, lng: 30.8 },
  CZE: { lat: 49.8, lng: 15.5 },
  AUT: { lat: 47.5, lng: 14.5 },
  SVK: { lat: 48.7, lng: 19.5 },
  TUR: { lat: 39.0, lng: 35.2 },
  CHE: { lat: 46.8, lng: 8.2 },
  ITA: { lat: 41.9, lng: 12.6 },
  LIE: { lat: 47.2, lng: 9.5 },
  BHR: { lat: 26.0, lng: 50.6 },
  NLD: { lat: 52.3, lng: 5.3 },
  BEL: { lat: 50.8, lng: 4.5 },
  DEU: { lat: 51.2, lng: 10.5 },
  ESP: { lat: 40.4, lng: -3.7 },
  SWE: { lat: 60.1, lng: 18.6 },
  DNK: { lat: 56.3, lng: 9.5 },
  GRC: { lat: 39.1, lng: 22.0 },
  BGR: { lat: 42.7, lng: 25.5 },
  MKD: { lat: 41.6, lng: 21.7 },
  SRB: { lat: 44.0, lng: 21.0 },
  BIH: { lat: 43.9, lng: 17.7 },
  HRV: { lat: 45.1, lng: 15.2 },
  MNE: { lat: 42.7, lng: 19.4 },
  ALB: { lat: 41.2, lng: 20.2 },
}

interface MarkerProps {
  position: [number, number, number]
  isSelected: boolean
  onClick: () => void
}

function CountryMarker({ position, isSelected, onClick }: MarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return
    const targetScale = isSelected ? 1.9 : hovered ? 1.4 : 1
    const current = meshRef.current.scale.x
    meshRef.current.scale.setScalar(current + (targetScale - current) * 0.12)
    if (isSelected) {
      matRef.current.emissiveIntensity = 1.2 + Math.sin(clock.elapsedTime * 4) * 0.7
    } else {
      matRef.current.emissiveIntensity = hovered ? 1.0 : 0.35
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <sphereGeometry args={[0.022, 10, 10]} />
      <meshStandardMaterial
        ref={matRef}
        color="#C4956A"
        emissive="#C4956A"
        emissiveIntensity={0.35}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  )
}

interface GlobeSceneProps {
  visitedCountryCodes: string[]
  selectedCode: string | null
  onCountryClick: (code: string) => void
}

function GlobeScene({ visitedCountryCodes, selectedCode, onCountryClick }: GlobeSceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <pointLight position={[-4, -2, -4]} intensity={0.4} color="#C4956A" />

      {/* Ana küre */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#0F1923" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Enlem/boylam ızgarası */}
      <mesh>
        <sphereGeometry args={[1.003, 24, 24]} />
        <meshBasicMaterial color="#1E3A50" wireframe transparent opacity={0.18} />
      </mesh>

      {/* Atmosfer ışıması */}
      <mesh>
        <sphereGeometry args={[1.09, 32, 32]} />
        <meshBasicMaterial
          color="#C4956A"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ülke noktaları */}
      {visitedCountryCodes.map((code) => {
        const data = COUNTRY_COORDS[code]
        if (!data) return null
        const pos = latLngTo3D(data.lat, data.lng, 1.04)
        return (
          <CountryMarker
            key={code}
            position={pos}
            isSelected={selectedCode === code}
            onClick={() => onCountryClick(code)}
          />
        )
      })}

      <OrbitControls
        enableZoom
        minDistance={1.8}
        maxDistance={4.5}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

interface Props {
  visitedCountryCodes: string[]
  selectedCode: string | null
  onCountryClick: (code: string) => void
}

export default function Globe3DInner({ visitedCountryCodes, selectedCode, onCountryClick }: Props) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Canvas
        camera={{ position: [0, 0.5, 2.8], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <GlobeScene
          visitedCountryCodes={visitedCountryCodes}
          selectedCode={selectedCode}
          onCountryClick={onCountryClick}
        />
      </Canvas>
    </div>
  )
}
