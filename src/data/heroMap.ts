// Geography for the home hero map.
// Coordinates are projected into the @svg-maps/india viewBox (0 0 612 696).
// The projection was fitted to the state outlines of that map (Mercator latitude,
// linear longitude) and is accurate to about one map unit (~5 km) across India.

export interface MapPoint {
  x: number;
  y: number;
}

const X_ORIGIN = 93.5;
const X_LON = 72.6;
const X_SCALE = 20.78;
const Y_ORIGIN = 837.42;
const Y_SCALE = 1200.3;

export function projectLatLon(lat: number, lon: number): MapPoint {
  const mercator = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return { x: X_ORIGIN + (lon - X_LON) * X_SCALE, y: Y_ORIGIN - Y_SCALE * mercator };
}

export interface HeroCity {
  key: string;
  name: string;
  state: string;
  /** @svg-maps/india location id of the state that contains the city */
  stateId: string;
  lat: number;
  lon: number;
  /** Side of the marker where the city name sits in the India overview */
  labelSide: 'left' | 'right' | 'top';
  /** True when a project `city` field belongs to this city */
  matches: (city: string) => boolean;
}

// Add a city here when a project is added in a new city; projects in unknown cities are not shown on the map.
export const HERO_CITIES: HeroCity[] = [
  {
    key: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    stateId: 'mh',
    lat: 18.5204,
    lon: 73.8567,
    labelSide: 'top',
    matches: (city) => city.includes('pune'),
  },
  {
    key: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    stateId: 'mh',
    lat: 19.076,
    lon: 72.8777,
    labelSide: 'left',
    matches: (city) => city.includes('mumbai') || city.includes('thane'),
  },
  {
    key: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    stateId: 'tg',
    lat: 17.385,
    lon: 78.4867,
    labelSide: 'right',
    matches: (city) => city.includes('hyderabad'),
  },
];

// Project `location` values (lower case) mapped to [lat, lon].
// A location that is not listed falls back to its city centre.
const LOCALITIES: Record<string, [number, number]> = {
  hinjewadi: [18.5913, 73.7389],
  'hinjewadi phase 2': [18.5793, 73.717],
  gahunje: [18.6713, 73.6838],
  'nanded city': [18.4603, 73.8048],
  bundgarden: [18.5392, 73.8826],
  'viman nagar': [18.5679, 73.9143],
  kharadi: [18.5515, 73.9476],
  keshavnagar: [18.5385, 73.9445],
  mundhwa: [18.5333, 73.93],
  magarpatta: [18.5158, 73.9272],
  nibm: [18.4746, 73.902],
  manjri: [18.4996, 73.9787],
  wagholi: [18.5808, 73.9787],
  thane: [19.2183, 72.9781],
  palava: [19.165, 73.088],
};

export interface ProjectPlace {
  city: HeroCity;
  localityKey: string;
  localityName: string;
  point: MapPoint;
}

export function locateProject(city: string, location: string): ProjectPlace | null {
  const heroCity = HERO_CITIES.find((candidate) => candidate.matches(city.toLowerCase()));
  if (!heroCity) return null;

  const localityKey = location.trim().toLowerCase();
  const coords = LOCALITIES[localityKey];
  if (!coords) {
    return {
      city: heroCity,
      localityKey: `${heroCity.key}-centre`,
      localityName: `${heroCity.name} City`,
      point: projectLatLon(heroCity.lat, heroCity.lon),
    };
  }
  return {
    city: heroCity,
    localityKey,
    localityName: location.trim(),
    point: projectLatLon(coords[0], coords[1]),
  };
}

/** Major cities drawn faintly in the India overview for orientation. */
export const REFERENCE_CITIES: Array<MapPoint & { name: string; labelSide: 'left' | 'right' }> = [
  { name: 'New Delhi', labelSide: 'right', ...projectLatLon(28.6139, 77.209) },
  { name: 'Ahmedabad', labelSide: 'left', ...projectLatLon(23.0225, 72.5714) },
  { name: 'Kolkata', labelSide: 'right', ...projectLatLon(22.5726, 88.3639) },
  { name: 'Bengaluru', labelSide: 'left', ...projectLatLon(12.9716, 77.5946) },
  { name: 'Chennai', labelSide: 'right', ...projectLatLon(13.0827, 80.2707) },
];
