import React from 'react';
import Header from '../Header';
import Hero from '../Hero';
import About from '../About';
import Ministries from '../Ministries';
import Events from '../Events';
import Blog from '../Blog';
import Give from '../Give';
import Contact from '../Contact';
import Footer from '../Footer';

const SiteEditor: React.FC = () => (
  <div className="rounded-xl overflow-hidden border-2 border-purple-200 shadow-xl">
    <Header />
    <Hero />
    <About />
    <Ministries />
    <Events />
    <Blog />
    <Give />
    <Contact />
    <Footer />
  </div>
);

export default SiteEditor;
