/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: API endpoints for managing deliveries
 */

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Returns all deliveries
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: List of all deliveries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *   post:
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 * 
 * /api/deliveries/{id}:
 *   get:
 *     summary: Get a delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   put:
 *     summary: Update a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       200:
 *         description: Delivery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   delete:
 *     summary: Delete a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       204:
 *         description: Delivery deleted successfully
 *       404:
 *         description: Delivery not found
 */

import { Router, type Request, type Response, type RequestHandler } from 'express';
import { Delivery } from '../models/delivery';
import { deliveries as seedDeliveries } from '../seedData';

const router = Router();

/** Valid delivery status transitions */
const VALID_STATUSES = ['pending', 'in-transit', 'delivered', 'cancelled'];

let deliveries: Delivery[] = [...seedDeliveries];

export const resetDeliveries = () => {
  deliveries = [...seedDeliveries];
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isValidDeliveryPayload = (value: unknown): value is Delivery => {
  if (!isRecord(value)) {
    return false;
  }

  const { deliveryId, supplierId, deliveryDate, name, description, status } = value;

  if (typeof deliveryId !== 'number' || !Number.isInteger(deliveryId) || deliveryId <= 0) {
    return false;
  }

  if (typeof supplierId !== 'number' || !Number.isInteger(supplierId) || supplierId <= 0) {
    return false;
  }

  if (typeof deliveryDate !== 'string' || deliveryDate.trim() === '') {
    return false;
  }

  if (typeof name !== 'string' || name.trim() === '') {
    return false;
  }

  if (typeof description !== 'string' || description.trim() === '') {
    return false;
  }

  if (typeof status !== 'string' || !VALID_STATUSES.includes(status)) {
    return false;
  }

  return true;
};

/**
 * Creates a new delivery record.
 * @returns 201 with the created delivery
 */
const createDelivery: RequestHandler = ((req, res) => {
  const newDelivery = req.body;

  if (!isValidDeliveryPayload(newDelivery)) {
    return res.status(400).json({ error: 'Invalid delivery payload' });
  }

  deliveries.push(newDelivery);
  return res.status(201).json(newDelivery);
}) as any;

/**
 * Retrieves all deliveries.
 * @returns 200 with array of Delivery objects
 */
const getAllDeliveries: RequestHandler = (( _req, res) => {
  res.json(deliveries);
}) as any;

/**
 * Retrieves a single delivery by its ID.
 * @returns 200 with the delivery, or 404 if not found
 */
const getDeliveryById: RequestHandler = ((req, res) => {
  const delivery = deliveries.find(d => d.deliveryId === parseInt(req.params.id));
  if (delivery) {
    res.json(delivery);
  } else {
    res.status(404).json({ error: 'Delivery not found' });
  }
}) as any;

/**
 * Updates a delivery's status.
 * Validates that the status is one of the allowed values.
 * @param status - New status string (pending, in-transit, delivered, cancelled)
 * @returns 200 with updated delivery, 400 if invalid status, or 404 if not found
 */
const updateDeliveryStatus: RequestHandler = ((req, res) => {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const delivery = deliveries.find(d => d.deliveryId === parseInt(req.params.id));

  if (delivery) {
    delivery.status = status;
    res.json(delivery);
  } else {
    res.status(404).json({ error: 'Delivery not found' });
  }
}) as any;

/**
 * Updates an entire delivery record by ID.
 * @returns 200 with updated delivery, or 404 if not found
 */
const updateDeliveryById: RequestHandler = ((req, res) => {
  const index = deliveries.findIndex(d => d.deliveryId === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Delivery not found' });
  }

  if (!isValidDeliveryPayload(req.body)) {
    return res.status(400).json({ error: 'Invalid delivery payload' });
  }

  deliveries[index] = req.body;
  return res.json(deliveries[index]);
}) as any;

/**
 * Deletes a delivery by ID.
 * @returns 204 on success, or 404 if not found
 */
const deleteDeliveryById: RequestHandler = ((req, res) => {
  const index = deliveries.findIndex(d => d.deliveryId === parseInt(req.params.id));
  if (index !== -1) {
    deliveries.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Delivery not found' });
  }
}) as any;

router.post('/', createDelivery);
router.get('/', getAllDeliveries);
router.get('/:id', getDeliveryById);
router.put('/:id/status', updateDeliveryStatus);
router.put('/:id', updateDeliveryById);
router.delete('/:id', deleteDeliveryById);

export default router;
