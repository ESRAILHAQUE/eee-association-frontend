"use client";

import Image from "next/image";
import {
  Shield,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const heroSlides = [
  {
    id: 1,
    image: "/images/hero-section/hero-1.jpeg",
    title: "Advancing Electrical Engineering Excellence",
    subtitle: "Empowering Innovation Through Technology",
    description:
      "Join a community of forward-thinking electrical engineers dedicated to shaping the future of technology and innovation.",
    badge: "Innovation Hub",
  },
  {
    id: 2,
    image: "/images/hero-section/hero-2.jpeg",
    title: "Smart Solutions for Modern Challenges",
    subtitle: "Research • Development • Implementation",
    description:
      "Collaborate on cutting-edge research projects and develop intelligent systems that address real-world engineering challenges.",
    badge: "Research Excellence",
  },
  {
    id: 3,
    image: "/images/hero-section/hero-1.jpeg",
    title: "Building Tomorrow's Engineers Today",
    subtitle: "Education • Mentorship • Growth",
    description:
      "Experience comprehensive learning through hands-on projects, expert mentorship, and collaborative problem-solving.",
    badge: "Academic Excellence",
  },
  {
    id: 4,
    image: "/images/hero-section/hero-2.jpeg",
    title: "Connect. Create. Contribute.",
    subtitle: "Professional Network • Industry Partnerships",
    description:
      "Build lasting professional relationships and contribute to groundbreaking innovations in electrical engineering.",
    badge: "Professional Network",
  },
];

interface HeroProps {
  currentSlide: number;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export default function Hero({
  currentSlide,
  goToSlide,
  nextSlide,
  prevSlide,
}: HeroProps) {
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
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative h-full w-full flex-shrink-0">
              <Image
                src={slide.image}
                alt={slide.title}
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
              <div className="inline-flex items-center px-4 py-2 text-white rounded-full text-sm font-medium border border-white/60 bg-transparent">
                <Shield className="w-4 h-4 mr-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
                <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {heroSlides[currentSlide].badge}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="text-lg sm:text-xl text-slate-100 font-semibold drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
                {heroSlides[currentSlide].subtitle}
              </p>

              <p className="text-base sm:text-lg text-slate-100 max-w-2xl leading-relaxed drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
                {heroSlides[currentSlide].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
