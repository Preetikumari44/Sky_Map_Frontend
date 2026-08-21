"use client"

import Image from "next/image"
import { useState } from "react"
import { Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RoomDimensions } from "@/lib/types"

const EDGE_POSITION: Record<RoomDimensions["dimensionLabels"][number]["edge"], string> = {
  top: "left-1/2 top-3 -translate-x-1/2",
  bottom: "bottom-3 left-1/2 -translate-x-1/2",
  left: "left-3 top-1/2 -translate-y-1/2",
  right: "right-3 top-1/2 -translate-y-1/2",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-medium">{value}</p>
    </div>
  )
}

export function DimensionsView({ room }: { room: RoomDimensions }) {
  const [showOverlay, setShowOverlay] = useState(true)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card sm:aspect-video">
        <Image src={room.floorPlanImage} alt={`${room.name} floor plan`} fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-background/25" />

        {showOverlay && (
          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            {room.dimensionLabels.map((label) => (
              <span
                key={`${label.edge}-${label.text}`}
                className={`absolute rounded-md border border-border bg-background/90 px-2.5 py-1 text-xs font-medium tracking-tight text-foreground ${EDGE_POSITION[label.edge]}`}
              >
                {label.text}
              </span>
            ))}
            <span className="absolute bottom-3 right-3 rounded-md border border-primary/30 bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
              {room.areaSqFt.toLocaleString()} sq ft
            </span>
          </div>
        )}

        <div className="glass absolute left-4 top-4 rounded-xl px-4 py-3">
          <p className="text-xs text-muted-foreground">Floor plan</p>
          <p className="font-medium">{room.name}</p>
        </div>

        <div className="absolute right-4 top-4">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setShowOverlay((v) => !v)}
            aria-label={showOverlay ? "Hide dimension overlay" : "Show dimension overlay"}
          >
            <Ruler />
          </Button>
        </div>
      </div>

      {/* On small screens, labels are shown as a stacked list instead of overlaying the image. */}
      <div className="glass grid grid-cols-2 gap-4 rounded-2xl p-4 text-sm sm:hidden">
        {room.dimensionLabels.map((label) => (
          <div key={`${label.edge}-${label.text}`}>
            <p className="text-xs capitalize text-muted-foreground">{label.edge} edge</p>
            <p className="font-medium">{label.text}</p>
          </div>
        ))}
        <div>
          <p className="text-xs text-muted-foreground">Area</p>
          <p className="font-medium">{room.areaSqFt.toLocaleString()} sq ft</p>
        </div>
      </div>

      <div className="glass grid grid-cols-2 gap-4 rounded-2xl p-5 sm:grid-cols-4">
        <Metric label="Width" value={`${room.widthFt}'`} />
        <Metric label="Length" value={`${room.lengthFt}'`} />
        <Metric label="Ceiling height" value={room.ceilingHeightFt > 0 ? `${room.ceilingHeightFt}'` : "Open air"} />
        <Metric label="Total area" value={`${room.areaSqFt.toLocaleString()} sq ft`} />
      </div>
    </div>
  )
}
