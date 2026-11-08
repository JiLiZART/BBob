import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BBCodeComponent } from '@bbob/angular';
import preset from '@bbob/preset-html5';

@Component({
  selector: 'app-root',
  imports: [FormsModule, BBCodeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  bbcode = 'Text [b]bolded[/b] and [url=https://github.com/JiLiZART/bbob]link[/url]';
  plugins = [preset()];
}
