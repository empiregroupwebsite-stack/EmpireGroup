// City Hub Configuration for Empire Group India Map
// SVG coordinates are calibrated for the indiaStatesPaths viewBox system

export interface CityHub {
  key: string;
  name: string;
  description: string;
  svgX: number;
  svgY: number;
  landmarks: Array<{ name: string; x: number; y: number }>;
}

export const CITY_HUBS: Record<string, CityHub> = {
  mumbai: {
    key: 'mumbai',
    name: 'Mumbai',
    description: 'Financial capital & coastal infrastructure corridor. Empire Group has executed landmark high-rise towers, luxury skyscrapers, and commercial complexes across BKC, Mulund, Thane and the extended Mumbai Metropolitan Region.',
    svgX: 128,
    svgY: 522,
    landmarks: [
      { name: 'BKC (Bandra Kurla)', x: 127, y: 528 },
      { name: 'Mulund West', x: 136, y: 516 },
      { name: 'Worli / Lower Parel', x: 123, y: 530 },
      { name: 'Thane West', x: 140, y: 513 },
      { name: 'Mira Road / Vasai', x: 128, y: 507 },
    ],
  },
  pune: {
    key: 'pune',
    name: 'Pune',
    description: 'Maharashtra\'s fastest-growing infrastructure hub. Empire Group\'s largest project portfolio — spanning Hinjewadi IT Corridor, Wagholi, Hadapsar, Magarpatta and Kharadi — reflects 15+ years of deep construction partnership.',
    svgX: 162,
    svgY: 540,
    landmarks: [
      { name: 'Hinjewadi Phase 1-3', x: 152, y: 538 },
      { name: 'Magarpatta / Hadapsar', x: 170, y: 548 },
      { name: 'Wagholi / Kharadi', x: 175, y: 542 },
      { name: 'Wakad / Pimple Nilakh', x: 155, y: 532 },
      { name: 'Undri / Ambegaon', x: 165, y: 553 },
    ],
  },
  hyderabad: {
    key: 'hyderabad',
    name: 'Hyderabad',
    description: 'Telangana\'s booming tech & residential skyscraper market. Empire Group has delivered mega-towers at HITEC City, Gachibowli, Financial District and Tellapur under India\'s most prestigious developer mandates.',
    svgX: 290,
    svgY: 558,
    landmarks: [
      { name: 'HITEC City Phase 1-3', x: 283, y: 553 },
      { name: 'Gachibowli / Financial District', x: 282, y: 560 },
      { name: 'Tellapur / Nallagandla', x: 278, y: 556 },
      { name: 'Moti Nagar Central', x: 286, y: 548 },
      { name: 'Kokapet / Nanakramguda', x: 284, y: 563 },
    ],
  },
};

