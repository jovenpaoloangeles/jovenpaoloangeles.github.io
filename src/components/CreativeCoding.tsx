import React from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
// Assuming a Carousel component is available for import
import Carousel from './Carousel';

export function CreativeCoding() {
  const projects = [
    {
      title: 'FloraWeave',
      images: [
        '/creative_coding/Flowers/flowers1590372371741.png',
        '/creative_coding/Flowers/screen-0310.png'
      ],
      description: 'A generative art project exploring the organic complexity of floral patterns, developed through unique algorithmic processes that mimic the randomness and beauty found in nature.'
    },
    {
      title: 'Mondrian',
      images: [
        '/creative_coding/Mondrian/829.png',
        '/creative_coding/Mondrian/935.png',
        '/creative_coding/Mondrian/1551.png',
        '/creative_coding/Mondrian/5225.png',
        '/creative_coding/Mondrian/9965.png'
      ],
      description: 'Inspired by Piet Mondrian, this series transforms his geometric abstraction style into a digital form, using randomized algorithms to generate dynamic compositions that honor his iconic approach.'
    },
    {
      title: 'SigilCraft',
      images: [
        '/creative_coding/Runes/DifferentColorRunes1202.png',
        '/creative_coding/Runes/DifferentColorRunes4158.png',
        '/creative_coding/Runes/DifferentColorRunes5632.png'
      ],
      description: 'Exploring the symbolic meanings behind runes, this project uses vibrant colors and patterns to reinterpret these ancient symbols in a modern digital context.'
    },
    {
      title: 'Skin of Code',
      images: [
        '/creative_coding/Textures/sketch_200525a_1590394972841.png',
        '/creative_coding/Textures/texture_1590395011079.png',
        '/creative_coding/Textures/texture_1590395016662.png'
      ],
      description: 'This project dives into the world of textures, creating intricate patterns and surfaces through generative algorithms that mimic various tactile experiences.'
    },
    {
      title: 'Drift Cycle',
      images: [
        '/creative_coding/Waveclock/waveclock1590457783786.png',
        '/creative_coding/Waveclock/waveclock1590458552313.png',
        '/creative_coding/Waveclock/waveclock1590458572198.png'
      ],
      description: 'A time-based visual art piece that illustrates the passage of time through oscillating wave patterns, providing a visual rhythm that mirrors the concept of a clock.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-serif">Creative Coding Portfolio</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3]"
          >
            <Carousel images={project.images} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                <p className="text-sm text-gray-300">{project.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          All projects are available for collaboration. Contact for inquiries.
        </p>
      </div>
    </motion.div>
  );
}
