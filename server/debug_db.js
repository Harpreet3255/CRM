import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function dumpTables() {
    console.log('--- USERS ---');
    const { data: users } = await supabase.from('users').select('id, email, agency_id, name');
    console.table(users);

    console.log('\n--- AGENCIES ---');
    const { data: agencies } = await supabase.from('agencies').select('id, agency_name, contact_email');
    console.table(agencies);

    console.log('\n--- CLIENTS ---');
    const { data: clients } = await supabase.from('clients').select('id, full_name, email, agency_id, created_by');
    console.table(clients);

    console.log('\n--- INVOICES ---');
    const { data: invoices } = await supabase.from('invoices').select('id, invoice_number, agency_id, client_id, created_by');
    console.table(invoices);
}

dumpTables();
