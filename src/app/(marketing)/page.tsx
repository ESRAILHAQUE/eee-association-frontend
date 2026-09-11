'use client';

import { useState, useEffect } from 'react';
import { fetchHomepageSettings } from '@/lib/api';
import Hero from '../Components/HomePageComponents/Hero';
import Achievements from '../Components/HomePageComponents/Achievements';
import Clubs from '../Components/HomePageComponents/Clubs';
import Events from '../Components/HomePageComponents/Events';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHomepageSettings().then((res) => {
      setData(res);
    }).catch(console.error);
  }, []);

  const slideCount = data?.hero?.length || 4;

  useEffect(() => {
    if (slideCount === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideCount]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (slideCount === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const prevSlide = () => {
    if (slideCount === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  if (!data) return null; // or a loader

  return (
    <div className="font-sans">
      <Hero
        slides={data.hero || []}
        currentSlide={currentSlide}
        goToSlide={goToSlide}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
      />
      <Achievements achievements={data.achievements || []} />
      <Clubs clubs={data.clubs || []} />
      <Events events={data.events || []} />
    </div>
  );
}
