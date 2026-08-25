"use client"

import useSWR from "swr"
import { HomeIcon } from "lucide-react"
import { PropertyCard } from "@/components/dashboard/property-card"
import { fetcher, saveProperty, unsaveProperty } from "@/lib/api"
import type { Property } from "@/lib/types"

export default function MyPropertiesPage() {
  const { data: properties, error, isLoading, mutate } = useSWR<Property[]>(
    "/api/user/properties",
    fetcher
  )

  async function onToggleSave(id: string) {
    const current = properties?.find((p) => p.id === id)
    if (!current) return
    // Optimistic update
    mutate(
      properties?.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)),
      false
    )
    try {
      if (current.saved) await unsaveProperty(id)
      else await saveProperty(id)
    } finally {
      mutate()
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My properties</h1>
        <p className="mt-2 text-muted-foreground">
          Properties your agent or builder has shared with you.
        </p>
      </div>

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass h-80 animate-pulse rounded-3xl" />
          ))}
        </div>
      )}

      {error && !isLoading && (
        <div className="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center">
          <p className="font-medium">Couldn&apos;t load your properties</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            The backend endpoint for <code className="rounded bg-accent px-1.5 py-0.5">/api/user/properties</code> isn&apos;t connected yet.
          </p>
        </div>
      )}

      {!isLoading && !error && properties?.length === 0 && (
        <div className="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-accent">
            <HomeIcon className="size-5 text-muted-foreground" />
          </span>
          <p className="font-medium">No properties yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Ask your agent or builder to share a property with you and it&apos;ll show up here.
          </p>
        </div>
      )}

      {!isLoading && !error && properties && properties.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} onToggleSave={onToggleSave} />
          ))}
        </div>
      )}
    </div>
  )
}
