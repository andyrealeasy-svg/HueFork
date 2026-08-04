import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uamwoljjhcgxeikjexpn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbXdvbGpqaGNneGVpa2pleHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTg0OTExMywiZXhwIjoyMTAxNDI1MTEzfQ.IoTyXPylwWADJTrUoS_NbHLZV4Llk4YW2OGO41ku980';

export const supabase = createClient(supabaseUrl, supabaseKey);
