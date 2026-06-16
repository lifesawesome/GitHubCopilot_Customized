/**
 * @swagger
 * tags:
 *   name: Order Detail Deliveries
 *   description: API endpoints for managing order detail deliveries
 */

/**
 * @swagger
 * /api/order-detail-deliveries:
 *   get:
 *     summary: Returns all order detail deliveries
 *     tags: [Order Detail Deliveries]
 *     responses:
 *       200:
 *         description: List of all order detail deliveries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderDetailDelivery'
 *   post:
 *     summary: Create a new order detail delivery
 *     tags: [Order Detail Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDetailDelivery'
 *     responses:
 *       201:
 *         description: Order detail delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetailDelivery'
 * 
 * /api/order-detail-deliveries/{id}:
 *   get:
 *     summary: Get an order detail delivery by ID
 *     tags: [Order Detail Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail delivery ID
 *     responses:
 *       200:
 *         description: Order detail delivery found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetailDelivery'
 *       404:
 *         description: Order detail delivery not found
 *   put:
 *     summary: Update an order detail delivery
 *     tags: [Order Detail Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDetailDelivery'
 *     responses:
 *       200:
 *         description: Order detail delivery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetailDelivery'
 *       404:
 *         description: Order detail delivery not found
 *   delete:
 *     summary: Delete an order detail delivery
 *     tags: [Order Detail Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail delivery ID
 *     responses:
 *       204:
 *         description: Order detail delivery deleted successfully
 *       404:
 *         description: Order detail delivery not found
 */

import { Router, type RequestHandler } from 'express';
import { OrderDetailDelivery } from '../models/orderDetailDelivery';
import { orderDetailDeliveries as seedOrderDetailDeliveries } from '../seedData';

const router = Router();

let orderDetailDeliveries: OrderDetailDelivery[] = [...seedOrderDetailDeliveries];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isValidOrderDetailDelivery = (value: unknown): value is OrderDetailDelivery => {
  if (!isRecord(value)) {
    return false;
  }

  const orderDetailDelivery = value as Partial<OrderDetailDelivery>;
  return Number.isInteger(orderDetailDelivery.orderDetailDeliveryId)
    && Number.isInteger(orderDetailDelivery.orderDetailId)
    && Number.isInteger(orderDetailDelivery.deliveryId)
    && Number.isInteger(orderDetailDelivery.quantity)
    && (typeof orderDetailDelivery.notes === 'undefined' || typeof orderDetailDelivery.notes === 'string');
};

export const resetOrderDetailDeliveries = () => {
  orderDetailDeliveries = [...seedOrderDetailDeliveries];
};

const createOrderDetailDelivery: RequestHandler = ((req, res) => {
  if (!isValidOrderDetailDelivery(req.body)) {
    return res.status(400).json({ error: 'Invalid order detail delivery payload' });
  }

  const newOrderDetailDelivery = req.body as OrderDetailDelivery;
  orderDetailDeliveries.push(newOrderDetailDelivery);
  return res.status(201).json(newOrderDetailDelivery);
}) as any;

const getAllOrderDetailDeliveries: RequestHandler = ((_req, res) => {
  res.json(orderDetailDeliveries);
}) as any;

const getOrderDetailDeliveryById: RequestHandler = ((req, res) => {
  const orderDetailDelivery = orderDetailDeliveries.find(odd => odd.orderDetailDeliveryId === parseInt(req.params.id, 10));
  if (orderDetailDelivery) {
    res.json(orderDetailDelivery);
  } else {
    res.status(404).json({ error: 'Order detail delivery not found' });
  }
}) as any;

const updateOrderDetailDeliveryById: RequestHandler = ((req, res) => {
  if (!isValidOrderDetailDelivery(req.body)) {
    return res.status(400).json({ error: 'Invalid order detail delivery payload' });
  }

  const index = orderDetailDeliveries.findIndex(odd => odd.orderDetailDeliveryId === parseInt(req.params.id, 10));
  if (index !== -1) {
    orderDetailDeliveries[index] = req.body as OrderDetailDelivery;
    return res.json(orderDetailDeliveries[index]);
  }

  return res.status(404).json({ error: 'Order detail delivery not found' });
}) as any;

const deleteOrderDetailDeliveryById: RequestHandler = ((req, res) => {
  const index = orderDetailDeliveries.findIndex(odd => odd.orderDetailDeliveryId === parseInt(req.params.id, 10));
  if (index !== -1) {
    orderDetailDeliveries.splice(index, 1);
    return res.status(204).send();
  }

  return res.status(404).json({ error: 'Order detail delivery not found' });
}) as any;

// Create a new order detail delivery
router.post('/', createOrderDetailDelivery);

// Get all order detail deliveries
router.get('/', getAllOrderDetailDeliveries);

// Get an order detail delivery by ID
router.get('/:id', getOrderDetailDeliveryById);

// Update an order detail delivery by ID
router.put('/:id', updateOrderDetailDeliveryById);

// Delete an order detail delivery by ID
router.delete('/:id', deleteOrderDetailDeliveryById);

export default router;
