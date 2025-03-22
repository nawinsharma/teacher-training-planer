'use client'
import React from 'react';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen">
      <main className='mt-30 md:mt-4'>
        <HeroSection />
         {/* Features Section */}
       <div className="m-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Use EdPlanAI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Save Time",
                description: "Create professional training plans in seconds instead of hours",
                icon: "⏱️"
              },
              {
                title: "AI-Powered",
                description: "Leverage the latest AI technology to generate effective learning activities",
                icon: "🧠"
              },
              {
                title: "Customizable",
                description: "Tailor plans to your specific needs with detailed customization options",
                icon: "🛠️"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-none shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="p-6">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
