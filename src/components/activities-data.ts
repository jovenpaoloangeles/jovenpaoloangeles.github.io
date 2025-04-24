import { Activity } from './types';

export const ACTIVITIES: Omit<Activity, 'id'>[] = [
  {
    title: "First Conference Attendance",
    content: "Attended the 3rd Materials of Value and Essence Symposium in Baguio City with poster presentation \"Spray-Pyrolized Zinc Oxide Structures Grown on Surface Modified Ceramic by Acid Treatment\".",
    timestamp: new Date('2014-10-01'),
    type: ['achievement'],
    tags: ['conference', 'presentation', 'zinc oxide', 'ceramic']
  },
  {
    title: 'PAASE Meeting and Symposium Attendance',
    content: 'Attended the 2015 Annual Philippine–American Academy of Science Engineering (PAASE) Meeting and Symposium with a presentation on "Surface Modification of Ceramic Through HCl Treatment and its Effect on the Growth of Spray-Pyrolized ZnO".',
    timestamp: new Date('2015-02-07'),
    type: ['research'],
    tags: ['conference', 'presentation', 'surface modification', 'zinc oxide']
  },
  {
    title: 'Second Attendance at Materials of Value and Essence Symposium',
    content: 'Presented two posters, including my thesis "Fabrication of Triboelectric Generators" and my mentees’ research on "Voltage–Frequency and Voltage–Surface Area Relationship of Triboelectric Nanogenerator".',
    timestamp: new Date('2015-10-01'),
    type: ['research'],
    tags: ['conference', 'presentation', 'triboelectric generator', 'mentorship']
  },
  {
    title: 'Research Presentation by Project Leader',
    content: 'Dr. A. Salvador-Amores presented our research project "Anthropological, Mathematical Symmetry and Technical Characterization of Cordillera Textiles" at the Office of the Vice President for Academic Affairs Research Symposium.',
    timestamp: new Date('2016-10-01'),
    type: ['research'],
    tags: ['textile', 'Cordillera', 'symmetry', 'research symposium']
  },
  {
    title: 'First Poster as MS Graduate Student',
    content: 'Presented a poster on "Surface Plasmon Resonance of Fe3O4−Au Spherical Nanoparticles by Discrete Dipole Approximation" at the ICTP Asian Network School and Workshop on Complex Condensed Matter Systems.',
    timestamp: new Date('2019-11-01'),
    type: ['achievement'],
    tags: ['poster', 'surface plasmon resonance', 'Fe3O4−Au', 'nanoparticles']
  },
  {
    title: 'Presentation at International Symposium of the Vacuum Society of the Philippines',
    content: 'Presented Master’s class project "Synthesis of Nitrogen-Doped Graphene Oxide using RF Plasma Treatment".',
    timestamp: new Date('2020-11-01'),
    type: ['research'],
    tags: ['graphene oxide', 'nitrogen-doping', 'RF plasma treatment', 'vacuum society']
  },
  {
    title: 'Surface Plasmon Resonance of Fe3O4−Au Nanoparticles by Discrete Dipole Approximation',
    content: 'J. Angeles and M. Vega presented "Discrete Dipole Approximation for Surface Plasmon Resonance of Fe3O4 − Au nanoparticles" at the Annual Meeting of the Physical Society of Taiwan, National Pingtung University, Pingtung, Taiwan, February 2020.',
    timestamp: new Date('2020-02-01'),
    type: ['research'],
    tags: ['conference', 'surface plasmon resonance', 'Fe3O4−Au', 'Physical Society of Taiwan']
  },
  {
    title: 'Surface Plasmon Resonance of Fe3O4−Au Nanoparticles for SERS',
    content: 'J. Angeles and M. Vega presented "Surface Plasmon Resonance of Fe3O4−Au core-shell nanoparticles for SERS Applications by Finite Element Method" at the NRCP Annual Scientific Conference and 87th General Membership Assembly, Philippine International Convention Center, Pasay City, Metro Manila, Philippines, June 2020.',
    timestamp: new Date('2020-06-01'),
    type: ['research'],
    tags: ['conference', 'surface plasmon resonance', 'Fe3O4−Au', 'NRCP', 'SERS']
  },
  {
    title: 'SERS Enhancement and SPR Hotspot Efficiency in Gold Nanoparticle Studies',
    content: 'J. Angeles and M. Vega presented "SERS Enhancement Factor of Gold Nanoparticle-Graphene Substrates", Y. Rola, J. Angeles, G. Cabrera, and M. Vega presented "Efficiency Assessment of SERS Hotspots Generated from Gold@Iron Oxide Interface", and G. Cabrera, J. Angeles, Y. Rola, and M. Vega presented "Percolated graphene oxide with Au nanosphere spacer for SERS detection of glucose" at the Samahang Pisika ng Pilipinas, National Institute of Physics, Quezon City, Philippines, October 2020.',
    timestamp: new Date('2020-10-01'),
    type: ['research'],
    tags: ['conference', 'SERS', 'graphene', 'gold nanoparticles', 'National Institute of Physics']
  },
  {
    title: 'Synthesis of GO/rGO and Zeolite-Based Composites',
    content: 'E. Casalme, R. Andig, J. Angeles, and M. Vega presented "Synthesis of GO/− and rGO/ZIF-8 heterojunction composites" and L. Sayson, J. Lopez, J. Angeles, M. Tumanguil-Quitoras, and M. Vega presented "Removal of methylene blue dye from water using silver-exchanged Philippine natural zeolites" at the Samahang Pisika ng Pilipinas, Legazpi City, Albay, Philippines, September 2022.',
    timestamp: new Date('2022-09-01'),
    type: ['research'],
    tags: ['conference', 'GO/ZIF-8', 'rGO', 'zeolites', 'Samahang Pisika ng Pilipinas']
  },
  {
    title: 'Investigation of Water as Solvent Alternative for ZIF-8 Synthesis',
    content: 'T. Rodriguez, M. Ramos, J. Angeles, and M. Vega presented "Investigation of water as solvent alternative for methanol-based ZIF-8 synthesis" at the Samahang Pisika ng Pilipinas, Siargao Island, Surigao del Norte, Philippines, July 2023.',
    timestamp: new Date('2023-07-01'),
    type: ['research'],
    tags: ['conference', 'solvent alternative', 'ZIF-8 synthesis', 'Samahang Pisika ng Pilipinas']
  },
  {
    title: 'Exploring Adsorption Capacity of Acid-Modified Philippine Zeolites',
    content: 'J. Angeles, J. Lopez, K. Salazar, and M. Vega presented "Exploring the adsorption capacity of acid-modified Philippine Natural Zeolites in wastewater treatment" at the Samahang Pisika ng Pilipinas, Siargao Island, Surigao del Norte, Philippines, July 2023.',
    timestamp: new Date('2023-07-01'),
    type: ['research'],
    tags: ['conference', 'adsorption', 'zeolites', 'wastewater treatment', 'Samahang Pisika ng Pilipinas']
  },
  {
    title: 'Leveraging Machine Learning and Graphene Composites for Heavy Metal Detection',
    content: 'J. Angeles and M. Vega presented "Leveraging Machine Learning and Plasmonic Graphene Composites for Advanced Detection of Heavy Metals in Water" at the NRCP Annual Scientific Conference and 91st General Membership Assembly, held at the Philippine International Convention Center, Pasay City, Metro Manila, March 2024.',
    timestamp: new Date('2024-03-01'),
    type: ['research'],
    tags: ['conference', 'machine learning', 'graphene composites', 'heavy metals', 'NRCP']
  },
  {
    title: 'Graduate Colloquium Presentation on Bayesian Optimization',
    content: 'Presented my PhD research on "Efficiency in Experimentation: Bayesian Optimization for Nanomaterial Synthesis" at the Graduate Colloquium, showcasing advances in optimizing nanomaterial synthesis processes.',
    timestamp: new Date('2024-12-11'),
    type: ['research', 'achievement'],
    tags: ['PhD', 'presentation', 'Bayesian optimization', 'nanomaterials', 'colloquium']
  },
  {
    title: 'Assistant Organizer at 37th Samahang Pisika ng Pilipinas International Physics Conference',
    content: 'Volunteered as an assistant to help organize the 37th Samahang Pisika ng Pilipinas International Physics Conference and Annual Meeting held in Tagbilaran City, Bohol, on 29 May 2019.',
    timestamp: new Date('2019-05-29'),
    type: ['achievement'],
    tags: ['conference', 'volunteer', 'organization', 'Samahang Pisika ng Pilipinas']
  },
  {
    title: 'Graduated with Master of Science in Materials Science and Engineering',
    content: 'Completed the Master of Science in Materials Science and Engineering at the University of the Philippines on July 24, 2021.',
    timestamp: new Date('2021-07-24'),
    type: ['achievement'],
    tags: ['graduation', 'materials science', 'University of the Philippines']
  },
  {
    title: 'Passed PhD Candidacy Examination',
    content: 'Passed the PhD candidacy examination on December 16, 2022, for the research proposal entitled "Machine Learning for Surface Enhanced Raman Spectroscopy."',
    timestamp: new Date('2022-12-16'),
    type: ['achievement'],
    tags: ['PhD candidacy', 'machine learning', 'SERS', 'examination']
  }, 
  {
    title: 'Exhibited "Swan Lake" Photo at Nayong Pilipino',
    content: 'Displayed my photograph titled "Swan Lake" at an exhibition held in Nayong Pilipino on December 19, 2016.',
    timestamp: new Date('2016-12-19'),
    type: ['photography'],
    tags: ['exhibition', 'Nayong Pilipino', 'Swan Lake']
  },
  {
    title: 'Best Scientific Presentation Award at 38th Samahang Pisika ng Pilipinas Physics Conference',
    content: 'Received the Best Scientific Presentation award for the presentation "SERS Enhancement Factor of Gold Nanoparticle-Graphene Substrates" at the 38th Samahang Pisika ng Pilipinas Physics Conference on October 23, 2020.',
    timestamp: new Date('2020-10-23'),
    type: ['achievement'],
    tags: ['award', 'best presentation', 'SERS', 'gold nanoparticles', 'graphene', 'Samahang Pisika ng Pilipinas']
  },
  {
    title: 'Successfully Defended Master\'s Thesis',
    content: 'Successfully defended my Master\'s thesis titled "Correlation of the Extinction Spectra and SERS Enhancement Factor of Gold Nanostar-Graphene Substrates" on July 24, 2020.',
    timestamp: new Date('2020-07-24'),
    type: ['achievement'],
    tags: ['thesis defense', 'SERS', 'gold nanostar', 'graphene', 'extinction spectra', 'Master\'s']
  },
  {
    title: 'Lunar Eclipse Photo Featured by Philippine Astronomical Society',
    content: 'My photo of the lunar eclipse, captured using an infrared (IR) filter, was featured by the Philippine Astronomical Society, Inc. on June 26, 2020.',
    timestamp: new Date('2020-06-26'),
    type: ['photography'],
    tags: ['lunar eclipse', 'infrared', 'Philippine Astronomical Society']
  },
  {
    title: 'Camerahaus Photolympics 2019 with #TeamSony',
    content: 'Had an amazing time competing as part of #TeamSony at the Camerahaus Photolympics 2019, pushing creative boundaries and connecting with fellow photographers!',
    timestamp: new Date('2019-11-30'),
    type: ['photography'],
    tags: ['Camerahaus Photolympics', 'TeamSony', 'competition']
  },
  {
    title: 'Participation in Singapore International Photography Festival',
    content: 'Excited to have my work featured in the "Depth of Feel" exhibit at the Singapore International Photography Festival, held at the National Library Plaza, Singapore, from October 5 to 30.',
    timestamp: new Date('2019-10-05'),
    type: ['photography'],
    tags: ['Singapore International Photography Festival', 'Depth of Feel', 'exhibition']
  },
  {
    title: 'Camerahaus Photolympics 2023 with #TeamSony',
    content: 'Thrilled to be back with #TeamSony at the Camerahaus Photolympics 2023! It was an inspiring day pushing creative limits and reconnecting with the photography community.',
    timestamp: new Date('2023-11-29'),
    type: ['photography'],
    tags: ['Camerahaus Photolympics', 'TeamSony', 'competition']
  },
  {
    title: 'Exhibited "Tekkadan" Series in Works of Fire Exhibit',
    content: 'Proud to showcase my series "Tekkadan" in the Works of Fire exhibit at Porta Vaga, Baguio, Philippines, in January 2017.',
    timestamp: new Date('2017-01-01'),
    type: ['photography'],
    tags: ['exhibition', 'Tekkadan', 'Works of Fire', 'Baguio']
  },
  {
    title: 'Featured in Royal Museums Greenwich - Super Blue Blood Moon',
    content: 'Honored to have my "Super Blue Blood Moon" photo featured by Royal Museums Greenwich on February 1, 2018.',
    timestamp: new Date('2018-02-01'),
    type: ['photography'],
    tags: ['Royal Museums Greenwich', 'Super Blue Blood Moon', 'feature']
  },
  {
    title: 'National Geographic Your Shot Editor\'s Favorite - Oblation',
    content: 'Thrilled to see my photo "Oblation" selected as an Editor\'s Favorite on National Geographic Your Shot on November 27, 2017.',
    timestamp: new Date('2017-11-27'),
    type: ['photography'],
    tags: ['National Geographic', 'Your Shot', 'Oblation', 'feature']
  },
  {
    title: 'National Geographic Your Shot Editor\'s Favorite - It Always Finds A Way',
    content: 'My photo "It Always Finds A Way" was chosen as an Editor\'s Favorite on National Geographic Your Shot on June 27, 2018. Always rewarding to be noticed!',
    timestamp: new Date('2018-06-27'),
    type: ['photography'],
    tags: ['National Geographic', 'Your Shot', 'It Always Finds A Way', 'feature']
  },
  {
    title: 'National Geographic Your Shot Editor\'s Favorite - A Roof in Hong Kong',
    content: 'Grateful to have "A Roof in Hong Kong" recognized as an Editor\'s Favorite on National Geographic Your Shot on April 28, 2018.',
    timestamp: new Date('2018-04-28'),
    type: ['photography'],
    tags: ['National Geographic', 'Your Shot', 'A Roof in Hong Kong', 'feature']
  },
  {
    title: 'Featured on Travel SP Website',
    content: 'Excited to have my travel photography featured on the Travel SP Website in February 2017.',
    timestamp: new Date('2017-02-01'),
    type: ['photography'],
    tags: ['Travel SP', 'website feature']
  },
  {
    title: 'Popular Photography Magazine - Your Best Shot Gallery',
    content: 'Proud to have my work featured in the "Your Best Shot Gallery" of Popular Photography Magazine, September 2016.',
    timestamp: new Date('2016-09-01'),
    type: ['achievement', 'photography'],
    tags: ['Popular Photography Magazine', 'Your Best Shot Gallery', 'feature']
  },
  {
    title: "Philippine Astronomical Society Feature - Lunar Photography",
    content: "Honored to have my astrophotography featured by the Philippine Astronomical Society multiple times, including December 6, 2017, August 30, 2017, May 29, 2017, May 17, 2017, and March 29, 2017.",
    timestamp: new Date('2017-03-29'),
    type: ['photography'],
    tags: ['Philippine Astronomical Society', 'feature', 'astrophotography']
  },
  {
    title: "Philippine Astronomical Society Feature - Solar Photography",
    content: "Delighted to have my solar photography featured by the Philippine Astronomical Society on April 13, 2019.",
    timestamp: new Date('2019-04-13'),
    type: ['photography'],
    tags: ['Philippine Astronomical Society', 'feature', 'solar photography']
  },
  {
    title: "University of the Philippines Feature",
    content: "Proud to have my work featured by the University of the Philippines on March 29, 2017, highlighting my early career contributions.",
    timestamp: new Date('2017-03-29'),
    type: ['photography'],
    tags: ['University of the Philippines', 'feature']
  },
  {
    title: "Philippine Astronomical Society Feature - Solar Photography",
    content: "Grateful to have my solar photography featured by the Philippine Astronomical Society on May 17, 2017.",
    timestamp: new Date('2017-05-17'),
    type: ['photography'],
    tags: ['Philippine Astronomical Society', 'feature', 'solar photography']
  },
  {
    title: "Philippine Astronomical Society Feature - Astrophotography Highlight",
    content: "Pleased to have another piece of my astrophotography featured by the Philippine Astronomical Society on May 29, 2017.",
    timestamp: new Date('2017-05-29'),
    type: ['photography'],
    tags: ['Philippine Astronomical Society', 'feature', 'astrophotography']
  },
  {
    title: "Philippine Astronomical Society Feature - Celestial Photography",
    content: "Honored that my celestial photography was featured by the Philippine Astronomical Society on August 30, 2017.",
    timestamp: new Date('2017-08-30'),
    type: ['photography'],
    tags: ['Philippine Astronomical Society', 'feature', 'celestial photography']
  },
  {
    title: "Philippine Astronomical Society Feature - Infrared Lunar Photography",
    content: "Proud to see my infrared lunar photography featured by the Philippine Astronomical Society on December 6, 2017.",
    timestamp: new Date('2017-12-06'),
    type: ['photography'],
    tags: ['Philippine Astronomical Society', 'feature', 'lunar photography', 'IR filter']
  },
  {
    title: "Siena International Photo Awards 2020 - Shortlisted",
    content: "Honored to be shortlisted in the prestigious Siena International Photo Awards 2020.",
    timestamp: new Date('2020-10-01'),
    type: ['achievement', 'photography'],
    tags: ['award', 'Siena International Photo Awards', 'shortlisted']
  },
  {
    title: "Sony World Photography Awards - Entries of the Week",
    content: "Excited to have my work selected as \"Entries of the Week\" for the 2019 Sony World Photography Awards from October 29 to November 4, 2019.",
    timestamp: new Date('2019-10-29'),
    type: ['achievement', 'photography'],
    tags: ['award', 'Sony World Photography Awards', 'Entries of the Week']
  },
  {
    title: "International Photography Awards 2019 - Honorable Mention for \"Bad Weather Ahead\"",
    content: "Received an Honorable Mention in Fine Art-Landscape for \"Bad Weather Ahead\" in the 2019 International Photography Awards.",
    timestamp: new Date('2019-09-01'),
    type: ['achievement', 'photography'],
    tags: ['award', 'International Photography Awards', 'honorable mention', 'fine art', 'landscape']
  },
  {
    title: "International Photography Awards 2019 - 3rd Place for \"The Mansion\"",
    content: "Awarded 3rd place in the Special-Special Effects category for my piece \"The Mansion\" in the 2019 International Photography Awards.",
    timestamp: new Date('2019-09-01'),
    type: ['achievement', 'photography'],
    tags: ['award', 'International Photography Awards', 'special effects', 'The Mansion']
  },
  {
    title: "International Photography Awards 2019 - 3rd Place for \"Tree of Life\"",
    content: "Won 3rd place in the Architecture-Interior category for \"Tree of Life\" in the 2019 International Photography Awards.",
    timestamp: new Date('2019-09-01'),
    type: ['achievement', 'photography'],
    tags: ['award', 'International Photography Awards', 'architecture', 'Tree of Life']
  },
  {
    title: "International Photography Awards 2018 - 1st Place for \"Icarus\"",
    content: "Thrilled to receive 1st place in the Sports-Extreme sports subcategory, as well as the Category Winner for Sports, for \"Icarus\" in the 2018 International Photography Awards.",
    timestamp: new Date('2018-09-01'),
    type: ['achievement', 'photography'],
    tags: ['award', 'International Photography Awards', 'sports', 'Icarus', 'extreme sports']
  },
  {
    title: "International Photography Awards 2018 - 3rd Place for \"The Most Beautiful\"",
    content: "Awarded 3rd place in Special-Night Photography for my piece \"The Most Beautiful\" in the 2018 International Photography Awards.",
    timestamp: new Date('2018-09-01'),
    type: ['achievement', 'photography'],
    tags: ['award', 'International Photography Awards', 'night photography', 'The Most Beautiful']
  },
  {
    title: "International Photography Awards 2018 - 1st Place for \"Swan Lake\"",
    content: "Proud to receive 1st place in Nature-Seasons for \"Swan Lake\" in the 2018 International Photography Awards.",
    timestamp: new Date('2018-09-01'),
    type: ['achievement', 'photography'],
    tags: ['award', 'International Photography Awards', 'nature', 'Swan Lake']
  },
  {
    title: "International Photography Awards 2018 - 2nd Place for \"A Roof In Hong Kong\"",
    content: "Honored with 2nd place in Architecture-Other for my piece \"A Roof In Hong Kong\" in the 2018 International Photography Awards.",
    timestamp: new Date('2018-09-01'),
    type: ['achievement', 'photography'],
    tags: ['award', 'International Photography Awards', 'architecture', 'A Roof In Hong Kong']
  },
  {
    title: 'University of the Philippines\' Iskolandaryo 2017',
    content: 'Delighted to have my work featured in the University of the Philippines\' official 2017 calendar, the Iskolandaryo.',
    timestamp: new Date('2017-01-01'),
    type: ['achievement', 'photography'],
    tags: ['University of the Philippines', 'Iskolandaryo', 'calendar', 'feature']
  },
  {
    title: 'Featured in i-Mag Photography Magazine',
    content: 'Excited to have my work featured in i-Mag Photography Magazine, marking a proud moment in my photography journey.',
    timestamp: new Date('2017-08-14'),
    type: ['achievement', 'photography'],
    tags: ['photography', 'i-Mag Photography Magazine', 'feature']
  },
  {
    title: 'New Job as Data Scientist',
    content: 'Joined the Department of Science and Technology - Advanced Science and Technology Institute as a Data Scientist, for research and development of AI-driven solutions for the Filipino people.',
    timestamp: new Date('2025-03-17'),
    type: ['research','achievement'],
    tags: ['data science', 'AI']
  }
];
