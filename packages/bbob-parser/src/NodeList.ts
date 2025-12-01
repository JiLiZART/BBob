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

  has() {
    return this.n.length > 0;
  }

  flush() {
    return this.n.length ? this.n.pop() : undefined;
  }

  push(value: Value) {
    this.n.push(value);
  }

  ref() {
    return this.n;
  }
}

export { NodeList };
export default NodeList;
