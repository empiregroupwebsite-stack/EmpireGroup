export interface EquipmentItem {
  id: string;
  name: string;
  image: string;
  /** One-line description of what the equipment does on site */
  use: string;
  brands?: string[];
}

export interface MachineryItem {
  id: string;
  name: string;
  use: string;
  image: string;
  /** Photo credit; these photos come from Wikimedia Commons and their licences require attribution. */
  credit: string;
}

// Ordered by priority on site: lifting and concreting first, support tools last.
export const equipmentsData: EquipmentItem[] = [
  {
    id: 'tower-crane',
    name: 'Tower Crane',
    image: '/Tower%20Crane%20Lifting%20Steel%20at%20Construction%20Site.png',
    use: 'High-rise vertical lifting',
    brands: ['ACE', 'Potain'],
  },
  {
    id: 'concrete-pump',
    name: 'Concrete Pump',
    image: '/Putzmeister%20Pump%20at%20Construction%20Site.png',
    use: 'High-pressure concrete pumping',
    brands: ['Schwing', 'Aquarius', 'Putzmeister'],
  },
  {
    id: 'man-material-lift',
    name: 'Man & Material Lift',
    image: '/Man%20Lift%20vs.%20Material%20Lift.png',
    use: 'Vertical crew and material transport',
  },
  {
    id: 'concrete-mixer',
    name: 'Concrete Mixer',
    image: '/AJAX%20Concrete%20Mixer%20at%20Construction%20Site.png',
    use: 'On-site concrete batching',
  },
  {
    id: 'dg-set',
    name: 'DG Set 125 KVA',
    image: '/Green%20Cummins%20Generator%20at%20Construction%20Site.png',
    use: 'Standby site power',
    brands: ['Cummins', 'Kirloskar'],
  },
  {
    id: 'cutting-bending-machine',
    name: 'Cutting & Bending Machine',
    image: '/Industrial%20Rebar%20Machines%20on%20Site.png',
    use: 'Rebar cutting and shaping',
  },
  {
    id: 'breaker-chipper-grinder',
    name: 'Breaker, Chipper & Grinder',
    image: '/Construction%20Power%20Tools%20Lineup.png',
    use: 'Finishing and demolition tools',
    brands: ['Bosch', 'Hilti'],
  },
];

// Photos: Wikimedia Commons, cropped. Replace with your own site photos when available.
export const machineryData: MachineryItem[] = [
  {
    id: 'boom-placer',
    name: 'Boom Placer',
    use: 'Concrete placing boom',
    image: '/machinery/boom-placer.jpg',
    credit: 'Photo: वि.नरसीकर, CC BY-SA 4.0, via Wikimedia Commons',
  },
  {
    id: 'farana',
    name: 'Farana Crane',
    use: 'Pick & carry crane',
    image: '/machinery/farana-crane.jpg',
    credit: 'Photo: Oleg Yunakov, CC0, via Wikimedia Commons',
  },
  {
    id: 'tractor',
    name: 'Tractor',
    use: 'Site haulage',
    image: '/machinery/tractor.jpg',
    credit: 'Photo: Ganesh Mohan T, CC BY-SA 4.0, via Wikimedia Commons',
  },
  {
    id: 'tempo',
    name: 'Tempo',
    use: 'Material transport',
    image: '/machinery/tempo.jpg',
    credit: 'Photo: SnapMeUp, CC BY-SA 4.0, via Wikimedia Commons',
  },
];
