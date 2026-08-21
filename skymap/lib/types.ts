// Shared types for the SkyMap buyer dashboard.
// These describe the JSON shape the backend API is expected to return.
// No backend logic lives here — only the contract the frontend fetches against.

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
}

export type ProcessingStatus = "ready" | "processing" | "not_started"

export interface Property {
  id: string
  name: string
  location: string
  coverImage: string
  sizeSqft: number
  bedrooms?: number
  builderName?: string
  tourStatus: ProcessingStatus
  vastuStatus: ProcessingStatus
  saved?: boolean
  sharedOn?: string // ISO date the property was shared with this buyer
}

export interface TourHotspot {
  label: string
  targetRoom: string
  // Position on the equirectangular sphere, in degrees (yaw 0-360, pitch -90..90)
  yaw: number
  pitch: number
}

export interface TourScene {
  room: string
  image360Url: string
  hotspots: TourHotspot[]
}

export interface PropertyTour {
  propertyId: string
  scenes: TourScene[]
}

export type VastuStatus = "ideal" | "acceptable" | "not_recommended"

export interface VastuRoomEntry {
  name: string
  currentDirection: string
  idealDirections: string[]
  status: VastuStatus
  note: string
}

export interface VastuElementBalance {
  earth: number
  water: number
  fire: number
  air: number
  space: number
}

export interface DimensionLabel {
  edge: "top" | "bottom" | "left" | "right" | "center"
  text: string
}

export interface RoomDimensions {
  name: string
  floorPlanImage: string
  widthFt: number
  lengthFt: number
  ceilingHeightFt: number
  areaSqFt: number
  dimensionLabels: DimensionLabel[]
}

export interface PropertyDimensions {
  propertyId: string
  rooms: RoomDimensions[]
}

export interface VastuReportData {
  propertyId: string
  overallScore: number
  entranceDirection: string
  rooms: VastuRoomEntry[]
  remedies: string[]
  elementBalance: VastuElementBalance
}
