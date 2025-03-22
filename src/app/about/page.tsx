'use client'
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass-card p-8 rounded-2xl">
          <h1 className="text-3xl font-bold mb-6">About BrainTrainX</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
              <p className="text-foreground/80">
                BrainTrainX is dedicated to empowering school principals and administrators with 
                AI-powered tools to create effective, engaging professional development sessions 
                for their teaching staff. We believe that well-trained teachers are the foundation 
                of successful educational outcomes.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">How It Works</h2>
              <p className="text-foreground/80">
                Our platform leverages Google Gemini AI technology to generate comprehensive 
                training plans based on your specific needs. Simply input your requirements, 
                including subject area, teaching level, and desired learning objectives, and our 
                AI assistant will create a detailed training plan within seconds.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">Features</h2>
              <ul className="list-disc list-inside space-y-2 text-foreground/80">
                <li>AI-generated training plans tailored to your specific needs</li>
                <li>Quick templates for common training scenarios</li>
                <li>Customizable parameters for precise training design</li>
                <li>Save and organize your favorite training plans</li>
                <li>Professional formatting suitable for immediate use</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-2">Get Started</h2>
              <p className="text-foreground/80">
                Return to the home page and try our plan generator. Input your requirements or start 
                with one of our templates, and watch as our AI creates a comprehensive training plan 
                for your teachers.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

