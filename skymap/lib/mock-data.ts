// DEMO DATA ONLY.
//
// This is an in-memory mock data store used by the route handlers under
// app/api/**. It exists purely so the dashboard has something real to render
// while a real backend is being built. Replace every route in app/api with
// calls to your actual backend/database, then delete this file.

import type {
  Property,
  PropertyDimensions,
  PropertyTour,
  User,
  VastuReportData,
} from "./types"

export let demoUser: User = {
  id: "user_demo_1",
  name: "Preeti Kumari",
  email: "buyer@example.com",
  phone: "+91 90000 00000",
}

export function updateDemoUser(patch: Partial<Pick<User, "name" | "phone">>) {
  demoUser = { ...demoUser, ...patch }
  return demoUser
}

export const demoProperties: Property[] = [
  {
    id: "glass-house",
    name: "Glass House",
    location: "Malibu, CA",
    coverImage: "/images/skymap-hero.png",
    sizeSqft: 4120,
    bedrooms: 3,
    builderName: "Horizon Builders",
    tourStatus: "ready",
    vastuStatus: "ready",
    saved: false,
    sharedOn: "2026-08-02",
  },
  {
    id: "canyon-residence",
    name: "Canyon Residence",
    location: "Los Angeles, CA",
    coverImage: "/images/skymap-interior.png",
    sizeSqft: 4820,
    bedrooms: 4,
    builderName: "Canyon Realty Group",
    tourStatus: "ready",
    vastuStatus: "ready",
    saved: true,
    sharedOn: "2026-07-18",
  },
  {
    id: "ocean-villa",
    name: "Ocean Villa",
    location: "Laguna Beach, CA",
    coverImage: "/images/skymap-staged.png",
    sizeSqft: 5390,
    bedrooms: 5,
    builderName: "Shoreline Developers",
    tourStatus: "processing",
    vastuStatus: "ready",
    saved: false,
    sharedOn: "2026-08-11",
  },
]

const ROOM_IMAGES = {
  livingRoom: "/images/skymap-interior.png",
  kitchen: "/images/skymap-staged.png",
  bedroom: "/images/skymap-empty.png",
  terrace: "/images/skymap-hero.png",
} as const

const demoTours: Record<string, PropertyTour> = {
  "glass-house": {
    propertyId: "glass-house",
    scenes: [
      { room: "Living room", image360Url: ROOM_IMAGES.livingRoom, hotspots: [
        { label: "To kitchen", targetRoom: "Kitchen", yaw: 90, pitch: 0 },
        { label: "To terrace", targetRoom: "Terrace", yaw: 260, pitch: -2 },
      ] },
      { room: "Kitchen", image360Url: ROOM_IMAGES.kitchen, hotspots: [
        { label: "To bedroom", targetRoom: "Bedroom", yaw: 140, pitch: 0 },
        { label: "To living room", targetRoom: "Living room", yaw: 300, pitch: 0 },
      ] },
      { room: "Bedroom", image360Url: ROOM_IMAGES.bedroom, hotspots: [
        { label: "To terrace", targetRoom: "Terrace", yaw: 40, pitch: -1 },
        { label: "To kitchen", targetRoom: "Kitchen", yaw: 210, pitch: 0 },
      ] },
      { room: "Terrace", image360Url: ROOM_IMAGES.terrace, hotspots: [
        { label: "To living room", targetRoom: "Living room", yaw: 100, pitch: 0 },
      ] },
    ],
  },
  "canyon-residence": {
    propertyId: "canyon-residence",
    scenes: [
      { room: "Great room", image360Url: ROOM_IMAGES.livingRoom, hotspots: [
        { label: "To chef kitchen", targetRoom: "Chef kitchen", yaw: 80, pitch: 0 },
        { label: "To primary suite", targetRoom: "Primary suite", yaw: 250, pitch: -1 },
      ] },
      { room: "Chef kitchen", image360Url: ROOM_IMAGES.kitchen, hotspots: [
        { label: "To great room", targetRoom: "Great room", yaw: 20, pitch: 0 },
        { label: "To terrace", targetRoom: "Terrace", yaw: 190, pitch: 0 },
      ] },
      { room: "Primary suite", image360Url: ROOM_IMAGES.bedroom, hotspots: [
        { label: "To great room", targetRoom: "Great room", yaw: 60, pitch: 0 },
      ] },
      { room: "Terrace", image360Url: ROOM_IMAGES.terrace, hotspots: [
        { label: "To chef kitchen", targetRoom: "Chef kitchen", yaw: 300, pitch: 0 },
      ] },
    ],
  },
  "ocean-villa": {
    propertyId: "ocean-villa",
    scenes: [
      { room: "Living room", image360Url: ROOM_IMAGES.livingRoom, hotspots: [
        { label: "To terrace", targetRoom: "Terrace", yaw: 150, pitch: 0 },
      ] },
      { room: "Terrace", image360Url: ROOM_IMAGES.terrace, hotspots: [
        { label: "To living room", targetRoom: "Living room", yaw: 330, pitch: 0 },
      ] },
    ],
  },
}

