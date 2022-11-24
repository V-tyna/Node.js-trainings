const { Schema, model } = require('mongoose');

const tech = new Schema({
  techName: {
    type: String,
    required: true
  }, 
  duration: {
    type: String,
    required: true
  }, 
  image: String
});

module.exports = model('Tech', tech);