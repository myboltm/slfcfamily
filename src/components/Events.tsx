import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const Events: React.FC = () => {
  const events = [
    {
      title: "Sunday Worship Service",
      date: "Every Sunday",
      time: "9:00 AM",
      location: "Main Sanctuary",
      description: "Join us for uplifting worship, inspiring messages, and fellowship.",
      recurring: true,
      image: "https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/photo_2025-09-30_21-45-01.jpg"
    },
    {
      title: "Youth Christian Apologetics Hangout",
      date: "Every Sunday",
      time: "8:00 PM",
      location: "Zoom",
      description: "Learning about Who God is, what we believe and why we believe what we believe.",
      recurring: true,
      image: "https://images.pexels.com/photos/8923057/pexels-photo-8923057.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      title: "(Wednesday Bible Study) Word Encounter Service",
      date: "Every Wednesday",
      time: "5:55 PM",
      location: "Main Sanctuary",
      description: "Join us for a powerful mid-week service focused on the Word of God.",
      recurring: true,
      image: "https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      title: "Present Your Case Prayer Service",
      date: "Last Friday of the Month",
      time: "5:55 PM",
      location: "Church Auditorium",
      description: "A dedicated prayer service to bring your petitions before God.",
      recurring: true,
      image: "https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/photo_2025-10-03_16-02-34.jpg"
    }
  ];

  const upcomingEvents = [
    {
      title: "Evening of Hymns",
      date: "Sunday, October 5th, 2025",
      time: "4:00 - 6:00 PM",
      location: "Main Sanctuary",
      description: "Join us for a beautiful evening filled with traditional hymns and worship songs that have blessed generations.",
      recurring: false,
      image: "data:image/jpeg;base64,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"
    }
  ];

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Upcoming <span className="text-purple-600">Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join us for worship services, community events, and fellowship opportunities. 
            There's always something happening at Shining Light Family Church.
          </p>
        </div>

        {/* Upcoming Special Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Special <span className="text-purple-600">Events</span>
            </h3>
            <div className="grid lg:grid-cols-2 gap-8">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={`special-${index}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-purple-200"
                >
                  <div className="lg:flex">
                    <div 
                      className="lg:w-1/3 h-48 lg:h-auto bg-cover bg-center relative overflow-hidden"
                      style={{ backgroundImage: `url('${event.image}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 group-hover:to-black/40 transition-all duration-300" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                          Special Event
                        </span>
                      </div>
                    </div>
                    <div className="lg:w-2/3 p-8">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                        {event.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                          <span className="font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-5 w-5 text-purple-600 mr-3" />
                          <span className="font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                          <span className="font-medium">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          {events.map((event, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="lg:flex">
                <div 
                  className="lg:w-1/3 h-48 lg:h-auto bg-cover bg-center relative overflow-hidden"
                  style={{ backgroundImage: `url('${event.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 group-hover:to-black/40 transition-all duration-300" />
                  {event.recurring && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Recurring
                      </span>
                    </div>
                  )}
                </div>
                <div className="lg:w-2/3 p-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    {event.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Events;