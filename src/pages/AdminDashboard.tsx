import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EditProvider } from '../context/EditContext';
import LoginPage from './LoginPage';
import AdminToolbar from '../components/AdminToolbar';
import BlogManager from '../components/admin/BlogManager';
import EventsManager from '../components/admin/EventsManager';
import SiteEditor from '../components/admin/SiteEditor';
import { LayoutDashboard, FileText, Calendar, Pencil, LogOut, ExternalLink } from 'lucide-react';

type Tab = 'dashboard' | 'blog' | 'events' | 'site';

const AdminDashboard: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editSiteOpen, setEditSiteOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600" />
    </div>
  );

  if (!user) return <LoginPage />;

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'blog', label: 'Blog Posts', icon: <FileText className="h-5 w-5" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="h-5 w-5" /> },
    { id: 'site', label: 'Edit Site', icon: <Pencil className="h-5 w-5" /> },
  ];

  return (
    <EditProvider forceEditMode>
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <img
                src="https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/slfclogo-removebg-preview.png"
                alt="logo"
                className="h-8 w-8 object-contain bg-white rounded-full p-1"
              />
              <div>
                <p className="font-bold text-sm">SLFC Admin</p>
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); if (item.id !== 'site') setEditSiteOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700 space-y-2">
            <a
              href="https://slfcfamilyww.org"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> View Live Site
            </a>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-red-900 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {activeTab === 'dashboard' && <DashboardHome onNavigate={setActiveTab} />}
          {activeTab === 'blog' && <BlogManager />}
          {activeTab === 'events' && <EventsManager />}
          {activeTab === 'site' && (
            <div className="p-8">
              {!editSiteOpen ? (
                <div className="max-w-xl mx-auto text-center mt-24">
                  <div className="bg-white rounded-2xl shadow-lg p-12">
                    <Pencil className="h-16 w-16 text-purple-600 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Site Content</h2>
                    <p className="text-gray-600 mb-8">
                      Open the full site in edit mode. Click any text or image to edit it, then save your changes.
                    </p>
                    <button
                      onClick={() => setEditSiteOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      Open Site Editor
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Site Editor</h2>
                    <button
                      onClick={() => setEditSiteOpen(false)}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      ← Back to Dashboard
                    </button>
                  </div>
                  <AdminToolbar />
                  <div className="mt-10">
                    <SiteEditor />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </EditProvider>
  );
};

const DashboardHome: React.FC<{ onNavigate: (tab: Tab) => void }> = ({ onNavigate }) => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back 👋</h1>
    <p className="text-gray-500 mb-10">What would you like to manage today?</p>
    <div className="grid md:grid-cols-3 gap-6">
      <DashCard
        icon={<FileText className="h-8 w-8 text-purple-600" />}
        title="Blog Posts"
        description="Create, edit and publish blog posts"
        onClick={() => onNavigate('blog')}
        color="purple"
      />
      <DashCard
        icon={<Calendar className="h-8 w-8 text-blue-600" />}
        title="Events"
        description="Add and manage church events"
        onClick={() => onNavigate('events')}
        color="blue"
      />
      <DashCard
        icon={<Pencil className="h-8 w-8 text-green-600" />}
        title="Edit Site"
        description="Edit text and images on the live site"
        onClick={() => onNavigate('site')}
        color="green"
      />
    </div>
  </div>
);

const DashCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}> = ({ icon, title, description, onClick, color }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl shadow-md p-8 text-left hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
  >
    <div className={`bg-${color}-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{description}</p>
  </button>
);

export default AdminDashboard;
