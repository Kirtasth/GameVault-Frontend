import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required, min, submit, validate } from '@angular/forms/signals';
import { CatalogService } from '../../../core/services/catalog.service';
import { NewGameModel } from '../../../core/models/catalog.model';
import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { DebounceClickDirective } from '../../../core/directives/debounce-click.directive';

@Component({
  selector: 'app-upload-game',
  imports: [CommonModule, FormField, DebounceClickDirective],
  templateUrl: './upload-game.html',
  styleUrl: './upload-game.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadGame implements OnInit, OnDestroy {
  gameCreated = output<void>();

  private catalogService = inject(CatalogService);

  private submitSubject = new Subject<void>();
  private sub?: Subscription;

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
    validate(s.price, ({ valueOf }) => {
      const val = valueOf(s.price);
      const str = val.toString();
      if (str.includes('.') && str.split('.')[1].length > 2) {
        return { kind: 'decimal', message: 'Price must have at most 2 decimal places' };
      }
      return undefined;
    });
  });

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string>('');
  isSubmitting = signal(false);

  constructor() {
    effect((onCleanup) => {
      const file = this.selectedFile();
      if (file) {
        const url = URL.createObjectURL(file);
        this.previewUrl.set(url);
        onCleanup(() => URL.revokeObjectURL(url));
      } else {
        this.previewUrl.set('');
      }
    });
  }

  ngOnInit() {
    this.sub = this.submitSubject.pipe(
      throttleTime(500, undefined, { leading: true, trailing: false })
    ).subscribe(() => this.executeSubmit());
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onSubmit() {
    this.submitSubject.next();
  }

  private executeSubmit() {
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
