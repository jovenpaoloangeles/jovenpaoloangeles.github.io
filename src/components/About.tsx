import React from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Mail,
  FlaskConical,
  Briefcase,
  Printer,
  Target,
  Users
} from 'lucide-react';

export function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-x-6 gap-y-8 items-start">
        {/* Main Paragraphs */}
        <FlaskConical className="w-5 h-5 text-primary mt-1 shrink-0" />
        <p className="text-muted-foreground leading-relaxed text-justify">
          I'm a Ph.D. candidate in Materials Science at the University of the Philippines, where I'm developing a <strong>Bayesian Optimization Framework</strong> to accelerate nanoparticle synthesis. This work merges my interests in advanced materials and intelligent algorithms, allowing me to streamline the creation of nanoparticles for spectroscopic applications.
        </p>

        <Briefcase className="w-5 h-5 text-primary mt-1 shrink-0" />
        <p className="text-muted-foreground leading-relaxed text-justify">
          This passion for applying cutting-edge computation to complex problems extends to my professional life as a <strong>Senior AI Engineer</strong>. With a background in <strong>Data Science</strong> and <strong>Blockchain</strong>, I enjoy building intelligent systems that make a real-world impact and exploring the potential of decentralized technologies.
        </p>

        <Printer className="w-5 h-5 text-primary mt-1 shrink-0" />
        <p className="text-muted-foreground leading-relaxed text-justify">
          Beyond my academic and professional work, I have a passion for bringing ideas to life. This takes many forms—from running my 3D printing business, <a href="https://print3dmnl.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PRINT3D.MNL</a>, to exploring the intersection of code and creativity as a generative artist and freelance photographer.
        </p>

        {/* Research Goals */}
        <Target className="w-5 h-5 text-primary mt-1 shrink-0" />
        <p className="text-muted-foreground leading-relaxed text-justify">
          <strong>Research Goal&nbsp;🎯</strong>&nbsp;—&nbsp;to cut experimental cost and time by at least&nbsp;50 % for nanoparticle discovery, enabling reproducible, shareable protocols across labs and accelerating tech transfer to biomedical and environmental applications.
        </p>

        {/* Collaboration Hook */}
        <Users className="w-5 h-5 text-primary mt-1 shrink-0" />
        <p className="text-muted-foreground leading-relaxed text-justify">
          <strong>Let’s collaborate&nbsp;🤝</strong>&nbsp;—&nbsp;if you’re exploring sustainable nanomaterials, adaptive optimization, or the fusion of art and science, feel free to reach out!
        </p>
      </div>

      {/*––– action buttons –––*/}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <a
          href="/cv-academic.pdf"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Academic CV
        </a>
        <a
          href="/cv-photography.pdf"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Photography CV
        </a>
        <a
          href="mailto:jovenpaoloangeles@gmail.com"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact Me
        </a>
      </div>
    </motion.div>
  );
}
