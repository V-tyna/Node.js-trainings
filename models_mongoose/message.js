const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  content: String,
  date: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  } 
});

module.exports = model('Message', messageSchema);
