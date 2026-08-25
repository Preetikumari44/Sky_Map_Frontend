"use client"

import { use } from "react"
import { SharePropertyPage } from "@/components/dashboard/share-property-page"

export default function DashboardSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <SharePropertyPage propertyId={id} backHref={`/dashboard/property/${id}`} />
}
