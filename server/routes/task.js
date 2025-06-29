import express from 'express';
import Task from '../models/Task.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';


const router = express.Router();

// Protect all task routes
router.use(authenticateJWT);

// GET tasks with filtering, pagination, sorting
router.get('/', async (req, res) => {
  try {
    const { status, dueDate, page = 1, limit = 10, sort = 'dueDate' } = req.query;
    const query = { userId: req.user.id };

    if (status) query.status = status;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ [sort]: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
});

// POST create new task for logged-in user
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
});

// PUT update a task
router.put('/:id', async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Task not found or not authorized' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Task not found or not authorized' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
});

export default router;
