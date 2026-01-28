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

/**
 * @route   POST /api/airlines
 * @desc    Create new airline
 * @access  Admin only (will add auth later)
 */
router.post('/', AirlineController.create);

/**
 * @route   PUT /api/airlines/:id
 * @desc    Update airline by ID
 * @access  Admin only (will add auth later)
 */
router.put('/:id', AirlineController.update);

/**
 * @route   DELETE /api/airlines/:id
 * @desc    Delete airline by ID
 * @access  Admin only (will add auth later)
 */
router.delete('/:id', AirlineController.delete);

export default router;
