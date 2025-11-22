import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: "./.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, '../../debug.log');

function logToDebug(msg) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] [SUPABASE_CONFIG] ${msg}\n`);
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

// Decode JWT to check role
try {
  const payload = JSON.parse(atob(key.split('.')[1]));
  logToDebug(`Key Role: ${payload.role}`);
  logToDebug(`Key ISS: ${payload.iss}`);
} catch (e) {
  logToDebug(`Failed to decode key: ${e.message}`);
}

export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});
