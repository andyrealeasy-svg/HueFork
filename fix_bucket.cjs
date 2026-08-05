const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = 'https://uamwoljjhcgxeikjexpn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbXdvbGpqaGNneGVpa2pleHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTg0OTExMywiZXhwIjoyMTAxNDI1MTEzfQ.IoTyXPylwWADJTrUoS_NbHLZV4Llk4YW2OGO41ku980';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.storage.updateBucket('profiles', {
    allowedMimeTypes: null, // Allow all
  });
  console.log('Update Bucket:', data, error);
}

run();
