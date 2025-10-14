class NodeList<Value> {
  private readonly n: Value[];

  constructor() {
    this.n = [];
  }

  last() {
    const len = this.n.length

    if (len > 0) {
      return this.n[len - 1];
    }

    return undefined;
  }

  flush() {
    return this.n.length ? this.n.pop() : false;
  }

  push(value: Value) {
    this.n.push(value);
  }

  arrayRef() {
    return this.n;
  }
}

export { NodeList };
export default NodeList;