const demoVastuReports: Record<string, VastuReportData> = {
  "glass-house": {
    propertyId: "glass-house",
    overallScore: 88,
    entranceDirection: "NE",
    rooms: [
      { name: "Main entrance", currentDirection: "NE", idealDirections: ["N", "NE", "E"], status: "ideal", note: "North-east entrances are considered highly auspicious, inviting positive energy and morning light." },
      { name: "Kitchen", currentDirection: "SE", idealDirections: ["SE"], status: "ideal", note: "South-east placement aligns with Agni (fire element) — ideal for a kitchen." },
      { name: "Master bedroom", currentDirection: "SW", idealDirections: ["SW"], status: "ideal", note: "South-west is the most stable direction for the primary bedroom." },
      { name: "Pooja/prayer room", currentDirection: "NW", idealDirections: ["NE", "N", "E"], status: "not_recommended", note: "A north-west prayer room can feel unsettled — a north-east placement is traditionally preferred." },
      { name: "Toilet", currentDirection: "NE", idealDirections: ["NW", "SE"], status: "not_recommended", note: "Toilets in the north-east are generally avoided as this zone is reserved for positive energy." },
      { name: "Staircase", currentDirection: "S", idealDirections: ["S", "SW", "W"], status: "acceptable", note: "A south-facing staircase is workable, though south-west is slightly preferred for grounding energy." },
    ],
    remedies: [
      "Place a small mirror on the outer wall of the north-west prayer room to symbolically redirect energy toward the north-east.",
      "Keep the north-east toilet door closed at all times and add an exhaust fan to maintain airflow.",
      "Introduce a potted tulsi (holy basil) plant near the main entrance to reinforce the positive north-east energy.",
    ],
    elementBalance: { earth: 82, water: 74, fire: 91, air: 68, space: 79 },
  },
  "canyon-residence": {
    propertyId: "canyon-residence",
    overallScore: 94,
    entranceDirection: "N",
    rooms: [
      { name: "Main entrance", currentDirection: "N", idealDirections: ["N", "NE", "E"], status: "ideal", note: "North-facing entrances are associated with wealth and opportunity (ruled by Kubera)." },
      { name: "Chef kitchen", currentDirection: "SE", idealDirections: ["SE"], status: "ideal", note: "Perfectly aligned with the fire element for cooking spaces." },
      { name: "Primary suite", currentDirection: "SW", idealDirections: ["SW"], status: "ideal", note: "South-west bedroom supports restful sleep and stability." },
      { name: "Study room", currentDirection: "W", idealDirections: ["N", "E", "NE"], status: "acceptable", note: "A west-facing study is workable for afternoon focus, though a north or east desk orientation is traditionally favoured." },
      { name: "Toilet", currentDirection: "NW", idealDirections: ["NW", "SE"], status: "ideal", note: "North-west is a well-regarded location for toilets — good drainage of negative energy." },
      { name: "Staircase", currentDirection: "SW", idealDirections: ["S", "SW", "W"], status: "ideal", note: "South-west staircases add grounding weight to the structure." },
    ],
    remedies: [
      "For the study room, position the desk so you face north or east while working to improve focus.",
      "Use warm, earthy tones in the south-west primary suite to reinforce its grounding direction.",
    ],
    elementBalance: { earth: 90, water: 85, fire: 88, air: 80, space: 92 },
  },
  "ocean-villa": {
    propertyId: "ocean-villa",
    overallScore: 76,
    entranceDirection: "W",
    rooms: [
      { name: "Main entrance", currentDirection: "W", idealDirections: ["N", "NE", "E"], status: "acceptable", note: "West-facing entrances are workable with the right door placement, though north/east is generally preferred." },
      { name: "Kitchen", currentDirection: "NW", idealDirections: ["SE"], status: "not_recommended", note: "A north-west kitchen may cause the household to feel restless — traditionally the south-east is preferred." },
      { name: "Master bedroom", currentDirection: "S", idealDirections: ["SW"], status: "acceptable", note: "South is a workable alternative to the ideal south-west, offering reasonable stability." },
      { name: "Toilet", currentDirection: "SE", idealDirections: ["NW", "SE"], status: "ideal", note: "South-east toilet placement is acceptable per Vastu Shastra." },
      { name: "Staircase", currentDirection: "NE", idealDirections: ["S", "SW", "W"], status: "not_recommended", note: "A north-east staircase can block the flow of positive energy into the home." },
    ],
    remedies: [
      "If renovating, consider relocating the kitchen stove to the south-east corner of the current kitchen footprint.",
      "Add bright lighting and a yellow or earthy colour palette near the north-east staircase to soften its effect.",
      "Place a Vastu pyramid or brass item near the main entrance to balance the west-facing orientation.",
    ],
    elementBalance: { earth: 70, water: 65, fire: 60, air: 74, space: 71 },
  },
}

