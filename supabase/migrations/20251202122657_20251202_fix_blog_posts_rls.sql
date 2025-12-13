/*
  # Fix blog_posts RLS policies

  1. Security
    - Drop existing restrictive policies
    - Create new policies that check user_id instead of author_id
    - Allow authenticated users to create, read, update, and delete their own posts
    - Allow public read access to published posts
*/

DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can update their posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can delete their posts" ON blog_posts;

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);