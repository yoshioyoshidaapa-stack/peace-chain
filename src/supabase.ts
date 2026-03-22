import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nuvbeppemhwizbtnvuxd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51dmJlcHBlbWh3aXpidG52dXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTc4NTQsImV4cCI6MjA4OTY3Mzg1NH0.81tnhxrPdFws2tXLAfACVpfltR2zNIuxKKJGYXgwMu0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
