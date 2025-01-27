import { 
    Component, 
    Input, 
    OnInit, 
    ElementRef, 
    Renderer2,
    Injectable, 
    NgModule 
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import * as bbobHtml from '@bbob/html';
  import * as bbobPresetReact from '@bbob/preset-react';
  
  interface BbobParseOptions {
    plugins?: any[];
    preset?: any;
    skipParsing?: boolean;
  }
  
  @Injectable({
    providedIn: 'root'
  })
  export class BbobHtmlService {
    parse(content: string, options: BbobParseOptions = {}): string {
      if (options.skipParsing) return content;
  
      try {
        const preset = options.preset || bbobPresetReact.default;
        const plugins = options.plugins || [];
        
        const parser = bbobHtml.default(
          plugins.length ? 
            { ...preset, plugins } : 
            preset
        );
        
        return parser.parse(content);
      } catch (error) {
        console.error('BBob HTML Parsing Error:', error);
        return content;
      }
    }
  }
  
  @Component({
    selector: 'bbcode',
    template: '<ng-content></ng-content>',
    standalone: true
  })
  export class BbcodeComponent implements OnInit {
    @Input() preset: any = null;
    @Input() plugins: any[] = [];
    @Input() skipParsing = false;
  
    constructor(
      private el: ElementRef, 
      private renderer: Renderer2,
      private bbobService: BbobHtmlService
    ) {}
  
    ngOnInit() {
      const rawContent = this.el.nativeElement.textContent.trim();
      const parsedContent = this.bbobService.parse(rawContent, {
        preset: this.preset,
        plugins: this.plugins,
        skipParsing: this.skipParsing
      });
      
      this.renderer.setProperty(
        this.el.nativeElement, 
        'innerHTML', 
        parsedContent
      );
    }
  }
  
  @NgModule({
    imports: [CommonModule, BbcodeComponent],
    exports: [BbcodeComponent]
  })
  export class BbobHtmlModule { }
