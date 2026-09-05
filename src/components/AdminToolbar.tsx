import React from 'react';
import { useEdit } from '../context/EditContext';
import { useAuth } from '../context/AuthContext';
import { Save, LogOut, Eye } from 'lucide-react';

const AdminToolbar: React.FC = () => {
  const { saveAll, saving, pendingChanges } = useEdit();
  const { user, signOut } = useAuth();
  const hasChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gray-900 text-white px-4 py-2 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-purple-400 font-bold text-sm">✏️ Edit Mode</span>
        {hasChanges && (
          <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-semibold">
            {Object.keys(pendingChanges).length} unsaved change{Object.keys(pendingChanges).length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs hidden sm:block">{user?.email}</span>
        <a
          href="https://slfcfamilyww.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-gray-300 hover:text-white text-sm transition-colors"
        >
          <Eye className="h-4 w-4" /> View Live
        </a>
        <button
          onClick={saveAll}
          disabled={saving || !hasChanges}
          className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={signOut}
          className="flex items-center gap-1 text-gray-400 hover:text-red-400 text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminToolbar;
