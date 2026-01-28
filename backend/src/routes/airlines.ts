import { Router } from 'express';
import { AirlineController } from '../controllers/AirlineController.js';

const router = Router();

/**
 * @route   GET /api/airlines
 * @desc    Get all airlines with optional filters
 * @query   transportMethods - Filter by transport methods (cabin, baggage, cargo)
 * @query   search - Search by airline name
 */
router.get('/', AirlineController.getAll);

/**
 * @route   GET /api/airlines/transport-methods
 * @desc    Get all available transport methods
 */
router.get('/transport-methods', AirlineController.getTransportMethods);

/**
 * @route   GET /api/airlines/:id
 * @desc    Get single airline by ID
 */
router.get('/:id', AirlineController.getById);

export default router;
