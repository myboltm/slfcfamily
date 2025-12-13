import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.6), rgba(168, 85, 247, 0.4)), url('https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/photo_2025-09-30_21-37-04.jpg')`
        }}
      />
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Welcome to <span className="text-purple-200">Shining Light</span> Family Church
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
          A place where faith grows, families flourish, and community thrives. 
          Join us in spreading God's love and light to our community.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            Plan Your Visit
          </button>
          <a 
            href="https://youtube.com/@shininglightfamilychurch6399?si=9qSExD-iZaOd0yp3"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-block text-center"
          >
            Watch Online
          </a>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 mx-auto max-w-2xl">
          <h3 className="text-2xl font-bold mb-4 text-purple-200">Join Us This Sunday</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-purple-200" />
              <span className="font-medium">9:00 AM</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-200" />
              <span className="font-medium"> behind state hospital Ota</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-200" />
              <span className="font-medium">Every Sunday</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;