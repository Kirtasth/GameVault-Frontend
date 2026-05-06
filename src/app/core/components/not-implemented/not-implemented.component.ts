import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-not-implemented',
  templateUrl: './not-implemented.component.html',
  styleUrls: ['./not-implemented.component.css'],
  standalone: true
})
export class NotImplementedComponent {
  isOpen = signal(false);

  toggle() {
    this.isOpen.update(v => !v);
  }
}
