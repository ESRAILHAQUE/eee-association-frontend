"use client";

import Image from "next/image";
import {
  Shield,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// hardcoded fallback
export const defaultHeroSlides = [
  {
    id: 1,
    image: "/images/hero-section/hero-1.jpeg",
    title: "Advancing Electrical Engineering Excellence",
    subtitle: "Empowering Innovation Through Technology",
    description: "Join a community of forward-thinking electrical engineers...",
    badge: "Innovation Hub",
  },
  {
    id: 2,
    image: "/images/hero-section/hero-2.jpeg",
    title: "Innovating for a Better Future",
    subtitle: "Excellence in Research and Development",
    description: "Discover ground-breaking projects and collaborate with brilliant minds.",
    badge: "Research",
  },
  {
    id: 3,
    image: "/images/hero-section/hero-3.jpeg",
    title: "Empowering the Next Generation",
    subtitle: "Building the Engineers of Tomorrow",
    description: "Participate in workshops, seminars, and networking events.",
    badge: "Education",
  },
  {
    id: 4,
    image: "/images/hero-section/hero-4.jpeg",
    title: "Connecting Professionals",
    subtitle: "A Strong Alumni Network",
    description: "Engage with industry leaders and alumni from around the globe.",
    badge: "Community",
  }
];

interface HeroProps {
  slides?: any[];
  currentSlide: number;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export default function Hero({
  slides = [],
  currentSlide,
  goToSlide,
  nextSlide,
  prevSlide,
}: HeroProps) {
  const heroSlides = slides.length > 0 ? slides : defaultHeroSlides;
  const slide = heroSlides[currentSlide] || heroSlides[0];
  
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full w-full will-change-transform"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: "transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1)",
          }}>
          {heroSlides.map((s, index) => (
            <div
              key={index}
              className="relative h-full w-full flex-shrink-0 ">
              <Image
                src={s.image}
                alt={s.title}
                fill
                className="object-cover"
                priority={index === 0}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20 group">
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20 group">
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* Dynamic Content */}
            <div className="space-y-4 sm:space-y-6 text-slate-50">


              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
                {slide?.title}
              </h1>

              <p className="text-lg sm:text-xl text-slate-100 font-semibold drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
                {slide?.subtitle}
              </p>

              <p className="text-base sm:text-lg text-slate-100 max-w-2xl leading-relaxed drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
                {slide?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
