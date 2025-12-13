import React from 'react';
import { Heart, Users, BookOpen, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: "Love",
      description: "We believe in the transformative power of God's love and strive to share it with everyone we meet."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building strong, supportive relationships that help each other grow in faith and life."
    },
    {
      icon: BookOpen,
      title: "Scripture",
      description: "Grounding our faith and teaching in the timeless truths of God's Word."
    },
    {
      icon: Lightbulb,
      title: "Purpose",
      description: "Helping each person discover and live out their God-given purpose in the world."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Our <span className="text-purple-600">Church</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            For decades, Shining Light Family Church has been a beacon of hope 
            and love in our community. We are a diverse family of believers committed 
            to growing together in faith, hope, and love.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              To be a shining light in our community by sharing the love of Christ, 
              nurturing spiritual growth, and serving others with compassion and grace. 
              We believe that every person has value and purpose in God's kingdom.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Through worship, fellowship, and service, we seek to make disciples 
              who will transform our community and world with the light of Christ.
            </p>
          </div>
          <div 
            className="rounded-2xl shadow-2xl h-96 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/photo_2025-09-30_21-45-01.jpg')`
            }}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h4>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;