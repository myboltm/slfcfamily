import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface SiteContent {
  [key: string]: string;
}

interface EditContextType {
  isEditMode: boolean;
  content: SiteContent;
  updateContent: (key: string, value: string) => void;
  saveAll: () => Promise<void>;
  saving: boolean;
  pendingChanges: SiteContent;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

export const useEdit = () => {
  const context = useContext(EditContext);
  if (!context) throw new Error('useEdit must be used within EditProvider');
  return context;
};

// Detect if running on the cc. subdomain
const isAdminSubdomain = () => {
  const host = window.location.hostname;
  return host.startsWith('cc.');
};

export const EditProvider: React.FC<{ children: React.ReactNode; forceEditMode?: boolean }> = ({
  children,
  forceEditMode = false,
}) => {
  const [content, setContent] = useState<SiteContent>({});
  const [pendingChanges, setPendingChanges] = useState<SiteContent>({});
  const [saving, setSaving] = useState(false);
  const isEditMode = forceEditMode || isAdminSubdomain();

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('key, value');
      if (data) {
        const map: SiteContent = {};
        data.forEach(({ key, value }) => { map[key] = value; });
        setContent(map);
      }
    };
    fetchContent();
  }, []);

  const updateContent = useCallback((key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setPendingChanges(prev => ({ ...prev, [key]: value }));
  }, []);

  const saveAll = useCallback(async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    setSaving(true);
    try {
      const upserts = Object.entries(pendingChanges).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from('site_content').upsert(upserts, { onConflict: 'key' });
      if (error) throw error;
      setPendingChanges({});
    } finally {
      setSaving(false);
    }
  }, [pendingChanges]);

  return (
    <EditContext.Provider value={{ isEditMode, content, updateContent, saveAll, saving, pendingChanges }}>
      {children}
    </EditContext.Provider>
  );
};
