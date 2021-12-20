function filter(input, parameter, value) {
  return input.filter((item) => item[parameter] === value);
}

module.exports = {
  filter,
};
