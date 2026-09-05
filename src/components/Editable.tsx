import React, { useState, useRef } from 'react';
import { useEdit } from '../context/EditContext';
import { Pencil, Check, X, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  className?: string;
  multiline?: boolean;
  tag?: keyof JSX.IntrinsicElements;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  defaultValue,
  className = '',
  multiline = false,
  tag: Tag = 'span',
}) => {
  const { isEditMode, content, updateContent } = useEdit();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const value = content[contentKey] ?? defaultValue;

  if (!isEditMode) return <Tag className={className}>{value}</Tag>;

  const startEdit = () => { setDraft(value); setEditing(true); };
  const cancel = () => setEditing(false);
  const save = () => { updateContent(contentKey, draft); setEditing(false); };

  if (editing) {
    return (
      <span className="relative inline-block w-full">
        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="w-full border-2 border-purple-500 rounded p-1 text-gray-900 bg-white resize-y min-h-[80px]"
          />
        ) : (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="w-full border-2 border-purple-500 rounded p-1 text-gray-900 bg-white"
          />
        )}
        <span className="flex gap-1 mt-1">
          <button onClick={save} className="bg-green-500 text-white p-1 rounded hover:bg-green-600"><Check className="h-3 w-3" /></button>
          <button onClick={cancel} className="bg-red-500 text-white p-1 rounded hover:bg-red-600"><X className="h-3 w-3" /></button>
        </span>
      </span>
    );
  }

  return (
    <Tag className={`${className} group relative cursor-pointer`} onClick={startEdit}>
      {value}
      <span className="hidden group-hover:inline-flex items-center ml-1 bg-purple-600 text-white rounded p-0.5 text-xs align-middle">
        <Pencil className="h-3 w-3" />
      </span>
    </Tag>
  );
};

interface EditableImageProps {
  contentKey: string;
  defaultValue: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  asBackground?: boolean;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  contentKey,
  defaultValue,
  className = '',
  style = {},
  alt = '',
  asBackground = false,
}) => {
  const { isEditMode, content, updateContent } = useEdit();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const value = content[contentKey] ?? defaultValue;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `site-images/${contentKey}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('blog-images').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
      updateContent(contentKey, data.publicUrl);
    } catch (err) {
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isEditMode) {
    if (asBackground) return <div className={className} style={{ ...style, backgroundImage: `url('${value}')` }} />;
    return <img src={value} alt={alt} className={className} style={style} />;
  }

  return (
    <div className="relative group">
      {asBackground ? (
        <div className={className} style={{ ...style, backgroundImage: `url('${value}')` }} />
      ) : (
        <img src={value} alt={alt} className={className} style={style} />
      )}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 cursor-pointer rounded"
      >
        <span className="hidden group-hover:flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium">
          {uploading ? 'Uploading...' : <><Upload className="h-4 w-4" /> Change Image</>}
        </span>
      </button>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
};
