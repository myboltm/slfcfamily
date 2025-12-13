import React, { useState } from 'react';
import { useEffect } from 'react';
import { supabase, BlogPost as SupabaseBlogPost, Comment } from '../lib/supabase';
import { Heart, MessageCircle, Share2, Calendar, User, ChevronRight, BookOpen, Eye } from 'lucide-react';

// Extend the Supabase BlogPost type to include comments for the UI
interface BlogPost extends SupabaseBlogPost {
  comments: Comment[];
  readTime: string; // Map from read_time
}

const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform the data to match our UI expectations
      const transformedPosts: BlogPost[] = (data || []).map(post => ({
        ...post,
        readTime: post.read_time || '5 min read',
        comments: [] // For now, we'll use empty comments array
      }));

      setBlogPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fallback to empty array if there's an error
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string): Promise<Comment[]> => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const incrementViewCount = async (postId: string) => {
    try {
      const { error } = await supabase.rpc('increment_views', { post_id: postId });
      if (error) throw error;
      
      // Update local state
      setBlogPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, views: post.views + 1 } : post
      ));
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const isLiked = likedPosts.has(postId);
      const increment = isLiked ? -1 : 1;
      
      const { error } = await supabase.rpc('update_likes', { 
        post_id: postId, 
        increment_by: increment 
      });
      
      if (error) throw error;
      
      // Update local state
      setLikedPosts(prev => {
        const newLiked = new Set(prev);
        if (isLiked) {
          newLiked.delete(postId);
        } else {
          newLiked.add(postId);
        }
        return newLiked;
      });
      
      // Update posts state
      setBlogPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes: post.likes + increment } : post
      ));
      
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? { ...prev, likes: prev.likes + increment } : null);
      }
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddComment = async (postId: string) => {
    if (newComment.trim() && commentAuthor.trim() && !submittingComment) {
      setSubmittingComment(true);
      
      try {
        const { error } = await supabase
          .from('blog_comments')
          .insert([{
            post_id: postId,
            author: commentAuthor.trim(),
            content: newComment.trim()
          }]);
        
        if (error) throw error;
        
        // Refresh comments for the selected post
        if (selectedPost) {
          const updatedComments = await fetchComments(postId);
          setSelectedPost(prev => prev ? { ...prev, comments: updatedComments } : null);
        }
        
        // Clear form
        setNewComment('');
        setCommentAuthor('');
      } catch (error) {
        console.error('Error adding comment:', error);
        alert('Error adding comment. Please try again.');
      } finally {
        setSubmittingComment(false);
      }
    }
  };

  const handlePostSelect = async (post: BlogPost) => {
    // Load comments for the selected post
    const comments = await fetchComments(post.id);
    
    // Increment view count
    await incrementViewCount(post.id);
    
    // Create post with comments and incremented view count
    const postWithComments = { ...post, comments, views: post.views + 1 };
    setSelectedPost(postWithComments);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCommentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (selectedPost) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-8 flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-300"
          >
            ← Back to Blog
          </button>

          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div 
              className="h-96 bg-cover bg-center relative"
              style={{ backgroundImage: `url('${selectedPost.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="bg-purple-600 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  {selectedPost.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center space-x-6 text-gray-200">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {selectedPost.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {formatDate(selectedPost.date)}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {selectedPost.readTime}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    {selectedPost.views} views
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="prose prose-lg max-w-none mb-8">
                {selectedPost.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Engagement Actions */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-6 mb-8">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    className={`flex items-center space-x-2 transition-colors duration-300 ${
                      likedPosts.has(selectedPost.id) 
                        ? 'text-red-500' 
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${likedPosts.has(selectedPost.id) ? 'fill-current' : ''}`} />
                    <span className="font-medium">
                      {selectedPost.likes}
                    </span>
                  </button>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MessageCircle className="h-6 w-6" />
                    <span className="font-medium">{selectedPost.comments.length}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleShare(selectedPost)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-300"
                >
                  <Share2 className="h-6 w-6" />
                  <span className="font-medium">Share</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Comments ({selectedPost.comments.length})
                </h3>

                {/* Add Comment Form */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                  />
                  <button
                    onClick={() => handleAddComment(selectedPost.id)}
                    disabled={submittingComment || !newComment.trim() || !commentAuthor.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {selectedPost.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-gray-900">{comment.author}</h5>
                            <span className="text-sm text-gray-500">{formatCommentDate(comment.created_at)}</span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedPost.comments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pastor's <span className="text-purple-600">Blog</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Inspiring messages, spiritual insights, and encouragement from Rev Olubunmi Idowu. 
            Join the conversation and grow in faith together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {blogPosts.length > 0 ? blogPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
              onClick={() => handlePostSelect(post)}
            >
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url('${post.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center text-white text-sm">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.views}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">{formatDate(post.date)}</span>
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className={`flex items-center space-x-1 transition-colors duration-300 ${
                        likedPosts.has(post.id) 
                          ? 'text-red-500' 
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">
                        {post.likes}
                      </span>
                    </button>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.comments.length}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(post);
                      }}
                      className="text-gray-500 hover:text-purple-600 transition-colors duration-300"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                    Read More
                    <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </article>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-600">Check back soon for inspiring messages from Rev Olubunmi Idowu.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;