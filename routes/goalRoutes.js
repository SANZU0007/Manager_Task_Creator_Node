import express from 'express';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all goals and POST new goal
router.route('/').get(getGoals).post(createGoal);

// PUT and DELETE for a specific goal by ID
router.route('/:id').put(updateGoal).delete(deleteGoal);

export default router;
