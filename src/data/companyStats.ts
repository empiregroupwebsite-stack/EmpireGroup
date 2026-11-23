// Headline company figures shown on the home hero, home About section and About page.
export interface CompanyStat {
  value: string;
  unit: string;
  label: string;
}

export const COMPANY_STATS: CompanyStat[] = [
  { value: '50', unit: '+', label: 'Projects Completed' },
  { value: '9', unit: '+', label: 'Ongoing Projects' },
  { value: '20', unit: ' Million+', label: 'Sq. Ft. Delivered' },
  { value: '6.5', unit: ' Million+', label: 'Sq. Ft. Ongoing' },
];
