/*
  # Update blog_posts table schema

  1. Modified Tables
    - `blog_posts`
      - Added: `title` (already exists)
      - Added: `excerpt` (new)
      - Added: `content` (already exists)
      - Added: `author` (new)
      - Added: `date` (new)
      - Added: `image` (new)
      - Added: `category` (new)
      - Added: `read_time` (new)
      - Added: `published` (new)
      - Added: `views` (new)
      - Added: `likes` (new)
      - Added: `user_id` (new, for ownership)
      - Keep: `author_id` (for auth relationship)
      - Keep: `created_at`, `updated_at`
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'excerpt'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN excerpt text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'author'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'date'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN date text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'image'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN image text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'category'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN category text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'read_time'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN read_time text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'published'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN published boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'views'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN views integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'likes'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN likes integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN user_id uuid;
  END IF;
END $$;