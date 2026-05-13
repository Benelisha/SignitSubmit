import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from "three"
import { useFrame } from "@react-three/fiber"
import { easing } from "maath"
import { pages } from "./BookPages"
import { useBookPage } from "./BookPageContext"

// ---------------------------------------------------------------------------
// Geometry constants
// ---------------------------------------------------------------------------
const PAGE_WIDTH = 1.28
const PAGE_HEIGHT = 1.71 // 4:3 aspect ratio
const PAGE_DEPTH = 0.003
const PAGE_SEGMENTS = 30
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS

const EASING_FACTOR = 0.5
const EASING_FACTOR_FOLD = 0.3
const INSIDE_CURVE_STRENGTH = 0.18
const OUTSIDE_CURVE_STRENGTH = 0.05
const TURNING_CURVE_STRENGTH = 0.09

// ---------------------------------------------------------------------------
// Shared page geometry (built once, reused by every Page)
// ---------------------------------------------------------------------------
const pageGeometry = new BoxGeometry(PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH, PAGE_SEGMENTS, 2)
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0) // spine is at x=0

const _vertex = new Vector3()
const skinIndexes: number[] = []
const skinWeights: number[] = []

for (let i = 0; i < pageGeometry.attributes.position.count; i++) {
  _vertex.fromBufferAttribute(pageGeometry.attributes.position, i)
  const x = _vertex.x
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH))
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH
  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0)
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
}

pageGeometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndexes, 4))
pageGeometry.setAttribute("skinWeight", new Float32BufferAttribute(skinWeights, 4))

// ---------------------------------------------------------------------------
// Shared side / edge materials (indices 0-3)
// ---------------------------------------------------------------------------
const whiteColor = new Color("white")
const emissiveColor = new Color("orange")

const pageSideMaterials = [
  new MeshStandardMaterial({ color: whiteColor }),          // right edge
  new MeshStandardMaterial({ color: "#111" }),              // left edge (spine)
  new MeshStandardMaterial({ color: whiteColor }),          // top edge
  new MeshStandardMaterial({ color: whiteColor }),          // bottom edge
]

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
interface PageProps {
  number: number
  front: string   // hex color for the front face
  back: string    // hex color for the back face
  page: number    // currently-displayed page index (delayed)
  opened: boolean
  bookClosed: boolean
  [key: string]: unknown
}

const Page = ({ number, front, back, page, opened, bookClosed, ...props }: PageProps) => {
  const groupRef = useRef<any>(null)
  const skinnedMeshRef = useRef<SkinnedMesh | null>(null)
  const turnedAt = useRef(0)
  const lastOpened = useRef(opened)
  const [highlighted, setHighlighted] = useState(false)

  // Build the skinned mesh once per page (materials depend on front/back colors)
  const skinnedMesh = useMemo(() => {
    const bones: Bone[] = []
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone()
      if (i === 0) bone.position.x = 0
      else bone.position.x = SEGMENT_WIDTH
      if (i > 0) bones[i - 1].add(bone)
      bones.push(bone)
    }
    const skeleton = new Skeleton(bones)

    const materials = [
      ...pageSideMaterials,
      new MeshStandardMaterial({
        color: new Color(front),
        roughness: number === 0 ? 0.6 : 0.1,
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
      new MeshStandardMaterial({
        color: new Color(back),
        roughness: number === pages.length - 1 ? 0.6 : 0.1,
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
    ]

    const mesh = new SkinnedMesh(pageGeometry, materials)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.frustumCulled = false
    mesh.add(skeleton.bones[0])
    mesh.bind(skeleton)
    return mesh
  }, [front, back, number])

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) return

    const mats = skinnedMeshRef.current.material as MeshStandardMaterial[]
    const targetEmissive = highlighted ? 0.22 : 0
    mats[4].emissiveIntensity = mats[5].emissiveIntensity = MathUtils.lerp(
      mats[4].emissiveIntensity,
      targetEmissive,
      0.1,
    )

    if (lastOpened.current !== opened) {
      turnedAt.current = Date.now()
      lastOpened.current = opened
    }
    let turningTime = Math.min(400, Date.now() - turnedAt.current) / 400
    turningTime = Math.sin(turningTime * Math.PI)

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
    if (!bookClosed) targetRotation += MathUtils.degToRad(number * 0.8)

    const bones = skinnedMeshRef.current.skeleton.bones
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? groupRef.current : bones[i]

      const insideCurve = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0
      const outsideCurve = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0
      const turningIntensity = Math.sin(i * Math.PI * (1 / bones.length)) * turningTime

      let rotationAngle =
        INSIDE_CURVE_STRENGTH * insideCurve * targetRotation -
        OUTSIDE_CURVE_STRENGTH * outsideCurve * targetRotation +
        TURNING_CURVE_STRENGTH * turningIntensity * targetRotation

      let foldAngle = MathUtils.degToRad(Math.sin(targetRotation) * 2)

      if (bookClosed) {
        rotationAngle = i === 0 ? targetRotation : 0
        foldAngle = 0
      }

      easing.dampAngle(target.rotation, "y", rotationAngle, EASING_FACTOR, delta)

      const foldIntensity =
        i > 8 ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime : 0
      easing.dampAngle(
        target.rotation,
        "x",
        foldAngle * foldIntensity,
        EASING_FACTOR_FOLD,
        delta,
      )
    }
  })

  const { setPage } = useBookPage()

  return (
    <group
      {...props}
      ref={groupRef}
      onPointerEnter={(e: any) => {
        e.stopPropagation()
        setHighlighted(true)
      }}
      onPointerLeave={(e: any) => {
        e.stopPropagation()
        setHighlighted(false)
      }}
      onClick={(e: any) => {
        e.stopPropagation()
        setPage(opened ? number : number + 1)
        setHighlighted(false)
      }}
    >
      <primitive
        object={skinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Book component  – wraps all Page leaves
// ---------------------------------------------------------------------------
export const Book = ({ ...props }: any) => {
  const { page } = useBookPage()
  const [delayedPage, setDelayedPage] = useState(page)

  // Step one page at a time so the flip animation plays for every leaf
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const goToPage = () => {
      setDelayedPage((prev) => {
        if (prev === page) return prev
        timeout = setTimeout(goToPage, Math.abs(page - prev) > 2 ? 50 : 150)
        return page > prev ? prev + 1 : prev - 1
      })
    }
    goToPage()
    return () => clearTimeout(timeout)
  }, [page])

  return (
    <group {...props} rotation-y={Math.PI / 2}>
      {pages.map((pageData, index) => (
        <Page
          key={index}
          number={index}
          front={pageData.front}
          back={pageData.back}
          page={delayedPage}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === pages.length}
        />
      ))}
    </group>
  )
}
