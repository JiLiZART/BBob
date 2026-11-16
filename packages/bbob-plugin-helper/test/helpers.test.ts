import {
    attrsToString,
    attrValue,
    appendToNode,
    getNodeLength,
    getUniqAttr,
    isTagNode,
    isStringNode,
    isEOL,
    TagNode, escapeAttrValue,
} from '../src';

describe('@bbob/plugin-helper/helpers', () => {
    test('appendToNode', () => {
        const value = 'test';
        const node = {content: []} as unknown as TagNode;

        appendToNode(node, value);
        expect(node.content).toBeInstanceOf(Array)
        expect((node.content as string[]).pop()).toBe(value);
    });

    test('getNodeLength', () => {
        const node = {
            tag: 'test',
            content: [
                '123',
                {
                    tag: 'test2',
                    content: ['123']
                }
            ]
        } as TagNode;

        expect(getNodeLength(node)).toBe(6)
    });

    test('isTagNode', () => {
        const node = {
            tag: 'test',
            content: [] as string[]
        };

        expect(isTagNode(node)).toBe(true)
    });

    test('isStringNode', () => {
        const node = {
            tag: 'test',
            content: ['123']
        };

        expect(isStringNode(node.content[0])).toBe(true);
    });

    test('attrValue boolean', () => {
        expect(attrValue('test', true)).toBe('test');
    });

    test('attrValue number', () => {
        expect(attrValue('test', 123)).toBe('test="123"');
    });

    test('attrValue string', () => {
        expect(attrValue('test', 'hello')).toBe('test="hello"');
    });

    test('attrValue object', () => {
        const attrs = {tag: 'test'};

        expect(attrValue('test', attrs)).toBe('test="{&quot;tag&quot;:&quot;test&quot;}"');
    });

    test('isEOL', () => {
        expect(isEOL('\n')).toBe(true)
    });

    test('attrsToString', () => {
        expect(attrsToString({
            tag: 'test',
            foo: 'bar',
            disabled: true
        })).toBe(` tag="test" foo="bar" disabled`)
    });

    test('attrsToString undefined', () => {
        expect(attrsToString(undefined)).toBe('')
    });

    describe('attrsToString escape', () => {
        test(`javascript:alert("hello")`, () => {
            expect(attrsToString({
                onclick: `javascript:alert('hello')`,
                href: `javascript:alert('hello')`,
            })).toBe(` onclick="javascript%3Aalert(&#039;hello&#039;)" href="javascript%3Aalert(&#039;hello&#039;)"`)
        });
        test(`JAVASCRIPT:alert("hello")`, () => {
            expect(attrsToString({
                onclick: `JAVASCRIPT:alert('hello')`,
                href: `JAVASCRIPT:alert('hello')`,
            })).toBe(` onclick="JAVASCRIPT%3Aalert(&#039;hello&#039;)" href="JAVASCRIPT%3Aalert(&#039;hello&#039;)"`)
        });
        test(`file:alert("hello")`, () => {
            expect(attrsToString({
                href: `file:///shared/customer_info/customer-name`,
            })).toBe(` href="file%3A///shared/customer_info/customer-name"`)
        });
        test(`<tag>`, () => {
            expect(attrsToString({
                onclick: `<tag>`,
                href: `<tag>`,
            })).toBe(` onclick="&lt;tag&gt;" href="&lt;tag&gt;"`)
        });
    });

    /**
     * Regression tests for the control-character URL-scheme bypass.
     *
     * `escapeAttrValue` neutralizes dangerous schemes with
     * `/(javascript|data|vbscript|file):/gi`, but that regex only matches a
     * contiguous scheme token. Browsers strip ASCII TAB/LF/CR (and ignore other
     * C0 control chars) while resolving a URL scheme, so `java\tscript:` still
     * executes as `javascript:` — splitting the keyword with a control char used
     * to slip past the guard. The fix strips control chars before the guard runs.
     */
    describe('escapeAttrValue scheme bypass', () => {
        const TAB = '\t';
        const LF = '\n';
        const CR = '\r';

        // A value is "live" if, after the browser's own scheme normalization
        // (removing tab/newline/CR), it still begins with a dangerous scheme.
        const firesAsScheme = (out: string) =>
            /^\s*(javascript|data|vbscript|file):/i.test(out.replace(/[\t\n\r]/g, ''));

        describe('escapeAttrValue', () => {
            test('baseline: plain javascript: is neutralized', () => {
                expect(escapeAttrValue(`javascript:alert('hello')`))
                    .toBe(`javascript%3Aalert(&#039;hello&#039;)`);
            });

            test.each([
                ['tab',             `java${TAB}script:alert('hello')`],
                ['newline',         `java${LF}script:alert('hello')`],
                ['carriage return', `java${CR}script:alert('hello')`],
            ])('control char (%s) inside scheme is neutralized', (_name, payload) => {
                const out = escapeAttrValue(payload);
                expect(out).toBe(`javascript%3Aalert(&#039;hello&#039;)`);
                expect(firesAsScheme(out)).toBe(false);
            });

            test('leading control char is stripped and scheme neutralized', () => {
                expect(escapeAttrValue(`${TAB}javascript:alert('hello')`))
                    .toBe(`javascript%3Aalert(&#039;hello&#039;)`);
            });

            test('control chars split across the scheme letters are neutralized', () => {
                expect(escapeAttrValue(`ja${TAB}va${LF}scr${CR}ipt:alert('hello')`))
                    .toBe(`javascript%3Aalert(&#039;hello&#039;)`);
            });

            test('uppercase scheme with control char is neutralized', () => {
                expect(escapeAttrValue(`JAVA${TAB}SCRIPT:alert('hello')`))
                    .toBe(`JAVASCRIPT%3Aalert(&#039;hello&#039;)`);
            });

            test.each([
                ['data',     `da${TAB}ta:text/html,<b>`,      `data%3Atext/html,&lt;b&gt;`],
                ['vbscript', `vb${LF}script:msgbox(1)`,       `vbscript%3Amsgbox(1)`],
                ['file',     `fi${CR}le:///etc/passwd`,       `file%3A///etc/passwd`],
            ])('other dangerous scheme (%s) with control char is neutralized', (_name, payload, expected) => {
                const out = escapeAttrValue(payload);
                expect(out).toBe(expected);
                expect(firesAsScheme(out)).toBe(false);
            });

            test('other C0 control chars (NUL, DEL) are stripped', () => {
                expect(escapeAttrValue(`java\u0000script:alert(1)`)).toBe(`javascript%3Aalert(1)`);
                expect(escapeAttrValue(`java\u007Fscript:alert(1)`)).toBe(`javascript%3Aalert(1)`);
            });

            test('legitimate URLs are left intact (aside from HTML escaping)', () => {
                expect(escapeAttrValue('https://example.com/a?b=1&c=2'))
                    .toBe('https://example.com/a?b=1&amp;c=2');
                expect(escapeAttrValue('/path/to/page')).toBe('/path/to/page');
                expect(escapeAttrValue('mailto:user@example.com')).toBe('mailto:user@example.com');
            });
        });

        // The public choke point: @bbob/html renders attributes through attrsToString.
        describe('attrsToString (render path)', () => {
            test('tab-split javascript href is defanged', () => {
                expect(attrsToString({
                    href: `java${TAB}script:alert('hello')`,
                })).toBe(` href="javascript%3Aalert(&#039;hello&#039;)"`);
            });

            test('newline/CR variants on href and onclick are defanged', () => {
                expect(attrsToString({
                    onclick: `java${LF}script:alert('hello')`,
                    href: `java${CR}script:alert('hello')`,
                })).toBe(
                    ` onclick="javascript%3Aalert(&#039;hello&#039;)"` +
                    ` href="javascript%3Aalert(&#039;hello&#039;)"`,
                );
            });

            test('legit https href is unchanged aside from &amp; escaping', () => {
                expect(attrsToString({
                    href: 'https://example.com/a?b=1&c=2',
                })).toBe(` href="https://example.com/a?b=1&amp;c=2"`);
            });
        });
    });

    test('getUniqAttr with unq attr', () => {
        expect(getUniqAttr({foo: true, 'http://bar.com': 'http://bar.com'})).toBe('http://bar.com')
    });

    test('getUniqAttr without unq attr', () => {
        expect(getUniqAttr({foo: true})).toBe(null)
    })
});
