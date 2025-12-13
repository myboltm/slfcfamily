/*
  # Create blog posts table for church website

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text, not null)
      - `excerpt` (text)
      - `content` (text, not null)
      - `author` (text, not null)
      - `date` (date, not null)
      - `image` (text, URL for post image)
      - `likes` (integer, default 0)
      - `views` (integer, default 0)
      - `category` (text)
      - `read_time` (text, e.g., "5 min read")
      - `published` (boolean, default false)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for authenticated users to manage their own posts
    - Add policy for public to read published posts
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  excerpt text DEFAULT '',
  content text NOT NULL,
  author text NOT NULL DEFAULT 'Pastor Michael Johnson',
  date date NOT NULL DEFAULT CURRENT_DATE,
  image text DEFAULT '',
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  category text DEFAULT '',
  read_time text DEFAULT '5 min read',
  published boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage their own posts
CREATE POLICY "Users can manage own blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for public to read published posts
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS blog_posts_published_date_idx 
  ON blog_posts (published, date DESC) 
  WHERE published = true;