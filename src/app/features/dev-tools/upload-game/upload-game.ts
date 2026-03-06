import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { NewGameModel } from '../../../core/models/catalog.model';

@Component({
  selector: 'app-upload-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-game.html',
  styleUrl: './upload-game.css',
})
export class UploadGame {
  @Output() gameCreated = new EventEmitter<void>();
  
  uploadGameForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;

  private fb = inject(FormBuilder);
  private catalogService = inject(CatalogService);

  constructor() {
    this.uploadGameForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      releaseDate: ['']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.uploadGameForm.valid && this.selectedFile) {
      this.isSubmitting = true;
      const newGame: NewGameModel = {
        title: this.uploadGameForm.get('title')?.value,
        description: this.uploadGameForm.get('description')?.value,
        price: this.uploadGameForm.get('price')?.value,
        releaseDate: new Date(this.uploadGameForm.get('releaseDate')?.value),
        image: this.selectedFile
      };

      this.catalogService.createGame(newGame).subscribe({
        next: () => {
          console.log('Game created successfully');
          this.uploadGameForm.reset();
          this.selectedFile = null;
          this.isSubmitting = false;
          this.gameCreated.emit();
        },
        error: (error) => {
          console.error('Error creating game:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}
