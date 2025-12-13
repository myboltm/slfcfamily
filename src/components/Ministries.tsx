import React from 'react';
import { Users, Baby, Music, Handshake, BookOpen, Coffee } from 'lucide-react';

const Ministries: React.FC = () => {
  const ministries = [
    {
      icon: Users,
      title: "Adult Ministries",
      description: "Bible studies, small groups, and fellowship opportunities for adults of all ages.",
      image: "https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/photo_2025-09-30_23-21-22.jpg"
    },
    {
      icon: Baby,
      title: "Children's Ministry",
      description: "Age-appropriate programs that help children learn about God's love in fun, engaging ways.",
      image: "https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/photo_2025-09-30_21-33-19.jpg"
    },
    {
      icon: Music,
      title: "Worship Ministry",
      description: "Join our choir, band, or tech team to help lead our congregation in worship.",
      image: "https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/photo_2025-09-30_21-44-54.jpg"
    },
    {
      icon: Handshake,
      title: "Community Outreach",
      description: "Serving our local community through food drives, charity events, and volunteer work.",
      image: "https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/photo_2025-09-30_22-51-37.jpg"
    },
    {
      icon: BookOpen,
      title: "Youth Ministry",
      description: "Dynamic programs for teenagers focused on faith, friendship, and fun.",
      image: "https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/photo_2025-09-30_23-06-31.jpg"
    },
    {
      icon: Coffee,
      title: "Hospitality Team",
      description: "Creating a welcoming environment for visitors and members alike.",
      image: "https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    }
  ];

  return (
    <section id="ministries" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-purple-600">Ministries</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover ways to grow, serve, and connect through our various ministry opportunities. 
            There's a place for everyone in our church family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministries.map((ministry, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url('${ministry.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all duration-300" />
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ministry.icon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">{ministry.title}</h4>
                <p className="text-gray-600 leading-relaxed">{ministry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ministries;