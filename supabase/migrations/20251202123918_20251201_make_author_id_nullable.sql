/*
  # Make author_id nullable

  1. Modified Tables
    - `blog_posts`
      - Changed: `author_id` now nullable with default NULL
      - This allows inserts with user_id instead of author_id
*/

ALTER TABLE blog_posts ALTER COLUMN author_id DROP NOT NULL;
ALTER TABLE blog_posts ALTER COLUMN author_id SET DEFAULT NULL;