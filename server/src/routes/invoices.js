import express from 'express';
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceById
} from '../controllers/invoiceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all invoices
router.get('/', authenticate, getInvoices);

// Get invoice by ID
router.get('/:id', authenticate, getInvoiceById);

// Create new invoice
router.post('/', authenticate, createInvoice);

// Update invoice
router.patch('/:id', authenticate, updateInvoice);

// Delete invoice
router.delete('/:id', authenticate, deleteInvoice);

export default router;
