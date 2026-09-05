import React from 'react';
import { useAuth } from '../context/AuthContext';
import { EditProvider } from '../context/EditContext';
import AdminToolbar from '../components/AdminToolbar';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Ministries from '../components/Ministries';
import Events from '../components/Events';
import Blog from '../components/Blog';
import Give from '../components/Give';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import LoginPage from './LoginPage';

const AdminSitePage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <EditProvider forceEditMode>
      <div className="pt-10">
        <AdminToolbar />
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
    </EditProvider>
  );
};

export default AdminSitePage;
