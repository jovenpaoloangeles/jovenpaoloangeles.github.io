import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import Carousel from './Carousel';

export function Photography() {
  const categories = [
    {
      title: "Astrophotography",
      images: [
        "/photography/Astrophotography/_DSC3965-Edit-Edit_1.webp",
        "/photography/Astrophotography/_JOV5275.webp"
      ],
      description: "Capturing the beauty of the night sky."
    },
    {
      title: "Infrared",
      images: [
        "/photography/Infrared/_DSC1389_1.webp",
        "/photography/Infrared/_DSC4083-Recovered.webp",
        "/photography/Infrared/_DSC4084-Edit.webp",
        "/photography/Infrared/_DSC4957.webp",
        "/photography/Infrared/_DSC6812.webp",
        "/photography/Infrared/_DSC7116.webp",
        "/photography/Infrared/DSC00476-Pano_1.webp"
      ],
      description: "Exploring the world in infrared."
    },
    {
      title: "Landscapes",
      images: [
        "/photography/Landscapes/_DSC2202.webp",
        "/photography/Landscapes/_JOV1325.webp",
        "/photography/Landscapes/_MG_0010_001.webp",
        "/photography/Landscapes/2016_Alimuom.webp",
        "/photography/Landscapes/DSC01397_1.webp",
        "/photography/Landscapes/DSC08476-Pano.webp",
        "/photography/Landscapes/DSC09027.webp",
        "/photography/Landscapes/DSC09556.webp",
        "/photography/Landscapes/Swan Lake1-12.webp"
      ],
      description: "Scenic views from around the world."
    },
    {
      title: "Minimalism",
      images: [
        "/photography/Minimalism/_DSC7125.webp",
        "/photography/Minimalism/_DSC7195_3.webp",
        "/photography/Minimalism/_DSC7238_1_001.webp",
        "/photography/Minimalism/DSC02609.webp",
        "/photography/Minimalism/DSC06181.webp",
        "/photography/Minimalism/DSC06234.webp",
        "/photography/Minimalism/DSC08217 1.webp",
        "/photography/Minimalism/DSC08818.webp"
      ],
      description: "The art of simplicity."
    },
    {
      title: "Series",
      images: [
        "/photography/Series/Nanay/_DSC4989.webp",
        "/photography/Series/Nanay/_DSC4995.webp",
        "/photography/Series/Nanay/_DSC5000.webp",
        "/photography/Series/Nanay/_DSC5019.webp",
        "/photography/Series/Nanay/_DSC5395.webp",
        "/photography/Series/Nanay/_DSC5654.webp",
        "/photography/Series/Nanay/_DSC5753.webp",
        "/photography/Series/Nanay/_DSC5883.webp",
        "/photography/Series/Nanay/_DSC5898.webp",
        "/photography/Series/Nanay/_DSC5923.webp",
        "/photography/Series/Rooftop/DSC00387.webp",
        "/photography/Series/Rooftop/DSC01731.webp",
        "/photography/Series/Rooftop/DSC03333.webp",
        "/photography/Series/Rooftop/DSC03476 Panorama.webp",
        "/photography/Series/Rooftop/DSC04119.webp",
        "/photography/Series/Rooftop/DSC04292-Pano.webp",
        "/photography/Series/Rooftop/DSC05648.webp",
        "/photography/Series/Rooftop/DSC06151.webp",
        "/photography/Series/Rooftop/DSC06199.webp",
        "/photography/Series/Rooftop/DSC06215-Edit.webp",
        "/photography/Series/Rooftop/DSC07099.webp",
        "/photography/Series/Rooftop/DSC09614.webp",
        "/photography/Series/Rooftop/DSC09835.webp",
        "/photography/Series/Rooftop/StarStaX_DSC06571-DSC06634_gap_filling_00000063.webp",
        "/photography/Series/Tekkadan/DSC09325.webp",
        "/photography/Series/Tekkadan/DSC09334.webp",
        "/photography/Series/Tekkadan/DSC09336.webp",
        "/photography/Series/Tekkadan/DSC09337.webp",
        "/photography/Series/Tekkadan/DSC09338.webp",
        "/photography/Series/Tekkadan/DSC09339.webp"
      ],
      description: "A collection of themed series."
    },
    {
      title: "Street",
      images: [
        "/photography/Street/_DSC0779.webp",
        "/photography/Street/_DSC0811.webp",
        "/photography/Street/_DSC1828_1.webp",
        "/photography/Street/_DSC2191.webp",
        "/photography/Street/_DSC2642.webp",
        "/photography/Street/_DSC2716.webp",
        "/photography/Street/_DSC6326.webp",
        "/photography/Street/_DSC6877.webp",
        "/photography/Street/_JOV0537.webp",
        "/photography/Street/DSC00419.webp",
        "/photography/Street/DSC04867.webp",
        "/photography/Street/DSC07748 2.webp",
        "/photography/Street/DSC08080.webp",
        "/photography/Street/DSC09488.webp",
        "/photography/Street/DSC09965.webp"
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
