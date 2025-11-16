import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

// =========================
// REGISTER
// =========================
export const register = async (req, res) => {
  try {
    const { full_name, email, password, agency_name } = req.body;

    if (!full_name || !email || !password || !agency_name) {
      return res.status(400).json({ error: "All fields required" });
    }

    // 1. Create agency
    const { data: agency, error: agencyError } = await supabase
      .from("agencies")
      .insert({
        agency_name,
        contact_email: email,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (agencyError) throw agencyError;

    // 2. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 3. Create user in our "users" table
    const userId = crypto.randomUUID();

    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        id: userId,
        agency_id: agency.id,
        email,
        name: full_name,
        password_hash: hashed,
        role: "admin",
        status: "active",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError) throw userError;

    // 4. Sign JWT
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.name,
        agency_id: newUser.agency_id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Registration successful",
      token,
      user: newUser,
      agency,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// =========================
// LOGIN
// =========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    // Sign JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        full_name: user.name,
        agency_id: user.agency_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// =========================
// CURRENT USER
// =========================
export const getCurrentUser = async (req, res) => {
  try {
    const { id } = req.user;

    const { data: user } = await supabase
      .from("users")
      .select("*, agencies(*)")
      .eq("id", id)
      .single();

    return res.json({ success: true, user });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

// =========================
// LOGOUT (client-side)
// =========================
export const logout = async (req, res) => {
  return res.json({ success: true, message: "Logged out" });
};
