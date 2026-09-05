/*
  # Create site_content table for editable site content

  1. New Tables
    - `site_content`
      - `key` (text, primary key) - unique identifier for each content piece
      - `value` (text) - the content value (text or image URL)
      - `type` (text) - 'text' or 'image'
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public read access
    - Authenticated users can update
*/

CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'text',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site_content"
  ON site_content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update site_content"
  ON site_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