// Project SVG coordinate offsets relative to city hub centers
// These give realistic geographic spread within the city's SVG zone
const PROJECT_EXACT_OFFSETS: Record<string, { dx: number; dy: number }> = {
  // Mumbai region projects
  'kanakia-paris-bkc': { dx: -3, dy: 5 },
  'wadhwa-atmosphere-mulund': { dx: 7, dy: -4 },
  'hubtown-solaris-andheri': { dx: -6, dy: 2 },
  'trees-godrej-vikhroli': { dx: 5, dy: -2 },
  'kalpataru-magnus-borivali': { dx: -8, dy: -7 },
  'shapoorji-vicinia-chandivali': { dx: 4, dy: 3 },
  'lt-crescent-bay-parel': { dx: -4, dy: 7 },
  'dosti-eastern-bay-wadala': { dx: 2, dy: 8 },
  'lodha-fiorenza-goregaon': { dx: -7, dy: -5 },
  'rustomjee-seasons-bandra': { dx: -2, dy: 4 },
  'oberoi-sky-city-borivali': { dx: -9, dy: -8 },
  'lodha-palava-dombivli': { dx: 12, dy: 3 },
  'luxuria-by-lodha-thane': { dx: 9, dy: -6 },
  'crown-horizon-by-lodha': { dx: 11, dy: 1 },

  // Pune region projects
  'godrej-infinity-keshav-nagar': { dx: 10, dy: 5 },
  'kumar-ecopolis-nibm': { dx: 8, dy: 8 },
  'panchshil-eon-free-zone': { dx: -7, dy: -4 },
  'gera-planet-of-joy': { dx: 6, dy: -6 },
  'rohan-abhilasha-warje': { dx: -5, dy: 3 },
  'pride-world-city-chakan': { dx: 3, dy: -11 },
  'life-republic-kolte-patil': { dx: -9, dy: -6 },
  'blue-ridge-hinjewadi': { dx: -10, dy: -4 },
  'puneville-pharande': { dx: -3, dy: -8 },
  'nanded-city-shubh-kalyan': { dx: 2, dy: 11 },
  'magarpatta-sylvania': { dx: 7, dy: 7 },
  'magarpatta-trillium': { dx: 8, dy: 6 },
  'magarpatta-cosmos': { dx: 9, dy: 8 },
  'magarpatta-sez': { dx: 7, dy: 9 },
  'magarpatta-jasminium': { dx: 6, dy: 7 },
  'magarpatta-laburnum': { dx: 8, dy: 10 },
  'magarpatta-erica': { dx: 10, dy: 8 },
  'madhukosh-paranjape': { dx: -4, dy: 7 },
  'vtp-pegasus': { dx: -8, dy: -5 },
  'vtp-purvanchal': { dx: -6, dy: -3 },
  'lodha-belmondo-pune': { dx: -12, dy: 2 },
  'ibis-hotel-hinjewadi': { dx: -11, dy: -5 },
  'konark-virtue-pune': { dx: 4, dy: -7 },
  'phoenix-marketcity-pune': { dx: 6, dy: 2 },
  'the-spires-naiknavare': { dx: -3, dy: -9 },
  'claren-tower-pride-purple': { dx: 5, dy: 6 },
  'vtp-earth-one': { dx: -9, dy: -4 },
  'life-republic-sector-r14': { dx: -10, dy: -7 },
  'amanora-gateway-towers': { dx: 9, dy: 9 },
  'kumar-prospera-tech-park': { dx: 7, dy: 7 },
  'forest-trails-phase4': { dx: -2, dy: 12 },

  // Hyderabad region projects
  'hitec-city-cyber-gateway': { dx: -7, dy: -4 },
  'aparna-sarovar-grande-nalagandla': { dx: -9, dy: 3 },
  'brigade-citadel-moti-nagar': { dx: -1, dy: -6 },
  'phoenix-aquila-hyderabad': { dx: 5, dy: -4 },
  'sattva-knowledge-city': { dx: 4, dy: 2 },
  'my-home-avatar-kokapet': { dx: 6, dy: 5 },
  'jayabheri-the-peak': { dx: 2, dy: -8 },
  'my-home-bhooja': { dx: -5, dy: 6 },
  'sas-crown': { dx: 3, dy: 7 },
  'rajapushpa-atria': { dx: 7, dy: 3 },
  'aparna-zenon': { dx: -6, dy: -2 },
  'my-home-sayuk-tellapur': { dx: -10, dy: 2 },
  'candeur-crescent-serilingampally': { dx: -8, dy: -1 },
};

export function getProjectSvgCoordinates(
  location: string,
  cityKey: string,
  projectId: string,
): { x: number; y: number } {
  const hub = CITY_HUBS[cityKey];
  if (!hub) return { x: 200, y: 540 };

  // Try exact project offset first
  const offset = PROJECT_EXACT_OFFSETS[projectId];
  if (offset) {
    return {
      x: hub.svgX + offset.dx,
      y: hub.svgY + offset.dy,
    };
  }

  // Fallback: deterministic pseudo-random spread based on location string
  let hash = 0;
  for (let i = 0; i < location.length; i++) {
    hash = (hash * 31 + location.charCodeAt(i)) & 0xfffffff;
  }
  const dx = ((hash % 24) - 12) * 0.9;
  const dy = (((hash >> 4) % 20) - 10) * 0.9;

  return {
    x: hub.svgX + dx,
    y: hub.svgY + dy,
  };
}

