/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: API endpoints for managing suppliers
 */

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Returns all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: List of all suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Invalid supplier payload
 * 
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 *   put:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Invalid supplier payload
 *       404:
 *         description: Supplier not found
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       204:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 */

import { Router, type RequestHandler } from 'express';
import { Supplier } from '../models/supplier';
import { suppliers as seedSuppliers } from '../seedData';

const router = Router();

let suppliers: Supplier[] = [...seedSuppliers];

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const isValidEmail = (value: unknown): value is string => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidSupplier = (payload: unknown): payload is Supplier => {
    if (!payload || typeof payload !== 'object') {
        return false;
    }

    const candidate = payload as Partial<Supplier>;

    return (
        typeof candidate.supplierId === 'number' && Number.isInteger(candidate.supplierId) && candidate.supplierId > 0 &&
        isNonEmptyString(candidate.name) &&
        isNonEmptyString(candidate.description) &&
        isNonEmptyString(candidate.contactPerson) &&
        isValidEmail(candidate.email) &&
        isNonEmptyString(candidate.phone)
    );
};

export const resetSuppliers = () => {
    suppliers = [...seedSuppliers];
};

const createSupplier: RequestHandler = ((req, res) => {
    if (!isValidSupplier(req.body)) {
        return res.status(400).json({ error: 'Invalid supplier payload' });
    }

    const newSupplier = req.body as Supplier;
    suppliers.push(newSupplier);
    return res.status(201).json(newSupplier);
}) as any;

const getAllSuppliers: RequestHandler = (( _req, res) => {
    return res.json(suppliers);
}) as any;

const getSupplierById: RequestHandler = ((req, res) => {
    const supplier = suppliers.find(s => s.supplierId === parseInt(req.params.id));
    if (supplier) {
        return res.json(supplier);
    }

    return res.status(404).json({ error: 'Supplier not found' });
}) as any;

const updateSupplierById: RequestHandler = ((req, res) => {
    const index = suppliers.findIndex(s => s.supplierId === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Supplier not found' });
    }

    if (!isValidSupplier(req.body)) {
        return res.status(400).json({ error: 'Invalid supplier payload' });
    }

    const updatedSupplier = { ...req.body, supplierId: suppliers[index].supplierId } as Supplier;
    suppliers[index] = updatedSupplier;
    return res.json(updatedSupplier);
}) as any;

const deleteSupplierById: RequestHandler = ((req, res) => {
    const index = suppliers.findIndex(s => s.supplierId === parseInt(req.params.id));
    if (index !== -1) {
        suppliers.splice(index, 1);
        return res.status(204).send();
    }

    return res.status(404).json({ error: 'Supplier not found' });
}) as any;

// Create a new supplier
router.post('/', createSupplier);

// Get all suppliers
router.get('/', getAllSuppliers);

// Get a supplier by ID
router.get('/:id', getSupplierById);

// Update a supplier by ID
router.put('/:id', updateSupplierById);

// Delete a supplier by ID
router.delete('/:id', deleteSupplierById);

export default router;