import React from 'react'
import { render } from "../src";

describe('@bbob/react render', () => {
  test('render simple b tag', () => {
    const html = render('[b]boldedtext[/b]');

    expect(html[0].type).toStrictEqual('b')
  })
  test('render self closed b tag', () => {
    const html = render('[b][/b]');

    expect(html[0].type).toBe('b')
  })
  test('render simple text nodes', () => {
    const html = render('some example words');

    expect(html[0]).toStrictEqual("some")
  })
})
