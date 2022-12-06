module.exports = {
  ifEqual(a, b, options) {
    if (a === b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  ifBothTrue(a, operator, b, options) {
    if (operator === '&&') {
      const boolean = a && b;
      if (boolean) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }
}