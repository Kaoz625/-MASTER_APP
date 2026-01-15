// Supabase SDK Configuration
const { createClient } = require('@supabase/supabase-js');
const { supabase } = require('./index');

// Initialize Supabase Client
const supabaseClient = createClient(
  supabase.url,
  supabase.serviceRoleKey
);

module.exports = {
  client: supabaseClient,
  auth: supabaseClient.auth,
  db: supabaseClient.from,
};
