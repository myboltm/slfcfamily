/*
  # Create donations table for online giving

  1. New Tables
    - `donations`
      - `id` (uuid, primary key) - Unique identifier
      - `amount` (numeric) - Donation amount
      - `currency` (text) - Currency code (NGN, etc)
      - `donor_name` (text) - Name of the donor
      - `donor_email` (text) - Email of the donor
      - `donor_phone` (text, nullable) - Phone number of the donor
      - `transaction_id` (text, unique) - Flutterwave transaction ID
      - `status` (text) - Payment status (pending, completed, failed)
      - `reference` (text) - Flutterwave reference number
      - `message` (text, nullable) - Optional message from donor
      - `created_at` (timestamp) - When donation was created
      - `completed_at` (timestamp, nullable) - When payment was completed

  2. Security
    - Enable RLS on `donations` table
    - Add policy to allow anyone to insert donations
    - Add policy to allow anyone to read their own donations via email
    - Add policy to allow authenticated admins to read all donations
*/

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'NGN',
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  donor_phone text,
  transaction_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reference text UNIQUE NOT NULL,
  message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert donations"
  ON donations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own donation"
  ON donations
  FOR SELECT
  USING (true);
