export interface AwardItem {
  id: string;
  title: string;
  image: string;
  category: 'Safety & HSE' | 'EPC Excellence' | 'Developer Honors' | 'ISO & Quality';
  organization: string;
  year: string;
  projectOrScope: string;
  description: string;
  badge: string;
}

// Housekeeping Appreciation Award is intentionally shown last.
export const awardsData: AwardItem[] = [
  {
    id: 'axis-bank-partnership',
    title: 'Valued Partner Appreciation',
    category: 'Safety & HSE',
    organization: 'Axis Bank',
    year: 'Recognition',
    projectOrScope: 'Empire Projects and Developments Private Limited',
    description: 'A formal appreciation recognizing Empire Projects & Developments as a trusted partner in progress.',
    badge: 'Partner Recognition',
    image: '/award-axis-bank.jpeg'
  },
  {
    id: 'vtp-housekeeping-plaque',
    title: 'Best Housekeeping Award',
    category: 'Developer Honors',
    organization: 'VTP Realty & SEMAC',
    year: 'Achievement',
    projectOrScope: 'VTP Pegasus Project',
    description: 'Recognized for outstanding housekeeping and site-maintenance standards at VTP Pegasus.',
    badge: 'Housekeeping Excellence',
    image: '/award-vtp-housekeeping-trophy.jpeg'
  },
  {
    id: 'vtp-pegasus-march-2022',
    title: 'Best Housekeeping Certificate',
    category: 'Safety & HSE',
    organization: 'VTP Realty',
    year: 'March 2022',
    projectOrScope: 'VTP Pegasus Project, Pune',
    description: 'Certificate recognizing adoption of HSE norms and adjudged Best Housekeeping for the month of March 2022.',
    badge: 'HSE Certificate',
    image: '/award-vtp-pegasus-march-2022.jpeg'
  },
  {
    id: 'cemcon-2014',
    title: 'CEMCON 2014 Sponsor',
    category: 'EPC Excellence',
    organization: 'Indian Concrete Institute',
    year: '2014',
    projectOrScope: 'National Conference on Composite Construction & Modern Concrete',
    description: 'Empire Group was presented as a sponsor of CEMCON 2014 in Pune.',
    badge: 'Conference Sponsor',
    image: '/award-cemcon-2014.jpeg'
  },
  {
    id: 'lodha-belavita-may-2024',
    title: 'EHS Excellence Appreciation',
    category: 'Developer Honors',
    organization: 'Lodha',
    year: 'May 2024',
    projectOrScope: 'Lodha Belavita, Pune',
    description: 'Certificate of appreciation awarded for dedicated support and contribution to EHS excellence at Lodha Belavita.',
    badge: 'EHS Appreciation',
    image: '/award-lodha-ehs-may-2024.jpeg'
  },
  {
    id: 'gst-appreciation-2024-25',
    title: 'GST Compliance Appreciation',
    category: 'ISO & Quality',
    organization: 'Central Board of Indirect Taxes & Customs',
    year: '2024-25',
    projectOrScope: 'GST Registration 27AAECE3648R1ZZ',
    description: 'Recognized for prompt GST return filing and timely payment of Goods & Services Tax during the financial year 2024-25.',
    badge: 'Government Recognition',
    image: '/award-gst-appreciation-2024-25.jpeg'
  },
  {
    id: 'konark-completion-2022',
    title: 'Successful Project Completion Appreciation',
    category: 'Developer Honors',
    organization: 'Konark Builders',
    year: '20 August 2022',
    projectOrScope: 'Konark Virtue, Keshavnagar, Mundhwa',
    description: 'Appreciation for successful completion of Towers T-02 and T-03 at Konark Virtue.',
    badge: 'Project Appreciation',
    image: '/award-konark-2022.jpeg'
  },
  {
    id: 'konark-completion-2024',
    title: 'Tower Completion Excellence',
    category: 'Developer Honors',
    organization: 'Konark Builders',
    year: '20 March 2024',
    projectOrScope: 'Konark Virtue, Towers 2 and 3',
    description: 'Recognition of meticulous construction, quality standards, safety protocols and commitment to excellence.',
    badge: 'Completion Citation',
    image: '/award-konark-2024.jpeg'
  },
  {
    id: 'paranjape-zero-accident',
    title: 'Zero Accident Achievement',
    category: 'Safety & HSE',
    organization: 'Paranjape Schemes (Construction) Ltd.',
    year: '2016-17',
    projectOrScope: 'Empire Construction',
    description: 'Certificate of appreciation for achieving and maintaining zero accident performance during 2016-17.',
    badge: 'Safety Achievement',
    image: '/award-paranjape-2017.jpeg'
  },
  {
    id: 'dolce-vita-housekeeping-award',
    title: 'Housekeeping Appreciation Award',
    category: 'Safety & HSE',
    organization: 'VTP Realty',
    year: '2026',
    projectOrScope: 'VTP Dolce Vita Project',
    description: 'Presented to Empire Infra for maintaining exceptional housekeeping standards at VTP Dolce Vita.',
    badge: 'Housekeeping Award',
    image: '/award-dolce-vita.jpeg'
  },
];
