import React from 'react';
import { Award } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function Certifications() {
  const certifications = [
    {
      title: 'Civil Service Professional Eligibility',
      details: 'Certification No. 0029, s. 2016 May 2016 - Philippines'
    },
    {
      title: 'Blockchain Specialization',
      details: 'Certificate ID: 0KC8CXJGZBAS - University at Buffalo \& The State University of New York',  
      courses: [
        { name: 'Blockchain Basics', license: 'I0I6RESS8A0A', date: 'Jul 2025' },
        { name: 'Smart Contracts', license: 'FFZ2EAAIVHKH', date: 'Sept 2025' },
        { name: 'Decentralized Applications (Dapps)', license: 'Z1QXSUG67VRK', date: 'Sept 2025' },
        { name: 'Blockchain Platforms', license: '0A92LYAQJ1NS', date: 'Sept 2025' }
      ]
    },
    {
      title: 'IBM RAG and Agentic AI Specialization',
      details: 'Certificate no: 96Y3IFM69UFO - IBM',
      courses: [
        { name: 'Develop Generative AI Applications', license: '1UAQXPDHPET7', date: 'Jul 2025' },
        { name: 'Build RAG Applications', license: 'KMBOA6AAH8OT', date: 'Jul 2025' },
        { name: 'Vector Databases for RAG', license: 'C765YI3KHR8N', date: 'Jul 2025' },
        { name: 'Build Multimodal Generative AI Applications', license: 'T4F0NKS9DN9P', date: 'Jul 2025' },
        { name: 'Fundamentals of Building AI Agents', license: 'NBUSB1LP04MB', date: 'Jul 2025' },
        { name: 'AI Agents and Agentic AI with Python & Generative AI', license: '6RBJDA2FFDN5', date: 'Jul 2025' },
        { name: 'Advanced RAG with Vector Databases and Retrievers', license: '10EXCHKWCNOD', date: 'Aug 2025' },
        { name: 'Agentic AI with LangChain and LangGraph', license: 'PML16ZYC9Z2Z', date: 'Sept 2025' }
      ]
    },
    {
      title: 'Data Science Specialization',
      details: 'John Hopkins University',  
      courses: [
        { name: 'The Data Scientist’s Toolbox', license: 'ZB7NJL28UL73', date: 'Oct 2017' },
        { name: 'R Programming', license: '8JNWC386HTF9', date: 'Oct 2017' },
        { name: 'Getting and Cleaning Data', license: 'VT9A8DXVN87F', date: 'Nov 2017' },
        { name: 'Exploratory Data Analysis', license: '8CEQ3SGVGASV', date: 'Dec 2017' }
      ]
    },
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-primary">Certifications</h3>
      <Accordion type="multiple" className="w-full">
        {certifications.map((cert, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-sm font-medium text-foreground text-left hover:no-underline">
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 mt-1 text-primary shrink-0" />
                <span>{cert.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {cert.details && (
                <p className="text-sm text-muted-foreground pl-6">{cert.details}</p>
              )}
              {cert.courses && (
                <div className="pl-6 pt-2 space-y-2">
                  {cert.courses.map((course, idx) => (
                    <div key={idx}>
                      <p className="text-sm text-foreground">{course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        License no: {course.license} {course.date}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
