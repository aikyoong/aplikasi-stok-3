// Create a single supabase client for interacting with your database
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jzgsbgdyleemqydscuyt.supabase.co";
// const supabaseKey = process.env.SUPABASE_KEY;
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6Z3NiZ2R5bGVlbXF5ZHNjdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4NzE5NzIsImV4cCI6MjAxNTQ0Nzk3Mn0.-T69CAeeiJq3x3vkcLsIHNjyG0HUA8G7acpMz878nDM";

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
