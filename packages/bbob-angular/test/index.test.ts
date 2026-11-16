import '@angular/compiler';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import preset from '@bbob/preset-html5';

import { BBCodeComponent } from '../src';

import type { BBobPlugins } from '@bbob/types';

TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

@Component({
  imports: [BBCodeComponent],
  template: '<bbob-bbcode [source]="source" [plugins]="plugins" [trusted]="trusted"></bbob-bbcode>',
})
class HostComponent {
  source = '';

  plugins: BBobPlugins = [preset()];

  trusted = false;
}

const renderBBCode = async (source: string, trusted = false) => {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentInstance.source = source;
  fixture.componentInstance.trusted = trusted;
  await fixture.whenStable();

  return (fixture.nativeElement as HTMLElement).querySelector('bbob-bbcode')?.innerHTML;
};

describe('@bbob/angular', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  test('[url] renders through the sanitizer', async () => {
    expect(await renderBBCode('[url=https://github.com/JiLiZART/bbob]bbob[/url]'))
      .toBe('<a href="https://github.com/JiLiZART/bbob">bbob</a>');
  });

  test('sanitizer strips style attributes by default', async () => {
    expect(await renderBBCode('[b]bolded text[/b]')).toBe('<span>bolded text</span>');
  });

  test('trusted keeps style attributes', async () => {
    expect(await renderBBCode('[b]bolded text[/b]', true))
      .toBe('<span style="font-weight: bold;">bolded text</span>');
  });

  test('trusted escapes raw html in source', async () => {
    expect(await renderBBCode('[b]a[/b]<img src=x onerror="1">', true))
      .toBe('<span style="font-weight: bold;">a</span>&lt;img src=x onerror="1"&gt;');
  });

  test('raw html in source is escaped', async () => {
    expect(await renderBBCode('<img src=x onerror="1">')).toBe('&lt;img src=x onerror="1"&gt;');
  });
});
