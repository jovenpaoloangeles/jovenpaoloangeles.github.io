import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Wrench } from 'lucide-react';

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-serif mb-6">Research Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div 
            key={index} 
            className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
            
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                {exp.dateRange}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="w-4 h-4 text-blue-500" />
                {exp.keyAchievements}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Wrench className="w-4 h-4 text-blue-500" />
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
    </motion.div>
  );
}