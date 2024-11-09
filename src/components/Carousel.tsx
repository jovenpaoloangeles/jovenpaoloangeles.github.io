import React, { useState, useEffect, useRef } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '0px 0px 200px 0px' }
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
            src={image} // Add initial src for immediate loading
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
