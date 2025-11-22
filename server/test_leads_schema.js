// Test script to check leads table schema
import { supabase } from './src/config/supabase.js';

async function checkLeadsSchema() {
    console.log('Checking leads table schema...\n');

    // Try to get one lead to see the structure
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error querying leads:', error);
    } else {
        console.log('Sample lead structure:', data[0] || 'No leads found');
    }

    // Try to insert a minimal lead
    console.log('\nTrying to insert a test lead...');
    const testLead = {
        name: 'Test Lead',
        email: 'test@example.com',
        status: 'new'
    };

    const { data: inserted, error: insertError } = await supabase
        .from('leads')
        .insert(testLead)
        .select()
        .single();

    if (insertError) {
        console.error('Insert error:', insertError);
    } else {
        console.log('Successfully inserted:', inserted);

        // Clean up
        await supabase.from('leads').delete().eq('id', inserted.id);
        console.log('Test lead deleted');
    }
}

checkLeadsSchema().then(() => process.exit(0));
