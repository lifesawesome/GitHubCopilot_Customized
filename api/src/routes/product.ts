/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product payload
 * 
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product payload
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

import { Router, type RequestHandler } from 'express';
import { Product } from '../models/product';
import { products as seedProducts } from '../seedData';

const router = Router();

let products: Product[] = [...seedProducts];

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

const isValidProduct = (payload: unknown): payload is Product => {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as Partial<Product>;

  return (
    typeof candidate.productId === 'number' && Number.isInteger(candidate.productId) && candidate.productId > 0 &&
    typeof candidate.supplierId === 'number' && Number.isInteger(candidate.supplierId) && candidate.supplierId > 0 &&
    isNonEmptyString(candidate.name) &&
    isNonEmptyString(candidate.description) &&
    typeof candidate.price === 'number' && Number.isFinite(candidate.price) && candidate.price > 0 &&
    isNonEmptyString(candidate.sku) &&
    isNonEmptyString(candidate.unit) &&
    isNonEmptyString(candidate.imgName) &&
    (candidate.discount === undefined || (typeof candidate.discount === 'number' && Number.isFinite(candidate.discount) && candidate.discount >= 0 && candidate.discount <= 1))
  );
};

export const resetProducts = () => {
  products = [...seedProducts];
};

const createProduct: RequestHandler = ((req, res) => {
  if (!isValidProduct(req.body)) {
    return res.status(400).json({ error: 'Invalid product payload' });
  }

  const newProduct: Product = req.body;
  products.push(newProduct);
  return res.status(201).json(newProduct);
}) as any;

const getAllProducts: RequestHandler = (( _req, res) => {
  return res.json(products);
}) as any;

const getProductById: RequestHandler = ((req, res) => {
  const product = products.find(p => p.productId === parseInt(req.params.id));
  if (product) {
    return res.json(product);
  }

  return res.status(404).json({ error: 'Product not found' });
}) as any;

const updateProductById: RequestHandler = ((req, res) => {
  const index = products.findIndex(p => p.productId === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!isValidProduct(req.body)) {
    return res.status(400).json({ error: 'Invalid product payload' });
  }

  const updatedProduct = { ...req.body, productId: products[index].productId };
  products[index] = updatedProduct;
  return res.json(updatedProduct);
}) as any;

const deleteProductById: RequestHandler = ((req, res) => {
  const index = products.findIndex(p => p.productId === parseInt(req.params.id));
  if (index !== -1) {
    products.splice(index, 1);
    return res.status(204).send();
  }

  return res.status(404).json({ error: 'Product not found' });
}) as any;

// Create a new product
router.post('/', createProduct);

// Get all products
router.get('/', getAllProducts);

// Get a product by ID
router.get('/:id', getProductById);

// Update a product by ID
router.put('/:id', updateProductById);

// Delete a product by ID
router.delete('/:id', deleteProductById);

export default router;
