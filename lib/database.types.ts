/** Row shape for `public.profiles` (matches your Supabase ERD). */
export type Profile = {
  id: string;
  username: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  email: string;
  bio: string | null;
};

/** Row shape for `public.recipes` (matches your Supabase ERD). */
export type Recipe = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cook_time_minutes: number | null;
  difficulty: string | null;
  ingredients: string[];
  category: string;
  instructions: string[];
  created_at: string;
  updated_at: string;
};
