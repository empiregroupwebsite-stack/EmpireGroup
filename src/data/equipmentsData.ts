
export interface EquipmentItem {
  id: string;
  name: string;
  image: string;
  brands?: string[];
}

export const equipmentsData: EquipmentItem[] = [
  {
    id: 'concrete-mixer',
    name: 'Concrete Mixer',
    image: '/AJAX%20Concrete%20Mixer%20at%20Construction%20Site.png',
  },
  {
    id: 'concrete-pump',
    name: 'Concrete Pump',
    image: '/Putzmeister%20Pump%20at%20Construction%20Site.png',
    brands: ['Schwing', 'Aquarius', 'Putzmeister'],
  },
  {
    id: 'dg-set',
    name: 'DG Set 125 KVA',
    image: '/Green%20Cummins%20Generator%20at%20Construction%20Site.png',
    brands: ['Cummins', 'Kirloskar'],
  },
  {
    id: 'tower-crane',
    name: 'Tower Crane',
    image: '/Tower%20Crane%20Lifting%20Steel%20at%20Construction%20Site.png',
    brands: ['ACE', 'Potain'],
  },
  {
    id: 'cutting-bending-machine',
    name: 'Cutting & Bending Machine',
    image: '/Industrial%20Rebar%20Machines%20on%20Site.png',
  },
  {
    id: 'breaker-chipper-grinder',
    name: 'Breaker, Chipper & Grinder',
    image: '/Construction%20Power%20Tools%20Lineup.png',
    brands: ['Bosch', 'Hilti'],
  },
  {
    id: 'man-material-lift',
    name: 'Man & Material Lift',
    image: '/Man%20Lift%20vs.%20Material%20Lift.png',
  },
];
