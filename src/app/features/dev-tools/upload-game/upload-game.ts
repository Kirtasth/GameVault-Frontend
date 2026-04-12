import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required, min, submit } from '@angular/forms/signals';
import { CatalogService } from '../../../core/services/catalog.service';
import { NewGameModel } from '../../../core/models/catalog.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-upload-game',
  imports: [CommonModule, FormField],
  templateUrl: './upload-game.html',
  styleUrl: './upload-game.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadGame {
  gameCreated = output<void>();

  private catalogService = inject(CatalogService);

  uploadGameModel = signal({
    title: '',
    description: '',
    price: 0,
    releaseDate: ''
  });

  uploadGameForm = form(this.uploadGameModel, (s) => {
    required(s.title, { message: 'Title is required' });
    required(s.price, { message: 'Price is required' });
    min(s.price, 0, { message: 'Price must be at least 0' });
  });

  selectedFile = signal<File | null>(null);
  isSubmitting = signal(false);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onSubmit() {
    submit(this.uploadGameForm, async () => {
      const file = this.selectedFile();
      if (!file) {
        console.error('No file selected');
        return;
      }

      this.isSubmitting.set(true);
      try {
        const model = this.uploadGameModel();
        const newGame: NewGameModel = {
          title: model.title,
          description: model.description,
          price: model.price,
          releaseDate: new Date(model.releaseDate),
          image: file
        };

        await firstValueFrom(this.catalogService.createGame(newGame));
        console.log('Game created successfully');
        this.uploadGameForm().reset();
        this.selectedFile.set(null);
        this.gameCreated.emit();
      } catch (error) {
        console.error('Error creating game:', error);
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }
}
