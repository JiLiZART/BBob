import { iterate, match, same } from '../src/utils';
import { isTagNode } from "@bbob/plugin-helper";

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
      console.log('iterate', node);
      if (typeof node === 'object' && node !== null) {
        return {
          ...node,
          pass: 1
        }
      }

      return node;
    });

    const expected = [
      {
        one: true,
        content: [{ oneInside: true, pass: 1, }],
        pass: 1,
      }, {
        two: true,
        content: [{ twoInside: true, pass: 1, }],
        pass: 1,
      }
    ];

    console.log('resultArr', resultArr, expected);

    expect(resultArr).toEqual(expected);
  });
  test('match', () => {
    const testArr = [
      { tag: 'mytag1', one: 1 },
      { tag: 'mytag2', two: 1 },
      { tag: 'mytag3', three: 1 },
      { tag: 'mytag4', four: 1 },
      { tag: 'mytag5', five: 1 },
      { tag: 'mytag6', six: 1 },
    ];

    const resultArr = match(testArr, [{ tag: 'mytag1' }, { tag: 'mytag2' }], node => {
      if (isTagNode(node)) {
        node.attrs = node.attrs || {}
        node.attrs.pass = 1
      }

      return node;
    });

    const expected = [
      { tag: 'mytag1', one: 1, attrs: { pass: 1 } },
      { tag: 'mytag2', two: 1, attrs: { pass: 1 } },
      { tag: 'mytag3', three: 1 },
      { tag: 'mytag4', four: 1 },
      { tag: 'mytag5', five: 1 },
      { tag: 'mytag6', six: 1 },
    ];

    expect(resultArr).toEqual(expected)
  })

  describe('same', () => {
    test('same not same typeof', () => {
      expect(same(1, {})).toBe(false)
    })
    test('same boolean', () => {
      expect(same(true, true)).toBe(true)
    })
    test('same null', () => {
      expect(same(null, null)).toBe(true)
    })
    test('same array', () => {
      expect(same([1, 2, 3], [1, 2, 3, 4])).toBe(true)
    })
    test('same object', () => {
      expect(same({ foo: true, bar: 'test' }, { foo: true, bar: 'test', ext: true })).toBe(true)
    })
    test('same string', () => {
      expect(same('bar', 'bar')).toBe(true)
    })
  })
});
