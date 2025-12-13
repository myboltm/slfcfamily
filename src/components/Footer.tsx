import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white p-3 rounded-full shadow-md">
                <img 
                  src="https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/slfclogo-removebg-preview.png" 
                  alt="Shining Light Family Church Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Shining Light</h3>
                <p className="text-gray-300">Family Church</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              A body of Christ dedicated to sharing God's love, growing in faith, 
              and serving our community with compassion and grace.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-purple-600 p-3 rounded-full transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-purple-600 p-3 rounded-full transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-purple-600 p-3 rounded-full transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-purple-600 p-3 rounded-full transition-colors duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Home</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">About Us</a></li>
              <li><a href="#ministries" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Ministries</a></li>
              <li><a href="#events" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Events</a></li>
              <li><a href="#blog" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Blog</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Sermons</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Give Online</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                <p className="text-gray-300"> behind state hospital<br />, Obasanjo farm road, off idiroko road ota ogun state</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-purple-400 mr-3" />
                <p className="text-gray-300">+2347033579391</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-purple-400 mr-3" />
                <p className="text-gray-300">contact@slfcfamilyww.org</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h5 className="font-semibold text-purple-400 mb-2">Service Times</h5>
              <p className="text-sm text-gray-300">Sunday Worship: 8:00 AM</p>
              <p className="text-sm text-gray-300">Wednesday Bible Study: 10:00 AM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Shining Light Family Church. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-300">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;