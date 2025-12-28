import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our blog posts
export interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  likes: number;
  views: number;
  category: string;
  read_time: string;
  published: boolean;
  user_id: string;
}

export interface Comment {
  id: string;
  created_at: string;
  post_id: string;
  author: string;
  content: string;
  avatar: string;
}