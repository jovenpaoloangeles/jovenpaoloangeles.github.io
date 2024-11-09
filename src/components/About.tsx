import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail } from 'lucide-react';

export function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-serif mb-4">Hi there!</h2>
      <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
        I'm a Ph.D. candidate in materials science, passionate about combining simulation and hands-on experimentation to push the boundaries of nanoparticle synthesis. My research centers on a Bayesian Optimization Framework for Accelerated Nanoparticle Synthesis, where I explore advanced computational techniques to streamline the creation of nanoparticles, specifically gold, silver, and iron oxide, for spectroscopic applications.      </p>
      <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
        Nanoparticles have immense potential in fields from medicine to environmental science, yet traditional synthesis methods often get bogged down in complex parameter spaces. In my current work, I’m using Bayesian optimization (BO) to address this challenge. BO’s probabilistic approach lets us balance exploration and efficiency, reducing the number of experiments needed to find optimal synthesis conditions. To make this process even more dynamic, my framework includes a “human-in-the-loop” approach, allowing real-time adjustments based on experimental data. This adaptability is being tested with both benchmarking functions and real-world applications, such as synthesizing silver nanoparticles and fullerene derivatives.      </p>
      <p className="text-muted-foreground leading-relaxed text-justify">
        Beyond academic work, I’m also a generative artist and freelance photographer, blending art and science to see things from fresh perspectives. Whether in the lab or the art studio, I’m always curious and open to collaborations with others who share a passion for discovery and creativity.      </p>
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