import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Wrench, MapPin } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';

export function Research() {
  const experiences = [
    {
      title: "University Researcher II",
      dateRange: "January 2023 - December 2023",
      keyAchievements: "Developed a graphene-MOF composite for COVID-19 pandemic mitigation.",
      techniques: "Electrospinning, Nanocomposite Synthesis",
      details: [
        "Led the development of a novel graphene-MOF composite aimed at enhancing membrane applications for COVID-19 pandemic mitigation",
        "Managed the setup and operation of bulk synthesis processes using electrospinning techniques"
      ]
    },
    {
      "title": "Visiting PhD Student",
      "dateRange": "Oct 2022 - Dec 2022",
      "keyAchievements": "Kansai-Asia Platform of Advanced Analytical Technologies (KAPLAT) Program",
      "techniques": "Raman Spectroscopy, SERS Calculations, Chemical Synthesis of Core-Shell Nanoparticles",
      "details": [
        "Synthesized gold-iron oxide core-shell nanoparticles for SERS applications",
        "Performed material characterization and calculated SERS enhancement factors",
        "Optimized synthesis methods for core-shell nanoparticle structures",
        "Utilized Raman spectroscopy to analyze magnetoplasmonic properties in exchange-biased ferrofluids"
      ]
    },
    {
      title: "University Researcher I",
      dateRange: "January 2022 - December 2022",
      keyAchievements: "Assessed wastewater from recycling companies.",
      techniques: "Zeolite/Bentonite Modification, Adsorption Efficiency Testing",
      details: [
        "Conducted comprehensive assessments of wastewater samples from recycling companies",
        "Modified zeolite and bentonite materials to enhance adsorption capabilities",
        "Performed rigorous efficiency tests on modified minerals"
      ]
    },
    {
      title: "Science Research Specialist I",
      dateRange: "January 2021 - December 2021",
      keyAchievements: "Fabricated graphene-based hybrid nanostructures for ultrasensitive metal ion detection.",
      techniques: "Numerical Simulations, SERS Enhancement",
      details: [
        "Fabricated advanced graphene-based hybrid nanostructures for metal ion detection",
        "Conducted numerical simulations for SERS enhancement optimization"
      ]
    },
    {
      title: "Research Assistant",
      dateRange: "May 2016 - May 2017",
      keyAchievements: "Characterized mechanical properties of Cordillera textiles.",
      techniques: "UTM, Imaging Setup Design",
      details: [
        "Characterized mechanical properties of Cordillera textiles using UTM",
        "Designed innovative imaging setup for pattern analysis",
        "Performed computational analysis on preserved textile samples"
      ]
    },
    {
      title: "Student Researcher",
      dateRange: "April 2014 - July 2014",
      keyAchievements: "Conducted research on Graphene, Carbon Nanotubes, and Zinc Oxide nanomaterials.",
      techniques: "Chemical Vapor Deposition, Electrochemical Deposition, Spray Pyrolysis",
      details: [
        "Researched fundamental properties of graphene, CNTs, and ZnO nanomaterials",
        "Performed material characterization using various methods",
        "Developed thin film production methods",
        "Designed modified low-cost Spray Pyrolysis setup"
      ]
    }
  ];

  const conferences = [
    {
      title: "Leveraging Machine Learning and Plasmonic Graphene Composites for Advanced Detection of Heavy Metals in Water",
      authors: "J. Angeles and M. Vega",
      venue: "National Research Council of the Philippines (NRCP) Annual Scientific Conference and 91st General Membership Assembly",
      location: "Philippine International Convention Center, Pasay City, Metro Manila, Philippines",
      date: "Mar 2024"
    },
    {
      title: "Exploring the adsorption capacity of acid-modified Philippine Natural Zeolites in wastewater treatment",
      authors: "J. Angeles, J. Lopez, K. Salazar, and M. Vega",
      venue: "Proceedings of the Samahang Pisika ng Pilipinas",
      location: "Siargao Island, Surigao del Norte, Philippines",
      date: "July 2023"
    },
    {
      title: "Investigation of water as solvent alternative for methanol-based ZIF-8 synthesis",
      authors: "T. Rodriguez, M. Ramos, J. Angeles, and M. Vega",
      venue: "Proceedings of the Samahang Pisika ng Pilipinas",
      location: "Siargao Island, Surigao del Norte, Philippines",
      date: "July 2023"
    },
    {
      title: "Synthesis of GO/− and rGO/ZIF-8 heterojunction composites",
      authors: "E. Casalme, R. Andig, J. Angeles, and M. Vega",
      venue: "Proceedings of the Samahang Pisika ng Pilipinas",
      location: "Legazpi City, Albay, Philippines",
      date: "2022",
      reference: "SPP-2022-2E-03"
    },
    {
      title: "Removal of methylene blue dye from water using silver-exchanged Philippine natural zeolites",
      authors: "L. Sayson, J. Lopez, J. Angeles, M. Tumanguil-Quitoras, and M. Vega",
      venue: "Proceedings of the Samahang Pisika ng Pilipinas",
      location: "Legazpi City, Albay, Philippines",
      date: "September 2022"
    },
    {
      title: "SERS Enhancement Factor of Gold Nanoparticle-Graphene Substrates",
      authors: "J. Angeles and M. Vega",
      venue: "Proceedings of the Samahang Pisika ng Pilipinas",
      location: "National Institute of Physics, Quezon City, Philippines",
      date: "Oct 2020"
    },
    {
      title: "Efficiency Assessment of SERS Hotspots Generated from Gold@Iron Oxide Interface",
      authors: "Y. Rola, J. Angeles, G. Cabrera, and M. Vega",
      venue: "Proceedings of the Samahang Pisika ng Pilipinas",
      location: "National Institute of Physics, Quezon City, Philippines",
      date: "Oct 2020"
    },
    {
      title: "Percolated graphene oxide with Au nanosphere spacer for SERS detection of glucose",
      authors: "G. Cabrera, J. Angeles, Y. Rola, and M. Vega",
      venue: "Proceedings of the Samahang Pisika ng Pilipinas",
      location: "National Institute of Physics, Quezon City, Philippines",
      date: "Oct 2020"
    },
    {
      title: "Surface Plasmon Resonance of Fe3O4−Au core-shell nanoparticles for SERS Applications by Finite Element Method",
      authors: "J. Angeles and M. Vega",
      venue: "National Research Council of the Philippines (NRCP) Annual Scientific Conference and 87th General Membership Assembly",
      location: "Philippine International Convention Center, Pasay City, Metro Manila, Philippines",
      date: "Jun 2020"
    },
    {
      title: "Discrete Dipole Approximation for Surface Plasmon Resonance of Fe3O4−Au nanoparticles",
      authors: "J. Angeles and M. Vega",
      venue: "Proceedings of the Annual Meeting of the Physical Society of Taiwan",
      location: "National Pingtung University, Pingtung, Taiwan",
      date: "Feb 2020"
    },
    {
      title: "Synthesis of Nitrogen-Doped Graphene Oxide using RF Plasma Treatment",
      authors: "J. Angeles, K. Duque, A. Payot, M. Vasquez, and M. Vega",
      venue: "International Symposium of the Vacuum Society of the Philippines",
      location: "Cebu City, Philippines",
      date: "Jan 2020"
    },
    {
      title: "Surface plasmon resonance of Fe3O4−Au spherical nanoparticles by discrete dipole approximation",
      authors: "J. Angeles and M. Vega",
      venue: "ICTP Asian Network School and Workshop on Complex Condensed Matter Systems 2019",
      location: "National Institute of Physics, Quezon City, Philippines",
      date: "Nov 2019"
    },
    {
      title: "Anthropological, Mathematical Symmetry and Technical Characterization of Cordillera Textiles",
      authors: "A. Salvador-Amores, et. al.",
      venue: "Office of the Vice President for Academic Affairs Research Symposium",
      location: "Quezon City, Philippines",
      date: "Oct 2016"
    },
    {
      title: "Fabrication of Triboelectric Generators",
      authors: "J. Angeles and I. Agulo",
      venue: "Proceedings of the 4th Materials of Value and Essence Symposium",
      location: "Quezon City, Philippines",
      date: "Jul 2015"
    },
    {
      title: "Voltage–Frequency and Voltage–Surface Area Relationship of Triboelectric Nanogenerator",
      authors: "L. Pengson, A. Payot, K. Duque, J. Angeles, I. Agulo",
      venue: "Proceedings of the 4th Materials of Value and Essence Symposium",
      location: "Quezon City, Philippines",
      date: "Jul 2015"
    },
    {
      title: "Surface Modification of Ceramic Through HCl Treatment and its Effect on the Growth of Spray-Pyrolized ZnO",
      authors: "J. Angeles, C. Pascua, I. Agulo",
      venue: "Proceedings of the 2015 Annual Philippine–American Academy of Science Engineering (PAASE) Meeting and Symposium",
      location: "De La Salle University, Manila, Philippines",
      date: "Oct 2014"
    },
    {
      title: "Spray-Pyrolized Zinc Oxide Structures Grown on Surface Modified Ceramic by Acid Treatment",
      authors: "J. Angeles and I. Agulo",
      venue: "Proceedings of the 3rd Materials of Value and Essence Symposium",
      location: "Baguio City, Philippines",
      date: "Oct 2014"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="research-experience">
          <AccordionTrigger>
            <h2 className="text-2xl font-serif mb-6">Research Experience</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-black" />
                      {exp.dateRange}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-black" />
                      {exp.keyAchievements}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wrench className="w-4 h-4 text-black" />
                      {exp.techniques}
                    </div>
                  </div>

                  <div className="mt-3 pl-4 border-l-2 border-blue-100">
                    <ul className="space-y-1">
                      {exp.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="conference-proceedings">
          <AccordionTrigger>
            <h2 className="text-2xl font-serif mb-6">Conference Proceedings and Presentations</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              {conferences.map((conference, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900">{conference.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{conference.authors}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">{conference.venue}</p>
                    {conference.reference && (
                      <p className="text-sm text-gray-600">Reference: {conference.reference}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {conference.date}
                      </span>
                      {conference.location && (
                        <span className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {conference.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
