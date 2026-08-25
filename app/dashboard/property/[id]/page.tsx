"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, use, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { ArrowLeft, Bookmark, Compass, Eye, LayoutDashboard, Maximize, Move3d, Ruler, Share2, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { RoomSelector } from "@/components/dashboard/room-selector"
import { PropertySpecifications } from "@/components/dashboard/property-specifications"
import { PropertyHighlights } from "@/components/dashboard/property-highlights"
import { PropertyRooms } from "@/components/dashboard/property-rooms"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetcher, saveProperty, unsaveProperty } from "@/lib/api"
import type { Property, PropertyDimensions, PropertyFieldVisibility, PropertyShare, PropertyTour, VastuReportData } from "@/lib/types"

const PanoramaViewer = dynamic(
  () => import("@/components/dashboard/panorama-viewer").then((m) => m.PanoramaViewer),
  { ssr: false, loading: () => <div className="glass flex aspect-video items-center justify-center rounded-3xl text-sm text-muted-foreground">Loading 360 viewer...</div> }
)
const VastuReport = dynamic(
  () => import("@/components/dashboard/vastu-report").then((m) => m.VastuReport),
  { ssr: false }
)
const DimensionsView = dynamic(
  () => import("@/components/dashboard/dimensions-view").then((m) => m.DimensionsView),
  { ssr: false }
)

function ErrorState({ endpoint }: { endpoint: string }) {
  return (
    <div className="glass flex flex-col items-center gap-2 rounded-3xl p-12 text-center">
      <p className="font-medium">This isn&apos;t available yet</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        The backend endpoint for <code className="rounded bg-accent px-1.5 py-0.5">{endpoint}</code> isn&apos;t connected yet.
      </p>
    </div>
  )
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="glass h-64 animate-pulse rounded-3xl" />}>
      <PropertyDetail params={params} />
    </Suspense>
  )
}

