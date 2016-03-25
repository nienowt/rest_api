'use strict';

const mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const ghostSchema = mongoose.Schema({
  name: {type: String, unique: true},
  isEvil: {type: Boolean, default:true},
  numEyes: {type: Number, default: 3},
  password: String,
  powers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'powers'
    }
  ],
  haunting: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'humans'
    }
  ]
});

ghostSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  next();
});

ghostSchema.methods.compareHash = function(password){
  return bcrypt.compareSync(password, this.password);
};

ghostSchema.methods.genToken = function() {
  return jwt.sign({id: this._id}, 'arbitrary');
};

module.exports = mongoose.model('ghosts', ghostSchema);
