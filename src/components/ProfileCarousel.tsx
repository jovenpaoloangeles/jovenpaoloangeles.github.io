import { useEffect, useState } from 'react';

const profileImages = [
  {
    src: '/profile_pictures/profile-photo.webp',
    alt: 'Portrait of Joven Paolo Angeles smiling outdoors'
  },
  {
    src: '/profile_pictures/profileart.png',
    alt: 'Illustrated self-portrait of Joven Paolo Angeles in geometric style'
  }
];

export function ProfileCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === profileImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-40 h-40 mx-auto mb-4 rounded-full border-4 border-primary overflow-hidden"
      role="region"
      aria-label="Profile photo carousel"
      aria-roledescription="carousel"
    >

      {profileImages.map((image, index) => {
        const isActive = index === currentImageIndex;
        return (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${profileImages.length}`}
            aria-hidden={!isActive}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}

      <p className="sr-only" aria-live="polite">
        {profileImages[currentImageIndex].alt}
      </p>
    </div>
  );
}
