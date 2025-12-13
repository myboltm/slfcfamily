/*
  # Create blog comments table

  1. New Tables
    - `blog_comments`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `post_id` (uuid, foreign key to blog_posts)
      - `author` (text)
      - `content` (text)
      - `avatar` (text, nullable)

  2. Security
    - Enable RLS on `blog_comments` table
    - Add policy for anyone to read comments
    - Add policy for anyone to create comments
*/

CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author text NOT NULL,
  content text NOT NULL,
  avatar text DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
);

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog comments"
  ON blog_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create blog comments"
  ON blog_comments
  FOR INSERT
  TO public
  WITH CHECK (true);