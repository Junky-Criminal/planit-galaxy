// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mxowwjiblegmpkdlivjx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14b3d3amlibGVnbXBrZGxpdmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxODcxNDYsImV4cCI6MjA1Nzc2MzE0Nn0.Ba1sklVp5y1x1PWHmM1PqG-L-uo0srqnA07hY0nq1LQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);