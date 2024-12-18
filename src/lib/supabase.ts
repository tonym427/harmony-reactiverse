import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ihileabinwmxfxxcmfhh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaWxlYWJpbndteGZ4eGNtZmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MDYxMDYsImV4cCI6MjA1MDA4MjEwNn0.zOqPea3YhjVMBjxhNWHMLmR20J6l7FVYivSBFJThgcE";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);