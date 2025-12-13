/*
  # Create database functions for blog interactions

  1. Functions
    - `increment_views`: Safely increment view count for a blog post
    - `update_likes`: Update like count for a blog post (can increment or decrement)

  2. Security
    - Functions are accessible to public for read-only blog functionality
*/

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts 
  SET views = views + 1 
  WHERE id = post_id;
END;
$$;

-- Function to update like count (can increment or decrement)
CREATE OR REPLACE FUNCTION update_likes(post_id uuid, increment_by integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts 
  SET likes = GREATEST(0, likes + increment_by)
  WHERE id = post_id;
END;
$$;