function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const requestedTab = searchParams.get("tab")
  const initialTab = requestedTab === "tour" ? "tour360" : requestedTab || "overview"
  const pageRef = useRef<HTMLDivElement>(null)

  const { data: property, mutate: mutateProperty } = useSWR<Property>(`/api/property/${id}`, fetcher)
  const { data: tour, error: tourError, isLoading: tourLoading } = useSWR<PropertyTour>(`/api/property/${id}/tour`, fetcher)
  const { data: vastu, error: vastuError, isLoading: vastuLoading } = useSWR<VastuReportData>(`/api/property/${id}/vastu`, fetcher)
  const { data: dimensions, error: dimensionsError, isLoading: dimensionsLoading } = useSWR<PropertyDimensions>(`/api/property/${id}/dimensions`, fetcher)
  const { data: allShares } = useSWR<PropertyShare[]>("/api/share-history", fetcher)
  const propertyShares = (allShares || []).filter((s) => s.propertyId === id)

  const [activeTab, setActiveTab] = useState(initialTab)
  const [previewShareId, setPreviewShareId] = useState<string | null>(null)
  const [activeRoomIndex, setActiveRoomIndex] = useState(0)

  const previewShare = previewShareId ? propertyShares.find((s) => s.id === previewShareId) || null : null
  const visibility: PropertyFieldVisibility | null = useMemo(() => {
    if (previewShare) return previewShare.visibility
    return property ? property.defaultVisibility : null
  }, [previewShare, property])

  const visibleRooms = useMemo(() => {
    if (!property?.rooms || !visibility) return []
    return property.rooms.filter((room) => visibility.roomIds.includes(room.id))
  }, [property, visibility])
  const visibleRoomNames = new Set(visibleRooms.map((room) => room.name))
  const visibleTourScenes = tour?.scenes.filter((scene) => visibleRoomNames.has(scene.room)) || []
  const visibleDimensionRooms = dimensions?.rooms.filter((room) => visibleRoomNames.has(room.name)) || []

  useEffect(() => {
    if (!visibility) return
    const nextTab = visibility.sections[activeTab as keyof PropertyFieldVisibility["sections"]] ? activeTab : "overview"
    if (nextTab !== activeTab) setActiveTab(nextTab)
  }, [activeTab, visibility])

  function openTourForRoom(roomName: string) {
    const idx = visibleTourScenes.findIndex((s) => s.room === roomName)
    if (idx >= 0) setActiveRoomIndex(idx)
    setActiveTab("tour360")
  }

  function openDimensionsForRoom(roomName: string) {
    const idx = visibleDimensionRooms.findIndex((r) => r.name === roomName)
    if (idx >= 0) setActiveRoomIndex(idx)
    setActiveTab("dimensions")
  }

  async function toggleSave() {
    if (!property) return
    const next = !property.saved
    mutateProperty({ ...property, saved: next }, false)
    try {
      if (next) await saveProperty(property.id)
      else await unsaveProperty(property.id)
    } finally {
      mutateProperty()
    }
  }

  function toggleFullscreen() {
    if (!pageRef.current) return
    if (document.fullscreenElement) document.exitFullscreen()
    else pageRef.current.requestFullscreen()
  }

  return (
    <div ref={pageRef} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/dashboard" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to My Properties
          </Link>
          <p className="eyebrow">Property</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{property?.name || "Loading..."}</h1>
          {property && <p className="mt-2 text-muted-foreground">{property.location} · {property.sizeSqft.toLocaleString()} sq ft</p>}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {propertyShares.length > 0 && (
            <div className="relative">
              <select
                value={previewShareId ?? ""}
                onChange={(e) => setPreviewShareId(e.target.value || null)}
                className="h-9 appearance-none rounded-lg border border-border bg-background pl-8 pr-8 text-sm outline-none focus-visible:border-ring"
                aria-label="Preview as client"
              >
                <option value="">Full access (you)</option>
                {propertyShares.map((s) => (
                  <option key={s.id} value={s.id}>Preview as {s.recipientName}</option>
                ))}
              </select>
              <Eye className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          )}
          <Button variant="outline" size="icon" onClick={toggleFullscreen} aria-label="Fullscreen">
            <Maximize />
          </Button>
          {property && (
            <Button variant="outline" size="icon" onClick={toggleSave} aria-label={property.saved ? "Remove from saved" : "Save property"}>
              <Bookmark className={property.saved ? "fill-primary text-primary" : ""} />
            </Button>
          )}
          {property && (
            <Link href={`/dashboard/property/${property.id}/share`} className={buttonVariants()}>
              <Share2 data-icon="inline-start" /> Share
            </Link>
          )}
        </div>
      </div>

      {previewShare && (
        <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <span className="flex items-center gap-2">
            <Eye className="size-4 text-primary" />
            Previewing exactly what <strong>{previewShare.recipientName}</strong> sees with their shared link.
          </span>
          <button onClick={() => setPreviewShareId(null)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <X className="size-3.5" /> Exit preview
          </button>
        </div>
      )}

      <Tabs orientation="vertical" value={activeTab} onValueChange={(v) => setActiveTab(v as string)} className="flex-col sm:flex-row">
        <TabsList className="w-full shrink-0 sm:w-52">
          {visibility?.sections.overview && <TabsTrigger value="overview"><LayoutDashboard data-icon="inline-start" /> Overview</TabsTrigger>}
          {visibility?.sections.tour360 && <TabsTrigger value="tour360"><Move3d data-icon="inline-start" /> 360 Tour</TabsTrigger>}
          {visibility?.sections.vastu && <TabsTrigger value="vastu"><Compass data-icon="inline-start" /> Vastu Report</TabsTrigger>}
          {visibility?.sections.dimensions && <TabsTrigger value="dimensions"><Ruler data-icon="inline-start" /> Dimensions</TabsTrigger>}
        </TabsList>

        {visibility?.sections.overview && (
          <TabsContent value="overview" className="mt-6 min-w-0 flex-1 sm:mt-0 sm:pl-8">
            {property ? (
              <div className="flex flex-col gap-6">
                <div className="glass overflow-hidden rounded-3xl">
                  <div className="relative aspect-video">
                    <Image src={property.coverImage} alt={property.name} fill className="object-cover" sizes="100vw" priority />
                  </div>
                  <div className="grid gap-4 p-6 sm:grid-cols-3">
                    <div><p className="text-xs text-muted-foreground">Size</p><p className="mt-1 font-medium">{property.sizeSqft.toLocaleString()} sq ft</p></div>
                    <div><p className="text-xs text-muted-foreground">Location</p><p className="mt-1 font-medium">{property.location}</p></div>
                    <div><p className="text-xs text-muted-foreground">Builder</p><p className="mt-1 font-medium">{property.builderName || "Not listed"}</p></div>
                  </div>
                </div>

                {property.highlights && <PropertyHighlights highlights={property.highlights} visibleHighlightIds={visibility.highlightIds} />}
                {property.rooms && <PropertyRooms rooms={property.rooms} visibleRoomIds={visibility.roomIds} onOpenTour={openTourForRoom} onOpenDimensions={openDimensionsForRoom} />}
                {property.specifications && <PropertySpecifications specs={property.specifications} visibleSpecFields={visibility.specFields} visibleAmenities={visibility.amenities} />}
              </div>
            ) : (
              <div className="glass h-64 animate-pulse rounded-3xl" />
            )}
          </TabsContent>
        )}

        {visibility?.sections.tour360 && (
          <TabsContent value="tour360" className="mt-6 min-w-0 flex-1 sm:mt-0 sm:pl-8">
            {tourLoading && <div className="glass flex aspect-video items-center justify-center rounded-3xl text-sm text-muted-foreground">Loading tour...</div>}
            {tourError && !tourLoading && <ErrorState endpoint={`/api/property/${id}/tour`} />}
            {!tourLoading && !tourError && visibleTourScenes.length > 0 && (
              <div className="flex flex-col gap-4">
                <PanoramaViewer scenes={visibleTourScenes} activeIndex={Math.min(activeRoomIndex, visibleTourScenes.length - 1)} onChangeIndex={setActiveRoomIndex} />
                <RoomSelector rooms={visibleTourScenes.map((s) => s.room)} activeIndex={Math.min(activeRoomIndex, visibleTourScenes.length - 1)} onSelect={setActiveRoomIndex} />
              </div>
            )}
          </TabsContent>
        )}

        {visibility?.sections.vastu && (
          <TabsContent value="vastu" className="mt-6 min-w-0 flex-1 sm:mt-0 sm:pl-8">
            {vastuLoading && <div className="glass h-64 animate-pulse rounded-3xl" />}
            {vastuError && !vastuLoading && <ErrorState endpoint={`/api/property/${id}/vastu`} />}
            {!vastuLoading && !vastuError && vastu && <VastuReport data={vastu} />}
          </TabsContent>
        )}

        {visibility?.sections.dimensions && (
          <TabsContent value="dimensions" className="mt-6 min-w-0 flex-1 sm:mt-0 sm:pl-8">
            {dimensionsLoading && <div className="glass h-64 animate-pulse rounded-3xl" />}
            {dimensionsError && !dimensionsLoading && <ErrorState endpoint={`/api/property/${id}/dimensions`} />}
            {!dimensionsLoading && !dimensionsError && visibleDimensionRooms.length > 0 && (
              <div className="flex flex-col gap-4">
                <RoomSelector
                  rooms={visibleDimensionRooms.map((r) => r.name)}
                  activeIndex={Math.min(activeRoomIndex, visibleDimensionRooms.length - 1)}
                  onSelect={setActiveRoomIndex}
                />
                <DimensionsView room={visibleDimensionRooms[Math.min(activeRoomIndex, visibleDimensionRooms.length - 1)]} />
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
