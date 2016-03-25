'use strict';

const mongoose = require('mongoose');

const humanSchema = mongoose.Schema({
  name: String,
  numTeeth: {type: Number, default: 27},
  isCool: {type: Boolean, default: false},
  hauntedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ghosts'
    }
  ]

});

module.exports = mongoose.model('humans', humanSchema);
