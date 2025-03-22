'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  let animationFrameId: number;

  useEffect(() => {
    const handleParallax = (e: MouseEvent | TouchEvent) => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const moveX = (x - rect.width / 2) / 30;
      const moveY = (y - rect.height / 2) / 30;

      cancelAnimationFrame(animationFrameId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      animationFrameId = requestAnimationFrame(() => {
        heroRef.current?.querySelectorAll('[data-parallax]').forEach((el) => {
          if (el instanceof HTMLElement) {
            const depth = parseFloat(el.dataset.parallax || '0');
            el.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
          }
        });
      });
    };

    document.addEventListener('mousemove', handleParallax);
    document.addEventListener('touchmove', handleParallax);

    return () => {
      document.removeEventListener('mousemove', handleParallax);
      document.removeEventListener('touchmove', handleParallax);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" data-parallax="1.5"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-300/5 blur-3xl pointer-events-none" data-parallax="2.5"></div>

      <div className="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Hero Content */}
        <div className="staggered-fade-in space-y-6 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            AI-Powered <span className="text-blue-600">Teacher Training</span> for Modern Educators
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70">
            Empower your teachers with personalized, AI-generated training plans tailored to their needs and goals. Enhance professional development with minimal effort.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {/* Ensure Buttons Are Clickable */}
            <Button
              onClick={() => router.push('/create')}
              className="relative z-50 bg-blue-500 hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
            >
              Generate a Plan using prompt <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => router.push('/plangen')}
              className="relative z-50 bg-green-500 hover:bg-green-600 flex items-center gap-2 cursor-pointer"
            >
              Generate a custom plan <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="glass-card p-6 rounded-2xl overflow-hidden relative" data-parallax="-0.5">
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-blue-400/35 rounded-full blur-2xl pointer-events-none"></div>

          <img
            src="https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
            alt="Teachers in a training session"
            className="w-full h-auto rounded-xl object-cover aspect-video shadow-lg animate-fade-in"
          />

          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Intelligent Training Plans</h3>
            <p className="text-foreground/70">
              Our AI analyzes educational needs, teaching styles, and school contexts to create comprehensive training programs.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-foreground/60">Powered by advanced AI models</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
