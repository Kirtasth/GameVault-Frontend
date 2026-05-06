import { Directive, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceClick]',
  standalone: true
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Output() debounceClick = new EventEmitter<Event>();
  
  private clicks = new Subject<Event>();
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.clicks.pipe(
      throttleTime(500, undefined, { leading: true, trailing: false })
    ).subscribe(event => this.debounceClick.emit(event));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  @HostListener('click', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  onClick(event: Event) {
    this.clicks.next(event);
  }
}
