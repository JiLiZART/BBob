const { iterate } = require('../lib/utils');

describe('@bbob/core utils', () => {
  test('iterate', () => {
    const testArr = [{
      one: true,
      content: [{ oneInside: true }]
    }, {
      two: true,
      content: [{ twoInside: true }]
    }];

    const resultArr = iterate(testArr, node => {
      node.pass = 1;

      return node;
    });

    expect(resultArr).toEqual([{
      one: true,
      pass: 1,
      content: [{ oneInside: true, pass: 1, }]
    }, {
      two: true,
      pass: 1,
      content: [{ twoInside: true, pass: 1, }]
    }]);
  });
});
