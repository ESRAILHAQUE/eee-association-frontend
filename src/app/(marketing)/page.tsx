'use client';

import { useState, useEffect } from 'react';
import Hero from '../Components/HomePageComponents/Hero';
import Achievements from '../Components/HomePageComponents/Achievements';
import Clubs from '../Components/HomePageComponents/Clubs';
import Events from '../Components/HomePageComponents/Events';
import Newsletter from '../Components/HomePageComponents/Newsletter';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 4);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 4) % 4);
  };

  return (
    <div className="font-sans">
      <Hero
        currentSlide={currentSlide}
        goToSlide={goToSlide}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
      />
      <Achievements />
      <Clubs />
      <Events />
   
    </div>
  );
}
