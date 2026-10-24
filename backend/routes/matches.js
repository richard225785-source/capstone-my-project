const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/matches
// @desc    Get all matches
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('teamA', 'name shortName')
      .populate('teamB', 'name shortName')
      .populate('winner', 'name shortName')
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/matches
// @desc    Create a new match
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { teamA, teamB, matchDate } = req.body;

    if (!teamA || !teamB) {
      return res.status(400).json({ message: 'Both teams are required' });
    }

    if (teamA === teamB) {
      return res
        .status(400)
        .json({ message: 'A team cannot play against itself' });
    }

    // Check if teams exist
    const teamADoc = await Team.findById(teamA);
    const teamBDoc = await Team.findById(teamB);

    if (!teamADoc || !teamBDoc) {
      return res.status(404).json({ message: 'One or both teams not found' });
    }

    const match = await Match.create({
      teamA,
      teamB,
      matchDate: matchDate || Date.now(),
    });

    const populatedMatch = await Match.findById(match._id)
      .populate('teamA', 'name shortName')
      .populate('teamB', 'name shortName');

    res.status(201).json(populatedMatch);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/matches/:id/score
// @desc    Update match score
// @access  Private
router.put('/:id/score', protect, async (req, res) => {
  try {
    const { scoreA, scoreB } = req.body;

    if (scoreA === undefined || scoreB === undefined || scoreA === '' || scoreB === '') {
      return res.status(400).json({ message: 'Both scores are required' });
    }

    if (scoreA < 0 || scoreB < 0) {
      return res.status(400).json({ message: 'Scores cannot be negative' });
    }

    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Determine winner
    let winner = null;
    let isDraw = false;

    if (Number(scoreA) > Number(scoreB)) {
      winner = match.teamA;
    } else if (Number(scoreB) > Number(scoreA)) {
      winner = match.teamB;
    } else {
      isDraw = true;
    }

    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      {
        scoreA: Number(scoreA),
        scoreB: Number(scoreB),
        winner,
        isDraw,
        status: 'completed',
      },
      { new: true }
    )
      .populate('teamA', 'name shortName')
      .populate('teamB', 'name shortName')
      .populate('winner', 'name shortName');

    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/matches/:id
// @desc    Delete a match
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/matches/points-table
// @desc    Get points table
// @access  Private
router.get('/points-table', protect, async (req, res) => {
  try {
    const teams = await Team.find();
    const completedMatches = await Match.find({ status: 'completed' })
      .populate('teamA', 'name shortName')
      .populate('teamB', 'name shortName')
      .populate('winner', 'name shortName');

    // Build points table
    const table = teams.map((team) => {
      const teamId = team._id.toString();
      let played = 0, won = 0, drawn = 0, lost = 0, points = 0;
      let goalsFor = 0, goalsAgainst = 0;

      completedMatches.forEach((match) => {
        const isTeamA = match.teamA._id.toString() === teamId;
        const isTeamB = match.teamB._id.toString() === teamId;

        if (!isTeamA && !isTeamB) return;

        played++;

        if (match.isDraw) {
          drawn++;
          points += 1;
          goalsFor += isTeamA ? match.scoreA : match.scoreB;
          goalsAgainst += isTeamA ? match.scoreB : match.scoreA;
        } else if (match.winner && match.winner._id.toString() === teamId) {
          won++;
          points += 3;
          goalsFor += isTeamA ? match.scoreA : match.scoreB;
          goalsAgainst += isTeamA ? match.scoreB : match.scoreA;
        } else {
          lost++;
          goalsFor += isTeamA ? match.scoreA : match.scoreB;
          goalsAgainst += isTeamA ? match.scoreB : match.scoreA;
        }
      });

      return {
        team: { id: team._id, name: team.name, shortName: team.shortName },
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        points,
      };
    });

    // Sort by points, then goal difference
    table.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.goalDifference - a.goalDifference;
    });

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
