// server/src/middleware/auth.js
import { supabase } from '../config/supabase.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) return res.status(401).json({ error: 'No token provided' });

    // supabase.auth.getUser expects an access token
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Pull profile from user_profiles (contains agency_id etc.)
    const { data: profile, error: profileErr } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileErr) {
      console.error('Profile load error:', profileErr);
      return res.status(401).json({ error: 'User profile not found' });
    }

    req.user = { ...data.user, ...profile };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
