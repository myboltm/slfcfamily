import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, BlogPost } from '../../lib/supabase';
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, Upload } from 'lucide-react';

const EMPTY_FORM = {
  title: '', excerpt: '', content: '',
  author: 'Rev Olubunmi Idowu',
  date: new Date().toISOString().split('T')[0],
  image: '', category: '', read_time: '', published: false,
};

const BlogManager: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop();
    const path = `blog-images/${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('blog-images').upload(path, file);
    if (error) throw error;
    return supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFormData(f => ({ ...f, image: '' }));
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      if (selectedFile) { setUploadingImage(true); imageUrl = await uploadImage(selectedFile); }
      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update({ ...formData, image: imageUrl, user_id: user?.id }).eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([{ ...formData, image: imageUrl, user_id: user?.id, likes: 0, views: 0 }]);
        if (error) throw error;
      }
      resetForm();
      fetchPosts();
    } catch {
      alert('Error saving post. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ title: post.title, excerpt: post.excerpt, content: post.content, author: post.author, date: post.date, image: post.image, category: post.category, read_time: post.read_time, published: post.published });
    setImagePreview(post.image);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchPosts();
  };

  const togglePublished = async (post: BlogPost) => {
    await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id);
    fetchPosts();
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingPost(null);
    setSelectedFile(null);
    setImagePreview('');
    setShowForm(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" /></div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-gray-500">{posts.length} total posts</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
          <Plus className="h-5 w-5" /> New Post
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">{editingPost ? 'Edit Post' : 'Create New Post'}</h3>
              <button onClick={resetForm}><X className="h-6 w-6 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Faith & Life" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea rows={2} value={formData.excerpt} onChange={e => setFormData(f => ({ ...f, excerpt: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea rows={10} required value={formData.content} onChange={e => setFormData(f => ({ ...f, content: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                  <input type="text" required value={formData.author} onChange={e => setFormData(f => ({ ...f, author: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData(f => ({ ...f, date: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                  <input type="text" value={formData.read_time} onChange={e => setFormData(f => ({ ...f, read_time: e.target.value }))} placeholder="e.g. 5 min read" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                {imagePreview && (
                  <div className="mb-3 relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border" />
                    <button type="button" onClick={() => { setSelectedFile(null); setImagePreview(''); setFormData(f => ({ ...f, image: '' })); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full"><X className="h-3 w-3" /></button>
                  </div>
                )}
                <label className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5 cursor-pointer w-fit mb-3">
                  <Upload className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{selectedFile ? selectedFile.name : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
                <input type="url" value={formData.image} onChange={e => { setFormData(f => ({ ...f, image: e.target.value })); setSelectedFile(null); setImagePreview(e.target.value); }} placeholder="Or paste image URL" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData(f => ({ ...f, published: e.target.checked }))} className="h-4 w-4 text-purple-600 rounded" />
                <label htmlFor="published" className="text-sm text-gray-700">Publish immediately</label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={resetForm} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={uploadingImage} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-5 py-2.5 rounded-lg font-semibold">
                  {uploadingImage ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /><span>Uploading...</span></> : <><Save className="h-4 w-4" /><span>{editingPost ? 'Update' : 'Create'}</span></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-xl shadow p-5 flex gap-4 items-start">
            {post.image && <img src={post.image} alt={post.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 truncate">{post.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate mb-1">{post.excerpt}</p>
              <p className="text-xs text-gray-400">{post.author} · {post.category} · {new Date(post.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => togglePublished(post)} className={`p-2 rounded-lg transition-colors ${post.published ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>
                {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={() => handleEdit(post)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <p className="text-gray-400 mb-4">No blog posts yet</p>
            <button onClick={() => setShowForm(true)} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700">Create First Post</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManager;
