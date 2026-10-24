const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/teams
// @desc    Get all teams
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/teams
// @desc    Add a new team
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, shortName } = req.body;

    if (!name || !shortName) {
      return res
        .status(400)
        .json({ message: 'Team name and short name are required' });
    }

    if (shortName.length > 5) {
      return res
        .status(400)
        .json({ message: 'Short name must be 5 characters or less' });
    }

    // Check if team name exists
    const existing = await Team.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'A team with this name already exists' });
    }

    const team = await Team.create({ name, shortName: shortName.toUpperCase() });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/teams/:id
// @desc    Delete a team
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
