import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Game } from '../../../../core/models/catalog.model';
import { CatalogService } from '../../../../core/services/catalog.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-keys',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-keys.html',
  styleUrl: './add-keys.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddKeysComponent {
  game = input.required<Game>();
  keysAdded = output<void>();
  cancelAction = output<void>();

  private fb = inject(FormBuilder);
  private catalogService = inject(CatalogService);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  keysForm = this.fb.group({
    keys: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9- \n\r]+$/)]],
  });

  async onSubmit() {
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
