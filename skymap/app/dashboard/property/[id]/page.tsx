"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Suspense, use, useState } from "react"
import useSWR from "swr"
import { RoomSelector } from "@/components/dashboard/room-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetcher } from "@/lib/api"
import type { Property, PropertyDimensions, PropertyTour, VastuReportData } from "@/lib/types"

// The 3D/WebGL viewer must never run on the server.
const PanoramaViewer = dynamic(
  () => import("@/components/dashboard/panorama-viewer").then((m) => m.PanoramaViewer),
  { ssr: false, loading: () => <div className="glass flex aspect-video items-center justify-center rounded-3xl text-sm text-muted-foreground">Loading 360° viewer…</div> }
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
  const initialTab = searchParams.get("tab") || "overview"

  const { data: property } = useSWR<Property>(`/api/property/${id}`, fetcher)
  const { data: tour, error: tourError, isLoading: tourLoading } = useSWR<PropertyTour>(`/api/property/${id}/tour`, fetcher)
  const { data: vastu, error: vastuError, isLoading: vastuLoading } = useSWR<VastuReportData>(`/api/property/${id}/vastu`, fetcher)
  const { data: dimensions, error: dimensionsError, isLoading: dimensionsLoading } = useSWR<PropertyDimensions>(`/api/property/${id}/dimensions`, fetcher)

  // Shared between the 360° Tour and Dimensions tabs so switching rooms in
  // one keeps the other in sync.
  const [activeRoomIndex, setActiveRoomIndex] = useState(0)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow">Property</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{property?.name || "Loading…"}</h1>
        {property && <p className="mt-2 text-muted-foreground">{property.location} · {property.sizeSqft.toLocaleString()} sq ft</p>}
      </div>

      <Tabs defaultValue={initialTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tour">360° Tour</TabsTrigger>
          <TabsTrigger value="vastu">Vastu Report</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {property ? (
            <div className="glass overflow-hidden rounded-3xl">
              <div className="relative aspect-video">
                <Image src={property.coverImage} alt={property.name} fill className="object-cover" sizes="100vw" />
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-3">
                <div><p className="text-xs text-muted-foreground">Size</p><p className="mt-1 font-medium">{property.sizeSqft.toLocaleString()} sq ft</p></div>
                <div><p className="text-xs text-muted-foreground">Location</p><p className="mt-1 font-medium">{property.location}</p></div>
                <div><p className="text-xs text-muted-foreground">Builder</p><p className="mt-1 font-medium">{property.builderName || "—"}</p></div>
              </div>
            </div>
          ) : (
            <div className="glass h-64 animate-pulse rounded-3xl" />
          )}
        </TabsContent>

        <TabsContent value="tour" className="mt-6">
          {tourLoading && <div className="glass flex aspect-video items-center justify-center rounded-3xl text-sm text-muted-foreground">Loading tour…</div>}
          {tourError && !tourLoading && <ErrorState endpoint={`/api/property/${id}/tour`} />}
          {!tourLoading && !tourError && tour && (
            <div className="flex flex-col gap-4">
              <PanoramaViewer scenes={tour.scenes} activeIndex={activeRoomIndex} onChangeIndex={setActiveRoomIndex} />
              <RoomSelector rooms={tour.scenes.map((s) => s.room)} activeIndex={activeRoomIndex} onSelect={setActiveRoomIndex} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="vastu" className="mt-6">
          {vastuLoading && <div className="glass h-64 animate-pulse rounded-3xl" />}
          {vastuError && !vastuLoading && <ErrorState endpoint={`/api/property/${id}/vastu`} />}
          {!vastuLoading && !vastuError && vastu && <VastuReport data={vastu} />}
        </TabsContent>

        <TabsContent value="dimensions" className="mt-6">
          {dimensionsLoading && <div className="glass h-64 animate-pulse rounded-3xl" />}
          {dimensionsError && !dimensionsLoading && <ErrorState endpoint={`/api/property/${id}/dimensions`} />}
          {!dimensionsLoading && !dimensionsError && dimensions && dimensions.rooms.length > 0 && (
            <div className="flex flex-col gap-4">
              <RoomSelector
                rooms={dimensions.rooms.map((r) => r.name)}
                activeIndex={Math.min(activeRoomIndex, dimensions.rooms.length - 1)}
                onSelect={setActiveRoomIndex}
              />
              <DimensionsView room={dimensions.rooms[Math.min(activeRoomIndex, dimensions.rooms.length - 1)]} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
