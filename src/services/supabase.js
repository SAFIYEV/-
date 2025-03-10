const supabaseUrl = 'https://mlrvsounyegzhyqzcujg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scnZzb3VueWVnemh5cXpjdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTI3MTEsImV4cCI6MjA1NzAyODcxMX0.vNDmQIulPjQORfgN1RTCxAAWuKTvsqfJuhkUkftnvAc';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});

export { supabase };
