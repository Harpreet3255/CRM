// server/src/index.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

import itinerariesRoutes from './routes/itineraries.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import clientsRoutes from './routes/clients.js';
import invoicesRoutes from './routes/invoices.js';
import leadsRoutes from './routes/leads.js';
import settingsRoutes from './routes/settings.js';

const app = express();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reqLogFile = 'c:/Users/harpr/CRM-1/server/request_debug_abs.log';

app.get("/debug-info", (req, res) => {
  res.json({
    dirname: __dirname,
    logFile: reqLogFile,
    cwd: process.cwd()
  });
});

app.use((req, res, next) => {
  const msg = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
  try {
    fs.appendFileSync(reqLogFile, msg);
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
  next();
});

// -----------------------------------------------------
// CORS FIX (THIS IS WHAT WAS BREAKING YOUR CLIENT PAGE)
// -----------------------------------------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL,         // http://localhost:5173
    credentials: true,                      // allow cookies / auth headers
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    exposedHeaders: ["Content-Type"]
  })
);

// -----------------------------------------------------
// Body parsing + Logger
// -----------------------------------------------------
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// -----------------------------------------------------
// STATIC FILES (Frontend)
// -----------------------------------------------------
app.use(express.static(path.join(__dirname, '../../client/dist')));

// -----------------------------------------------------
// Health check
// -----------------------------------------------------
app.get("/", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// -----------------------------------------------------
// ROUTES
// -----------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/itineraries", itinerariesRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ai", aiRoutes);

// -----------------------------------------------------
// SPA CATCH-ALL (Fallback)
// -----------------------------------------------------
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  const indexPath = path.join(__dirname, '../../client/dist/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      if (!res.headersSent) {
        res.status(500).send("Error loading frontend");
      }
    }
  });
});

// -----------------------------------------------------
// Global Error Handler
// -----------------------------------------------------
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message || err
  });
});

// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Triponic B2B Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 Frontend allowed: ${process.env.CLIENT_URL}`);
});