const demoDimensions: Record<string, PropertyDimensions> = {
  "glass-house": {
    propertyId: "glass-house",
    rooms: [
      {
        name: "Living room",
        floorPlanImage: ROOM_IMAGES.livingRoom,
        widthFt: 18, lengthFt: 14, ceilingHeightFt: 10, areaSqFt: 252,
        dimensionLabels: [
          { edge: "top", text: "18'-0\" (5.5m)" },
          { edge: "left", text: "14'-0\" (4.3m)" },
        ],
      },
      {
        name: "Kitchen",
        floorPlanImage: ROOM_IMAGES.kitchen,
        widthFt: 14, lengthFt: 12, ceilingHeightFt: 10, areaSqFt: 168,
        dimensionLabels: [
          { edge: "top", text: "14'-0\" (4.3m)" },
          { edge: "left", text: "12'-0\" (3.7m)" },
        ],
      },
      {
        name: "Bedroom",
        floorPlanImage: ROOM_IMAGES.bedroom,
        widthFt: 15, lengthFt: 13, ceilingHeightFt: 9, areaSqFt: 195,
        dimensionLabels: [
          { edge: "top", text: "15'-0\" (4.6m)" },
          { edge: "left", text: "13'-0\" (4.0m)" },
        ],
      },
      {
        name: "Terrace",
        floorPlanImage: ROOM_IMAGES.terrace,
        widthFt: 22, lengthFt: 10, ceilingHeightFt: 0, areaSqFt: 220,
        dimensionLabels: [
          { edge: "top", text: "22'-0\" (6.7m)" },
          { edge: "left", text: "10'-0\" (3.0m)" },
        ],
      },
    ],
  },
  "canyon-residence": {
    propertyId: "canyon-residence",
    rooms: [
      {
        name: "Great room",
        floorPlanImage: ROOM_IMAGES.livingRoom,
        widthFt: 24, lengthFt: 18, ceilingHeightFt: 12, areaSqFt: 432,
        dimensionLabels: [
          { edge: "top", text: "24'-0\" (7.3m)" },
          { edge: "left", text: "18'-0\" (5.5m)" },
        ],
      },
      {
        name: "Chef kitchen",
        floorPlanImage: ROOM_IMAGES.kitchen,
        widthFt: 16, lengthFt: 14, ceilingHeightFt: 10, areaSqFt: 224,
        dimensionLabels: [
          { edge: "top", text: "16'-0\" (4.9m)" },
          { edge: "left", text: "14'-0\" (4.3m)" },
        ],
      },
      {
        name: "Primary suite",
        floorPlanImage: ROOM_IMAGES.bedroom,
        widthFt: 18, lengthFt: 16, ceilingHeightFt: 10, areaSqFt: 288,
        dimensionLabels: [
          { edge: "top", text: "18'-0\" (5.5m)" },
          { edge: "left", text: "16'-0\" (4.9m)" },
        ],
      },
      {
        name: "Terrace",
        floorPlanImage: ROOM_IMAGES.terrace,
        widthFt: 26, lengthFt: 12, ceilingHeightFt: 0, areaSqFt: 312,
        dimensionLabels: [
          { edge: "top", text: "26'-0\" (7.9m)" },
          { edge: "left", text: "12'-0\" (3.7m)" },
        ],
      },
    ],
  },
  "ocean-villa": {
    propertyId: "ocean-villa",
    rooms: [
      {
        name: "Living room",
        floorPlanImage: ROOM_IMAGES.livingRoom,
        widthFt: 20, lengthFt: 16, ceilingHeightFt: 11, areaSqFt: 320,
        dimensionLabels: [
          { edge: "top", text: "20'-0\" (6.1m)" },
          { edge: "left", text: "16'-0\" (4.9m)" },
        ],
      },
      {
        name: "Terrace",
        floorPlanImage: ROOM_IMAGES.terrace,
        widthFt: 30, lengthFt: 14, ceilingHeightFt: 0, areaSqFt: 420,
        dimensionLabels: [
          { edge: "top", text: "30'-0\" (9.1m)" },
          { edge: "left", text: "14'-0\" (4.3m)" },
        ],
      },
    ],
  },
}

export function getDemoProperty(id: string): Property | undefined {
  return demoProperties.find((p) => p.id === id)
}
export function getDemoTour(id: string): PropertyTour | undefined {
  return demoTours[id]
}
export function getDemoVastu(id: string): VastuReportData | undefined {
  return demoVastuReports[id]
}
export function getDemoDimensions(id: string): PropertyDimensions | undefined {
  return demoDimensions[id]
}
