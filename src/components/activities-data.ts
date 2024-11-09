import { Activity } from './types';

export const ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'First Conference Attendance',
    content: 'Attended the 3rd Materials of Value and Essence Symposium in Baguio City with poster presentation "Spray-Pyrolized Zinc Oxide Structures Grown on Surface Modified Ceramic by Acid Treatment".',
    timestamp: new Date('2014-10-01'),
    type: 'achievement',
    tags: ['conference', 'presentation', 'zinc oxide', 'ceramic']
  },
  {
    id: '2',
    title: 'PAASE Meeting and Symposium Attendance',
    content: 'Attended the 2015 Annual Philippine–American Academy of Science Engineering (PAASE) Meeting and Symposium with a presentation on "Surface Modification of Ceramic Through HCl Treatment and its Effect on the Growth of Spray-Pyrolized ZnO".',
    timestamp: new Date('2015-02-07'),
    type: 'research',
    tags: ['conference', 'presentation', 'surface modification', 'zinc oxide']
  },
  {
    id: '3',
    title: 'Second Attendance at Materials of Value and Essence Symposium',
    content: 'Presented two posters, including my thesis "Fabrication of Triboelectric Generators" and my mentees’ research on "Voltage–Frequency and Voltage–Surface Area Relationship of Triboelectric Nanogenerator".',
    timestamp: new Date('2015-10-01'),
    type: 'research',
    tags: ['conference', 'presentation', 'triboelectric generator', 'mentorship']
  },
  {
    id: '4',
    title: 'Research Presentation by Project Leader',
    content: 'Dr. A. Salvador-Amores presented our research project "Anthropological, Mathematical Symmetry and Technical Characterization of Cordillera Textiles" at the Office of the Vice President for Academic Affairs Research Symposium.',
    timestamp: new Date('2016-10-01'),
    type: 'research',
    tags: ['textile', 'Cordillera', 'symmetry', 'research symposium']
  },
  {
    id: '5',
    title: 'First Poster as MS Graduate Student',
    content: 'Presented a poster on "Surface Plasmon Resonance of Fe3O4−Au Spherical Nanoparticles by Discrete Dipole Approximation" at the ICTP Asian Network School and Workshop on Complex Condensed Matter Systems.',
    timestamp: new Date('2019-11-01'),
    type: 'achievement',
    tags: ['poster', 'surface plasmon resonance', 'Fe3O4−Au', 'nanoparticles']
  },
  {
    id: '6',
    title: 'Presentation at International Symposium of the Vacuum Society of the Philippines',
    content: 'Presented Master’s class project "Synthesis of Nitrogen-Doped Graphene Oxide using RF Plasma Treatment".',
    timestamp: new Date('2020-11-01'),
    type: 'research',
    tags: ['graphene oxide', 'nitrogen-doping', 'RF plasma treatment', 'vacuum society']
  }
];
