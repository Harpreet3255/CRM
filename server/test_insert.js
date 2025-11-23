import { supabase } from "./src/config/supabase.js";

async function testInsert() {
    console.log("Attempting to insert test agency...");
    const { data, error } = await supabase
        .from("agencies")
        .insert({
            agency_name: "Test Agency Debug",
            contact_email: "test_debug@example.com",
            created_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error("Insert failed:", error);
    } else {
        console.log("Insert successful:", data);
        // Cleanup
        await supabase.from("agencies").delete().eq("id", data.id);
    }
}

testInsert();
