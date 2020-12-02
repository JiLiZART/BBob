import { createCharGrabber } from '../src/utils';


describe('utils', () => {
  describe('createCharGrabber', () => {

    test('#substrUntilChar ] 1', () => {
      /**

      }
       */
      const bufferGrabber = createCharGrabber('[h1 name=value]Foo [Bar] [/h1]');
      const substr = bufferGrabber.substrUntilChar(']');

      expect(substr).toBe('[h1 name=value');
    });

    test('#substrUntilChar ] 2', () => {
      /**
       console.log src/utils.js:95
       substrUntilChar { char: ']', indexOfChar: 63, curPos: 0 } {
        result: '[url href=https://ru.wikipedia.org target=_blank text="Foo Bar"',
        source: '[url href=https://ru.wikipedia.org target=_blank text="Foo Bar"]Text[/url]'
      }
       console.log src/utils.js:104
       substrUntilChar.new { char: ']', indexOfCharNew: 63, curPos: 0 } {
        result: '[url href=https://ru.wikipedia.org target=_blank text="Foo Bar"]',
        source: '[url href=https://ru.wikipedia.org target=_blank text="Foo Bar"]Text[/url]'
      }
       */
      const bufferGrabber = createCharGrabber('[url href=https://ru.wikipedia.org target=_blank text="Foo Bar"]Text[/url]');
      const substr = bufferGrabber.substrUntilChar(']');

      expect(substr).toBe('[url href=https://ru.wikipedia.org target=_blank text="Foo Bar"');
    });

    test('#substrUntilChar ] 3', () => {
      /**
       console.log src/utils.js:95
       substrUntilChar { char: ']', indexOfChar: 14, curPos: 7 } {
        result: 'blah foo="bar"',
        source: 'hello [blah foo="bar"]world[/blah]'
      }
       console.log src/utils.js:104
       substrUntilChar.new { char: ']', indexOfCharNew: 21, curPos: 7 } {
        result: 'blah foo="bar"]world[/',
        source: 'hello [blah foo="bar"]world[/blah]'
      }
       */
      const bufferGrabber = createCharGrabber('hello [blah foo="bar"]world[/blah]');
      const substr = bufferGrabber.substrUntilChar('[');

      expect(substr).toBe('hello ');
    });

    test('#substrUntilChar not existed', () => {
      /**
       console.log src/utils.js:95
       substrUntilChar { char: ']', indexOfChar: 14, curPos: 7 } {
        result: 'blah foo="bar"',
        source: 'hello [blah foo="bar"]world[/blah]'
      }
       console.log src/utils.js:104
       substrUntilChar.new { char: ']', indexOfCharNew: 21, curPos: 7 } {
        result: 'blah foo="bar"]world[/',
        source: 'hello [blah foo="bar"]world[/blah]'
      }
       */
      const bufferGrabber = createCharGrabber('hello');
      const substr = bufferGrabber.substrUntilChar('[');

      expect(substr).toBe('');
    });

    test('getPrev is null', () => {
      const bufferGrabber = createCharGrabber('');
      const prev = bufferGrabber.getPrev();

      expect(prev).toBe(null);
    });

    test('getRest', () => {
      const bufferGrabber = createCharGrabber('hello [blah foo="bar"]world[/blah]');
      bufferGrabber.skip();
      const rest = bufferGrabber.getRest();

      expect(rest).toBe('ello [blah foo="bar"]world[/blah]');
    });

  })
});
