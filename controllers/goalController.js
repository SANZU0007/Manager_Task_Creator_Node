import Goal from '../models/goalModel.js';

// @desc    Get all goals
// @route   GET /api/goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a new goal
// @route   POST /api/goals
const createGoal = async (req, res) => {
  const { title, description, duration ,userId ,userRole} = req.body;
  if (!title || !duration) {
    return res.status(400).json({ message: 'Title and duration are required' });
  }

  try {
    const newGoal = await Goal.create({
      title,
      description,
      duration,
      userId,
      userRole,
      status: 'Pending',
    });
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Goal removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getGoals, createGoal, updateGoal, deleteGoal };
