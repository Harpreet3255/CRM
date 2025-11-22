import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) return res.status(401).json({ error: 'No token provided' });

    // Verify custom JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists in DB and is active
    const { data: user, error } = await supabase
      .from('users')
      .select('*, agencies(*)')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      console.error('Auth Middleware - User fetch error:', error);
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'User account is inactive' });
    }

    req.user = {
      ...user,
      agency_id: user.agency_id // Explicitly ensure this is set
    };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
