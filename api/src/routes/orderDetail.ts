/**
 * @swagger
 * tags:
 *   name: Order Details
 *   description: API endpoints for managing order details
 */

/**
 * @swagger
 * /api/order-details:
 *   get:
 *     summary: Returns all order details
 *     tags: [Order Details]
 *     responses:
 *       200:
 *         description: List of all order details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderDetail'
 *   post:
 *     summary: Create a new order detail
 *     tags: [Order Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDetail'
 *     responses:
 *       201:
 *         description: Order detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 * 
 * /api/order-details/{id}:
 *   get:
 *     summary: Get an order detail by ID
 *     tags: [Order Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail ID
 *     responses:
 *       200:
 *         description: Order detail found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 *       404:
 *         description: Order detail not found
 *   put:
 *     summary: Update an order detail
 *     tags: [Order Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDetail'
 *     responses:
 *       200:
 *         description: Order detail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 *       404:
 *         description: Order detail not found
 *   delete:
 *     summary: Delete an order detail
 *     tags: [Order Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail ID
 *     responses:
 *       204:
 *         description: Order detail deleted successfully
 *       404:
 *         description: Order detail not found
 */

import { Router, type RequestHandler } from 'express';
import { OrderDetail } from '../models/orderDetail';
import { orderDetails as seedOrderDetails } from '../seedData';

const router = Router();

let orderDetails: OrderDetail[] = [...seedOrderDetails];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isValidOrderDetail = (value: unknown): value is OrderDetail => {
  if (!isRecord(value)) {
    return false;
  }

  const orderDetail = value as Partial<OrderDetail>;
  return Number.isInteger(orderDetail.orderDetailId)
    && Number.isInteger(orderDetail.orderId)
    && Number.isInteger(orderDetail.productId)
    && Number.isInteger(orderDetail.quantity)
    && typeof orderDetail.unitPrice === 'number'
    && Number.isFinite(orderDetail.unitPrice)
    && (typeof orderDetail.notes === 'undefined' || typeof orderDetail.notes === 'string');
};

export const resetOrderDetails = () => {
  orderDetails = [...seedOrderDetails];
};

const createOrderDetail: RequestHandler = ((req, res) => {
  if (!isValidOrderDetail(req.body)) {
    return res.status(400).json({ error: 'Invalid order detail payload' });
  }

  const newOrderDetail = req.body as OrderDetail;
  orderDetails.push(newOrderDetail);
  return res.status(201).json(newOrderDetail);
}) as any;

const getAllOrderDetails: RequestHandler = ((_req, res) => {
  res.json(orderDetails);
}) as any;

const getOrderDetailById: RequestHandler = ((req, res) => {
  const orderDetail = orderDetails.find(od => od.orderDetailId === parseInt(req.params.id, 10));
  if (orderDetail) {
    res.json(orderDetail);
  } else {
    res.status(404).json({ error: 'Order detail not found' });
  }
}) as any;

const updateOrderDetailById: RequestHandler = ((req, res) => {
  if (!isValidOrderDetail(req.body)) {
    return res.status(400).json({ error: 'Invalid order detail payload' });
  }

  const index = orderDetails.findIndex(od => od.orderDetailId === parseInt(req.params.id, 10));
  if (index !== -1) {
    orderDetails[index] = req.body as OrderDetail;
    return res.json(orderDetails[index]);
  }

  return res.status(404).json({ error: 'Order detail not found' });
}) as any;

const deleteOrderDetailById: RequestHandler = ((req, res) => {
  const index = orderDetails.findIndex(od => od.orderDetailId === parseInt(req.params.id, 10));
  if (index !== -1) {
    orderDetails.splice(index, 1);
    return res.status(204).send();
  }

  return res.status(404).json({ error: 'Order detail not found' });
}) as any;

// Create a new order detail
router.post('/', createOrderDetail);

// Get all order details
router.get('/', getAllOrderDetails);

// Get an order detail by ID
router.get('/:id', getOrderDetailById);

// Update an order detail by ID
router.put('/:id', updateOrderDetailById);

// Delete an order detail by ID
router.delete('/:id', deleteOrderDetailById);

export default router;
