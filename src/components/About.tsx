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
      <h2 className="text-2xl font-serif mb-4">About Me</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Hello! I am a Ph.D. candidate in materials science, deeply engaged in both the simulation of materials and the experimental synthesis of nanoparticles. My research primarily focuses on synthesizing gold, silver, and iron oxide nanostructures for spectroscopic applications, where I also simulate plasmons to understand their behavior and potential applications.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        In my quest to advance materials design and property prediction, I am exploring computational methods such as Bayesian optimization and machine learning. These cutting-edge techniques offer promising avenues for innovation in materials science, enabling more efficient and accurate predictions of material properties.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Beyond my academic pursuits, I am also a generative artist and a freelance photographer. This creative work allows me to explore the intersection of art and science, bringing a unique perspective to my research and artistic endeavors. I am passionate about collaborating with others who share my curiosity and drive to push the boundaries of what is possible.
      </p>
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
          href="#contact"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact Me
        </a>
      </div>
    </motion.div>
  );
}