import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ExternalLink } from 'lucide-react';
import Carousel from './Carousel';

export function Photography() {
  const categories = [
    {
      title: "Astrophotography",
      images: [
        "/photography/Astrophotography/_DSC3965-Edit-Edit_1.jpg",
        "/photography/Astrophotography/_JOV5275.jpg"
      ],
      description: "Capturing the beauty of the night sky."
    },
    {
      title: "Infrared",
      images: [
        "/photography/Infrared/_DSC1389_1.jpg",
        "/photography/Infrared/_DSC4083-Recovered.jpg",
        "/photography/Infrared/_DSC4084-Edit.jpg",
        "/photography/Infrared/_DSC4957.jpg",
        "/photography/Infrared/_DSC6812.jpg",
        "/photography/Infrared/_DSC7116.jpg",
        "/photography/Infrared/DSC00476-Pano_1.jpg"
      ],
      description: "Exploring the world in infrared."
    },
    {
      title: "Landscapes",
      images: [
        "/photography/Landscapes/_DSC2202.jpg",
        "/photography/Landscapes/_JOV1325.jpg",
        "/photography/Landscapes/_MG_0010_001.jpg",
        "/photography/Landscapes/2016_Alimuom.jpg",
        "/photography/Landscapes/DSC01397_1.jpg",
        "/photography/Landscapes/DSC08476-Pano.jpg",
        "/photography/Landscapes/DSC09027.jpg",
        "/photography/Landscapes/DSC09556.jpg",
        "/photography/Landscapes/Swan Lake1-12.jpg"
      ],
      description: "Scenic views from around the world."
    },
    {
      title: "Minimalism",
      images: [
        "/photography/Minimalism/_DSC7125.jpg",
        "/photography/Minimalism/_DSC7195_3.jpg",
        "/photography/Minimalism/_DSC7238_1_001.jpg",
        "/photography/Minimalism/DSC02609.jpg",
        "/photography/Minimalism/DSC06181.jpg",
        "/photography/Minimalism/DSC06234.jpg",
        "/photography/Minimalism/DSC08217 1.jpg",
        "/photography/Minimalism/DSC08818.jpg"
      ],
      description: "The art of simplicity."
    },
    {
      title: "Series",
      images: [
        "/photography/Series/Nanay/_DSC4989.jpg",
        "/photography/Series/Nanay/_DSC4995.jpg",
        "/photography/Series/Nanay/_DSC5000.jpg",
        "/photography/Series/Nanay/_DSC5019.jpg",
        "/photography/Series/Nanay/_DSC5395.jpg",
        "/photography/Series/Nanay/_DSC5654.jpg",
        "/photography/Series/Nanay/_DSC5753.jpg",
        "/photography/Series/Nanay/_DSC5883.jpg",
        "/photography/Series/Nanay/_DSC5898.jpg",
        "/photography/Series/Nanay/_DSC5923.jpg",
        "/photography/Series/Rooftop/DSC00387.jpg",
        "/photography/Series/Rooftop/DSC01731.jpg",
        "/photography/Series/Rooftop/DSC03333.jpg",
        "/photography/Series/Rooftop/DSC03476 Panorama.jpg",
        "/photography/Series/Rooftop/DSC04119.jpg",
        "/photography/Series/Rooftop/DSC04292-Pano.jpg",
        "/photography/Series/Rooftop/DSC05648.jpg",
        "/photography/Series/Rooftop/DSC06151.jpg",
        "/photography/Series/Rooftop/DSC06199.jpg",
        "/photography/Series/Rooftop/DSC06215-Edit.jpg",
        "/photography/Series/Rooftop/DSC07099.jpg",
        "/photography/Series/Rooftop/DSC09614.jpg",
        "/photography/Series/Rooftop/DSC09835.jpg",
        "/photography/Series/Rooftop/StarStaX_DSC06571-DSC06634_gap_filling_00000063.jpg",
        "/photography/Series/Tekkadan/DSC09325.jpg",
        "/photography/Series/Tekkadan/DSC09334.jpg",
        "/photography/Series/Tekkadan/DSC09336.jpg",
        "/photography/Series/Tekkadan/DSC09337.jpg",
        "/photography/Series/Tekkadan/DSC09338.jpg",
        "/photography/Series/Tekkadan/DSC09339.jpg"
      ],
      description: "A collection of themed series."
    },
    {
      title: "Street",
      images: [
        "/photography/Street/_DSC0779.jpg",
        "/photography/Street/_DSC0811.jpg",
        "/photography/Street/_DSC1828_1.jpg",
        "/photography/Street/_DSC2191.jpg",
        "/photography/Street/_DSC2642.jpg",
        "/photography/Street/_DSC2716.jpg",
        "/photography/Street/_DSC6326.jpg",
        "/photography/Street/_DSC6877.jpg",
        "/photography/Street/_JOV0537.jpg",
        "/photography/Street/DSC00419.jpg",
        "/photography/Street/DSC04867.jpg",
        "/photography/Street/DSC07748 2.jpg",
        "/photography/Street/DSC08080.jpg",
        "/photography/Street/DSC09488.jpg",
        "/photography/Street/DSC09965.jpg"
      ],
      description: "Capturing the essence of urban life."
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
          <Camera className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-serif">Photography Portfolio</h2>
        </div>
        <a
          href="https://yourportfolio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View Full Portfolio
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3]"
          >
            <Carousel images={category.images} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-lg font-semibold mb-1">{category.title}</h3>
                <p className="text-sm text-gray-300">{category.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          All images are available for licensing. Contact for inquiries.
        </p>
      </div>
    </motion.div>
  );
}
