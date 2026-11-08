import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import html from '@bbob/html';

import type { SafeHtml } from '@angular/platform-browser';
import type { BBobHTMLOptions } from '@bbob/html';
import type { BBobPlugins } from '@bbob/types';

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
   * Only enable for input you trust: BBob does not escape raw text.
   */
  @Input() trusted = false;

  private readonly sanitizer = inject(DomSanitizer);

  get html(): string | SafeHtml {
    const result = html(this.source, this.plugins, this.options);

    return this.trusted ? this.sanitizer.bypassSecurityTrustHtml(result) : result;
  }
}

export default BBCodeComponent;
