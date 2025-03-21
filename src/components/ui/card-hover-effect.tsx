
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export const CardHoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          ref={(el) => (cardsRef.current[idx] = el)}
          className="relative opacity-0 group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-primary/10 rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
          <div className="glass-card p-8 h-full rounded-2xl relative z-10 transition-all duration-300 group-hover:shadow-xl">
            <div className="flex flex-col h-full">
              <div className="p-3 rounded-xl bg-primary/10 w-max mb-5 text-primary">
                {item.icon}
              </div>
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-foreground/70 flex-grow">{item.description}</p>
              <div className="w-full h-8 flex items-center mt-4">
                <div
                  className={cn(
                    "h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full",
                    hoveredIndex === idx ? "w-full" : "w-0"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
