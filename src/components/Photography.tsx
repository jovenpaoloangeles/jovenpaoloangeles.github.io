import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ExternalLink } from 'lucide-react';

export function Photography() {
  const photos = [
    {
      title: "Misty Mountain Dawn",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
      category: "Landscape",
      description: "First Place, International Mountain Photography Awards 2023"
    },
    {
      title: "Urban Geometry",
      url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80",
      category: "Architecture",
      description: "Featured in Architectural Digest, March 2023"
    },
    {
      title: "Morning Ritual",
      url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80",
      category: "Nature",
      description: "National Geographic Editor's Choice"
    },
    {
      title: "City Lights",
      url: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?auto=format&fit=crop&w=1200&q=80",
      category: "Night Photography",
      description: "Sony World Photography Awards Shortlist 2023"
    },
    {
      title: "Desert Solitude",
      url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80",
      category: "Landscape",
      description: "Winner, Fine Art Photography Awards 2023"
    },
    {
      title: "Ocean's Power",
      url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
      category: "Seascape",
      description: "Cover Photo, Ocean Geographic Magazine"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3]"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-medium text-primary-foreground/80 mb-2">
                  {photo.category}
                </p>
                <h3 className="text-lg font-semibold mb-1">{photo.title}</h3>
                <p className="text-sm text-gray-300">{photo.description}</p>
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