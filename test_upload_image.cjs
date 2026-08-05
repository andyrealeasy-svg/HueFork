const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = 'https://uamwoljjhcgxeikjexpn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbXdvbGpqaGNneGVpa2pleHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTg0OTExMywiZXhwIjoyMTAxNDI1MTEzfQ.IoTyXPylwWADJTrUoS_NbHLZV4Llk4YW2OGO41ku980';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.storage.from('profiles').upload('test.png', Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), { contentType: 'image/png', upsert: true });
  console.log('Upload Image:', data, error);
}

run();
