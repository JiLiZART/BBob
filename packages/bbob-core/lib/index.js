class BBob {
  constructor(plugins) {
    this.plugins = plugins;
  }

  // parse() {
  //
  // }
  //
  // stringify() {
  //
  // }
  //
  // process(input) {
  //
  // }
}

module.exports = function bbob(...plugins) {
  return new BBob(plugins);
};
