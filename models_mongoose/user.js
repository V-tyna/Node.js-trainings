const { Schema, model } = require('mongoose');
const deepClone = require('../helpers/deepClone');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExp: String,
  learningList: {
    stack: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        tech_id: {
          type: Schema.Types.ObjectId,
          ref: 'Tech',
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToLearningList = function(stack) {
  const list = deepClone(this.learningList.stack);
  const idx = list.findIndex(tech => {
    return tech.tech_id.toString() === stack._id.toString();
  });

  if (idx >= 0) {
    list[idx].count = list[idx].count + 1;
  } else {
    list.push({
      tech_id: stack._id,
      count: 1
    });
  }

  this.learningList = { stack: list };
  return this.save();
}

userSchema.methods.removeFromLearningList = function(id) {
  let list = deepClone(this.learningList.stack);
  const idx = list.findIndex(tech => {
    return tech.tech_id.toString() === id.toString();
  });

  if (list[idx].count === 1) {
    list = list.filter(tech => {
      return tech.tech_id.toString() !== id.toString();
    });
  } else {
    list[idx].count--;
  }
  
  this.learningList = { stack: list };
  return this.save();
}

module.exports = model('User', userSchema);