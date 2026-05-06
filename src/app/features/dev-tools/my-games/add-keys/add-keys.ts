import { ChangeDetectionStrategy, Component, inject, input, OnInit, OnDestroy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Game } from '../../../../core/models/catalog.model';
import { CatalogService } from '../../../../core/services/catalog.service';
import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { DebounceClickDirective } from '../../../../core/directives/debounce-click.directive';

@Component({
  selector: 'app-add-keys',
  imports: [CommonModule, ReactiveFormsModule, DebounceClickDirective],
  templateUrl: './add-keys.html',
  styleUrl: './add-keys.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddKeysComponent implements OnInit, OnDestroy {
  game = input.required<Game>();
  keysAdded = output<void>();
  cancelAction = output<void>();

  private fb = inject(FormBuilder);
  private catalogService = inject(CatalogService);

  private submitSubject = new Subject<void>();
  private sub?: Subscription;

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  keysForm = this.fb.group({
    keys: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9- \n\r]+$/)]],
  });

  ngOnInit() {
    this.sub = this.submitSubject.pipe(
      throttleTime(500, undefined, { leading: true, trailing: false })
    ).subscribe(() => this.executeSubmit());
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async onSubmit() {
    this.submitSubject.next();
  }

  private async executeSubmit() {
    if (this.keysForm.invalid || this.isSubmitting()) return;

    const keysString = this.keysForm.get('keys')?.value || '';
    const keys = keysString
      .split('\n')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keys.length === 0) {
      this.errorMessage.set('Please enter at least one key');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.catalogService.addKeysToGame(this.game().id, keys));
      this.keysAdded.emit();
    } catch (error) {
      console.error('Error adding keys:', error);
      this.errorMessage.set('Failed to add keys. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onCancel() {
    this.cancelAction.emit();
  }
}
