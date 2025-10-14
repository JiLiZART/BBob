import { NodeList } from '../src/NodeList';

describe('NodeList', () => {
  test('push', () => {
    const list = new NodeList();

    list.push('a');
    list.push('b');
    list.push('c');

    expect(list.toArray()).toEqual(['a', 'b', 'c']);
  });

  test('last', () => {
    const list = new NodeList();

    list.push('a');
    list.push('b');
    list.push('c');

    expect(list.last()).toBe('c');
  });

  test('flush', () => {
    const list = new NodeList();

    list.push('a');
    list.push('b');
    list.push('c');

    expect(list.flush()).toBe('a');
    expect(list.toArray()).toEqual(['b', 'c']);
  });
});
