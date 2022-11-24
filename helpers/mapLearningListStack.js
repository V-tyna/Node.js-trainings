function mapLearningListStack(list) {
  return list.stack.map(tech => ({
    ...tech.tech_id._doc, count: tech.count
  }));
}

module.exports = mapLearningListStack;