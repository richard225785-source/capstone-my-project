const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  teamA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  teamB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  scoreA: {
    type: Number,
    default: null,
  },
  scoreB: {
    type: Number,
    default: null,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null,
  },
  isDraw: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed'],
    default: 'scheduled',
  },
  matchDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Match', MatchSchema);
