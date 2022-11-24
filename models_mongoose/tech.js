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
  image: String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = model('Tech', tech);