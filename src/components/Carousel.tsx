import React, { useState, useEffect, useRef } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useRef(true);

  useEffect(() => {
    // Set up intersection observer to pause carousel when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    // Only cycle images when visible
    const interval = setInterval(() => {
      if (isVisible.current) {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [images.length]);

  // Lazy loading images
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              observer.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px 0px' }
    );

    const images = carouselRef.current?.querySelectorAll('img[data-src]') || [];
    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [currentImageIndex]);

  return (
    <div ref={carouselRef} className="relative w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            data-src={image}
            src={image} // Preload current image
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
            width="800"
            height="600"
          />
        </div>
      ))}
    </div>
  );
};

export default Carousel;
