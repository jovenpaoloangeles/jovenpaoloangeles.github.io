import React from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Mail,
  FlaskConical,
  BrainCircuit,
  Camera,
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
        <FlaskConical className="w-5 h-5 text-primary mt-1" />
        <p className="text-muted-foreground leading-relaxed text-justify">
          I'm a Ph.D. candidate in Materials Science at the University of the Philippines, working at the intersection of simulation and experimentation. My research focuses on a <strong>Bayesian Optimization Framework for Accelerated Nanoparticle Synthesis</strong>, streamlining the creation of gold, silver, and iron-oxide nanoparticles for spectroscopic applications.
        </p>

        <BrainCircuit className="w-5 h-5 text-primary mt-1" />
        <p className="text-muted-foreground leading-relaxed text-justify">
          Traditional synthesis struggles with complex parameter spaces. By coupling <strong>Bayesian Optimization (BO)</strong> with a human-in-the-loop strategy, I minimize experiments while updating models in real time. Benchmarks and real systems (silver nanoparticles, fullerene derivatives) validate the approach.
        </p>

        <Camera className="w-5 h-5 text-primary mt-1" />
        <p className="text-muted-foreground leading-relaxed text-justify">
          Outside the lab, I'm a generative artist and freelance photographer. I explore the crossover of code and creativity to communicate scientific ideas visually.
        </p>

        {/* Research Goals */}
        <Target className="w-5 h-5 text-primary mt-1" />
        <p className="text-muted-foreground leading-relaxed text-justify">
          <strong>Research Goal&nbsp;🎯</strong>&nbsp;—&nbsp;to cut experimental cost and time by at least&nbsp;50 % for nanoparticle discovery, enabling reproducible, shareable protocols across labs and accelerating tech transfer to biomedical and environmental applications.
        </p>

        {/* Collaboration Hook */}
        <Users className="w-5 h-5 text-primary mt-1" />
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
