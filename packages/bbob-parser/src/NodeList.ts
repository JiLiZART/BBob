class NodeListOld<Value> {
  private n: Value[];

  constructor() {
    this.n = [];
  }

  last() {
    if (
        Array.isArray(this.n) &&
        this.n.length > 0 &&
        typeof this.n[this.n.length - 1] !== "undefined"
    ) {
      return this.n[this.n.length - 1];
    }

    return null;
  }

  flush() {
    return this.n.length ? this.n.pop() : false;
  }

  push(value: Value) {
    this.n.push(value);
  }

  toArray() {
    return this.n;
  }
}

class NodeList<Value> {
  private readonly n: Value[] = [];
  private len = -1;
  private lv: Value | null = null;

  last() {
    return this.lv;
  }

  flush() {
    if (this.len) {
      const lv = this.lv;
      this.len -= 1;

      this.lv = this.n[this.len];

      return lv;
    }

    return false;
  }

  push(value: Value) {
    this.n.push(value);
    this.lv = value;
    this.len += 1;
  }

  toArray() {
    return this.n.slice(0, this.len);
  }
}

export { NodeList };
export default NodeList;
