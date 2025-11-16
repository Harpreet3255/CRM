// server/src/routes/agencies.js
import express from 'express';
import {
  getAgency,
  updateAgency,
  uploadLogo,
  getAgencyStats
} from '../controllers/agencyController.js';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';

// Use multer for logo upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Get agency profile
router.get('/', authenticate, getAgency);

// Update agency info (name, contact, etc.)
router.patch('/', authenticate, updateAgency);

// Upload agency logo
router.post('/upload-logo', authenticate, upload.single('logo'), uploadLogo);

// Get aggregated stats (clients, leads, revenue)
router.get('/stats', authenticate, getAgencyStats);

export default router;
