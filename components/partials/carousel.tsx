"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useNavbar } from "@/components/navbar/basicNavbarContext";

interface Slide {
  src: string;
  alt: string;
}

interface CarouselProps {
  slides: Slide[];
}

export default function Carousel({ slides }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { height: navbarHeight } = useNavbar();
  const [carouselHeight, setCarouselHeight] = useState("100dvh");

  useEffect(() => {
    setCarouselHeight(`calc(100dvh - ${navbarHeight}px)`);
  }, [navbarHeight]);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative flex flex-col justify-center items-center text-center"
      style={{ height: carouselHeight }}
    >
      <div className="absolute w-full h-full overflow-hidden">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
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
      <div className="flex flex-col items-center justify-center xl:gap-[24px] gap-[5px] relative z-10">
        <h1 className="xl:text-[110px] md:text-[54px] lg:text-[84px] text-[34px] font-semibold text-white text-center xl:mx-[209px] lg:mx-[100px] md:mx-[100px] mx-0 xl:leading-[100px] lg:leading-[80px] md:leading-[50px] leading-[40px]">
          Revolutionize Your Basketball Analysis!
        </h1>
        <h5 className="xl:text-[24px] lg:text-[14px] text-[8px] font-normal text-white mb-[88px] xl:leading-[40px] leading-[10px] xl:mt-[14px] lg:mt-[24px] md:mt-[8px] mt-0 text-center">
          Upload, Analyze, and Improve – Gain Deeper Insights from Your Matches
          Instantly
        </h5>
      </div>
    </div>
  );
}
