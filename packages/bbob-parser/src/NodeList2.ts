// experimental version
class NodeList2<Value> {
  private readonly n: Value[] = new Array<Value>(2000);
  private idx = 0;
  private lv: Value | null = null;

  last() {
    return this.lv;
  }

  flush() {
    if (this.idx) {
      const lv = this.lv;
      this.idx = this.idx - 1;

      debugger
      this.lv = this.n[this.idx];

      debugger
      return lv;
    }

    return false;
  }

  push(value: Value) {
    this.lv = value;
    this.n[this.idx] = value;
    this.idx = this.idx + 1;
    // this.n.length = this.idx;
  }

  // @fixme return pointer to array
  arrayRef() {
    const newarr =  this.n.slice(0, this.idx + 1);

    debugger
    return newarr;
  }
}
