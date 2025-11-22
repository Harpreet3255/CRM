// server/src/controllers/aiController.js
import { getModel } from '../config/gemini.js';
import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, '../../debug.log');

function logToFile(msg) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
}

/* simplified system prompt */
const SYSTEM_PROMPT = `
You are TONO, AI assistant for Triponic B2B.
Detect intents and automate itinerary creation when asked like:
"Create itinerary for <client> to <destination> for <X days>"
Return JSON for automation results when creating.
`;

/* intent detection uses model to parse user message into fields */
async function detectIntent(message) {
  logToFile(`Detecting intent for: ${message}`);
  const model = getModel();

  const prompt = `
Extract fields from the message:
"${message}"

Return ONLY JSON:
{ "intent": "itinerary|invoice|booking|proposal|general", "client_name": "string|null", "destination": "string|null", "duration": "string|null", "dates":"string|null", "itinerary_id": "string|null" }
`;

  const result = await model.generateContent(prompt);
  const raw = (await result.response).text().trim();
  try {
    return JSON.parse(raw);
  } catch (err) {
    // fallback safe default
    return { intent: 'general', client_name: null, destination: null, duration: null, dates: null };
  }
}

/* create a day-wise itinerary via model (returns JSON object or fallback text) */
async function createDayWiseItinerary({ destination, duration, interests, travelers, budget, client }) {
  const model = getModel();
  const daysNum = parseInt((String(duration).match(/\d+/) || [duration])[0] || 1, 10);

  const prompt = `
You are an expert travel planner. Produce a day-wise itinerary as valid JSON ONLY.

Input:
- destination: ${destination}
- duration_days: ${daysNum}
- travelers: ${travelers || 1}
- interests: ${Array.isArray(interests) ? interests.join(',') : interests || 'general'}
- budget: ${budget || 'moderate'}
- client: ${client ? client.full_name : 'unknown'}

Return JSON structure with "daily" array and fields similar to { title, summary, destination, duration, daily:[{day, morning, afternoon, evening, activities:[], meals:{}, notes:""}], travel_tips:[], estimated_total_cost:"" }.
Generate ${daysNum} days.
`;

  const result = await model.generateContent(prompt);
  const raw = (await result.response).text();
  // parse attempt
  try {
    return JSON.parse(raw);
  } catch (err) {
    const match = raw.match(/(\{[\s\S]*\})/);
    if (match) {
      try { return JSON.parse(match[1]); } catch (_) { /* continue */ }
    }
    // fallback to a simple object with raw text in first day
    return {
      title: `${destination} ${daysNum}-day trip`,
      summary: raw.slice(0, 200),
      destination,
      duration: daysNum,
      daily: [{ day: 1, morning: raw.slice(0, 200), afternoon: '', evening: '', activities: [], meals: {}, notes: '' }],
      travel_tips: [],
      estimated_total_cost: 'TBD'
    };
  }
}

/* MAIN chat endpoint — will auto-create itineraries when intent says so */
export const chatWithAI = async (req, res) => {
  try {
    const { message, conversation_history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const intentData = await detectIntent(message);
    const { intent, client_name, destination, duration } = intentData;

    if (intent === 'itinerary' && client_name) {
      // find client with partial match
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .ilike('full_name', `%${client_name}%`)
        .eq('agency_id', req.user.agency_id);

      if (!clients || clients.length === 0) {
        return res.json({ success: true, response: `I couldn't find client similar to "${client_name}".` });
      }
      const client = clients[0];

      if (!destination || !duration) {
        return res.json({ success: true, response: 'Please provide both destination and duration to create the itinerary.' });
      }

      const aiJson = await createDayWiseItinerary({ destination, duration, interests: client.interests, travelers: 1, budget: client.budget_range, client });

      const aiText = aiJson && aiJson.summary ? aiJson.summary : JSON.stringify(aiJson).slice(0, 400);

      // save to DB
      const { data: saved, error } = await supabase
        .from('itineraries')
        .insert({
          destination,
          duration: aiJson.duration || parseInt((String(duration).match(/\d+/) || [duration])[0] || 1, 10),
          ai_generated_content: aiText,
          ai_generated_json: aiJson,
          client_id: client.id,
          agency_id: req.user.agency_id,
          created_by: req.user.id,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // success response
      return res.json({
        success: true,
        action: 'itinerary_created',
        itinerary_id: saved.id,
        response: `Itinerary created for ${client.full_name}. Destination: ${destination}. Duration: ${aiJson.duration} day(s).`,
        raw: aiJson
      });
    }

    // Handle invoice generation intent
    if (intent === 'invoice' && client_name) {
      // find client with partial match
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .ilike('full_name', `%${client_name}%`)
        .eq('agency_id', req.user.agency_id);

      if (!clients || clients.length === 0) {
        return res.json({ success: true, response: `I couldn't find client similar to "${client_name}".` });
      }
      const client = clients[0];

      // Get the latest itinerary for this client
      const { data: itineraries } = await supabase
        .from('itineraries')
        .select('*')
        .eq('client_id', client.id)
        .eq('agency_id', req.user.agency_id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!itineraries || itineraries.length === 0) {
        return res.json({ success: true, response: `No itinerary found for ${client.full_name}. Please create an itinerary first.` });
      }

      const itinerary = itineraries[0];

      // Calculate invoice amount based on itinerary budget
      const budgetMatch = itinerary.budget?.match(/\d+/);
      const amount = budgetMatch ? parseFloat(budgetMatch[0]) : 1000;

      // Create invoice
      const { data: invoice, error } = await supabase
        .from('invoices')
        .insert({
          agency_id: req.user.agency_id,
          client_id: client.id,
          amount: amount,
          status: 'draft',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        action: 'invoice_created',
        invoice_id: invoice.id,
        response: `Invoice created for ${client.full_name}. Amount: $${amount.toFixed(2)}. Status: Draft.`,
        raw: invoice
      });
    }

    // fallback: simple chat mode (short)
    const model = getModel();
    let historyString = '';
    (conversation_history || []).forEach(m => historyString += `${m.role.toUpperCase()}: ${m.content}\n`);
    const prompt = SYSTEM_PROMPT + '\n\n' + historyString + `USER: ${message}\nTONO:`;
    const result = await model.generateContent(prompt);
    const reply = (await result.response).text();

    // save conversation (best-effort)
    try {
      await supabase.from('ai_conversations').insert({
        user_id: req.user.id,
        agency_id: req.user.agency_id,
        user_message: message,
        ai_response: reply,
        created_at: new Date().toISOString()
      });
    } catch (dberr) { console.warn('AI conv save failed', dberr); }

    return res.json({ success: true, response: reply, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('AI controller error:', err);
    logToFile(`AI controller error: ${err.message}\n${err.stack}`);
    return res.status(500).json({ error: 'AI processing failed', details: err.message });
  }
};
