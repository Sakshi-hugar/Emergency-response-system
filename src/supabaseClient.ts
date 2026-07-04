import { createClient } from '@supabase/supabase-js';

// Replace placeholders with strings from your Supabase Settings > API tab
const SUPABASE_URL = "https://hawdfaqcduvzzdnmzket.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhd2RmYXFjZHV2enpkbm16a2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzQyNTYsImV4cCI6MjA5NDI1MDI1Nn0.Xc0mjB-WMF_bb-BvAYFTd6YOpi2P-3yeVTqA2RSSS1A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
