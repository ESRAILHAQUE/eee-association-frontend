'use client'

import Image from 'next/image'
import { Shield, ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react'

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop&crop=center",
    title: "Advancing Electrical Engineering Excellence",
    subtitle: "Empowering Innovation Through Technology",
    description: "Join a community of forward-thinking electrical engineers dedicated to shaping the future of technology and innovation.",
    badge: "Innovation Hub"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&crop=center",
    title: "Smart Solutions for Modern Challenges",
    subtitle: "Research • Development • Implementation",
    description: "Collaborate on cutting-edge research projects and develop intelligent systems that address real-world engineering challenges.",
    badge: "Research Excellence"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=center",
    title: "Building Tomorrow's Engineers Today",
    subtitle: "Education • Mentorship • Growth",
    description: "Experience comprehensive learning through hands-on projects, expert mentorship, and collaborative problem-solving.",
    badge: "Academic Excellence"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1920&h=1080&fit=crop&crop=center",
    title: "Connect. Create. Contribute.",
    subtitle: "Professional Network • Industry Partnerships",
    description: "Build lasting professional relationships and contribute to groundbreaking innovations in electrical engineering.",
    badge: "Professional Network"
  }
]

interface HeroProps {
  currentSlide: number
  goToSlide: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void
}

export default function Hero({ 
  currentSlide, 
  goToSlide, 
  nextSlide, 
  prevSlide 
}: HeroProps) {
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ zIndex: index === currentSlide ? 1 : 0 }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20 group"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* Dynamic Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-white/20">
                <Shield className="w-4 h-4 mr-2" />
                {heroSlides[currentSlide].badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="text-xl sm:text-2xl text-slate-300 font-medium">
                {heroSlides[currentSlide].subtitle}
              </p>

              <p className="text-lg text-slate-200 max-w-2xl leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center group">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}
