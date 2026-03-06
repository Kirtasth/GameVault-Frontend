import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NotImplementedComponent} from './core/components/not-implemented/not-implemented.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NotImplementedComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
