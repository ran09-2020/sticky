import { createClient } from '@supabase/supabase-js'; 
const supabase = createClient('https://xpukjxkdwwgamhixlpsu.supabase.co', 'sb_publishable_VdYy6EbrIVSpQFInhNv1Qw_vA-rL-En'); 
async function run() { 
  const { data, error } = await supabase.from('boards').update({ width: null, height: null }).eq('slug', 'public'); 
  console.log('Result:', data, error); 
} 
run();
