/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Returns all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 * 
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */

import { Router, type RequestHandler } from 'express';
import { Order } from '../models/order';
import { orders as seedOrders } from '../seedData';

const router = Router();

let orders: Order[] = [...seedOrders];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isValidOrder = (value: unknown): value is Order => {
  if (!isRecord(value)) {
    return false;
  }

  const order = value as Partial<Order>;
  return Number.isInteger(order.orderId)
    && Number.isInteger(order.branchId)
    && isNonEmptyString(order.orderDate)
    && isNonEmptyString(order.name)
    && isNonEmptyString(order.description)
    && isNonEmptyString(order.status)
    && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(order.status);
};

export const resetOrders = () => {
  orders = [...seedOrders];
};

const createOrder: RequestHandler = ((req, res) => {
  if (!isValidOrder(req.body)) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }

  const newOrder = req.body as Order;
  orders.push(newOrder);
  return res.status(201).json(newOrder);
}) as any;

const getAllOrders: RequestHandler = (( _req, res) => {
  res.json(orders);
}) as any;

const getOrderById: RequestHandler = ((req, res) => {
  const order = orders.find(o => o.orderId === parseInt(req.params.id, 10));
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
}) as any;

const updateOrderById: RequestHandler = ((req, res) => {
  if (!isValidOrder(req.body)) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }

  const index = orders.findIndex(o => o.orderId === parseInt(req.params.id, 10));
  if (index !== -1) {
    orders[index] = req.body as Order;
    return res.json(orders[index]);
  }

  return res.status(404).json({ error: 'Order not found' });
}) as any;

const deleteOrderById: RequestHandler = ((req, res) => {
  const index = orders.findIndex(o => o.orderId === parseInt(req.params.id, 10));
  if (index !== -1) {
    orders.splice(index, 1);
    return res.status(204).send();
  }

  return res.status(404).json({ error: 'Order not found' });
}) as any;

// Create a new order
router.post('/', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get an order by ID
router.get('/:id', getOrderById);

// Update an order by ID
router.put('/:id', updateOrderById);

// Delete an order by ID
router.delete('/:id', deleteOrderById);

export default router;
