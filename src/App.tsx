import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EditProvider } from './context/EditContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminBlogPage from './pages/AdminBlogPage';
import AdminSitePage from './pages/AdminSitePage';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Ministries from './components/Ministries';
import Events from './components/Events';
import Blog from './components/Blog';
import Give from './components/Give';
import Contact from './components/Contact';
import Footer from './components/Footer';

const isAdminSubdomain = window.location.hostname.startsWith('cc.');

const HomePage: React.FC = () => (
  <>
    <Header />
    <Hero />
    <About />
    <Ministries />
    <Events />
    <Blog />
    <Give />
    <Contact />
    <Footer />
  </>
);

function App() {
  // On cc.slfcfamilyww.org, render the full editable site directly
  if (isAdminSubdomain) {
    return (
      <AuthProvider>
        <AdminSitePage />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <EditProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminBlogPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </EditProvider>
    </AuthProvider>
  );
}

export default App;