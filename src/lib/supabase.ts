import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

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