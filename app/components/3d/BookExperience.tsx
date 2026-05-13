import React, { Suspense } from "react"
import { Float } from "@react-three/drei/native"
import { Book } from "./Book"

/**
 * 3-D scene setup: lighting + floating book.
 * Drop this inside a <Canvas> with shadows enabled.
 */
export const BookExperience = () => (
  <>
    {/* Soft ambient fill */}
    <ambientLight intensity={0.6} />

    {/* Key light */}
    <directionalLight
      position={[2, 5, 2]}
      intensity={2.5}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-bias={-0.0001}
    />

    {/* Gentle fill from below-left */}
    <directionalLight position={[-2, -1, 1]} intensity={0.4} />

    {/* Shadow receiver */}
    <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial transparent opacity={0.2} />
    </mesh>

    {/* Floating book */}
    <Float
      rotation-x={-Math.PI / 4}
      rotation-y={Math.PI}
      floatIntensity={0.6}
      speed={1.5}
      rotationIntensity={0.5}
    >
      <Suspense fallback={null}>
        <Book />
      </Suspense>
    </Float>
  </>
)
