const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function syncAdmin() {
  console.log('Syncing arno@admin.com to Supabase Auth...');
  const { data, error } = await supabase.auth.signUp({
    email: 'arno@admin.com',
    password: 'arno@123',
    options: {
      data: {
        full_name: 'Arno Admin',
      }
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('User already exists in Supabase Auth.');
    } else {
      console.error('Error syncing user:', error.message);
    }
  } else {
    console.log('User synced to Supabase Auth successfully!');
  }
  process.exit(0);
}

syncAdmin();
