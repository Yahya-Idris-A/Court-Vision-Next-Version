"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
}

interface CarouselProps {
  slides: Slide[];
}

export default function Carousel({ slides }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const goToNextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    };
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  return (
    <div className="flex flex-col justify-center w-full h-full items-center text-center rounded-[10px]">
      <div className="w-full h-full rounded-[10px] overflow-hidden">
        <div className="relative w-full h-full rounded-[10px]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 rounded-[10px] transition-opacity duration-1000 ease-in-out ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover rounded-[10px]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full cursor-pointer ${
                  currentSlide === index ? "bg-[#fd6a2a]" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
