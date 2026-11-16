import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import html from '@bbob/html';

import type { SafeHtml } from '@angular/platform-browser';
import type { BBobHTMLOptions } from '@bbob/html';
import type { BBobPlugins } from '@bbob/types';

// Raw text is not escaped by @bbob/html, so escape before parsing to keep HTML in the source inert.
const escapeHTML = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

@Component({
  selector: 'bbob-bbcode',
  template: '',
  host: { '[innerHTML]': 'html' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BBCodeComponent {
  @Input() source = '';

  @Input() plugins: BBobPlugins = [];

  @Input() options?: BBobHTMLOptions;

  /**
   * Bypass Angular's HTML sanitizer. The sanitizer strips `style` attributes,
   * which breaks tags like [b] or [color] from the html5 preset.
   * Source text is HTML-escaped before parsing, so only preset-generated markup passes through.
   */
  @Input() trusted = false;

  private readonly sanitizer = inject(DomSanitizer);

  get html(): string | SafeHtml {
    const result = html(escapeHTML(this.source), this.plugins, this.options);

    return this.trusted ? this.sanitizer.bypassSecurityTrustHtml(result) : result;
  }
}

export default BBCodeComponent;
