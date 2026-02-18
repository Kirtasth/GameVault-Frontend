import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../core/components/sidebar/sidebar';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CatalogService} from '../../core/services/catalog.service';
import {NewGameModel} from '../../core/models/catalog.model';

@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [CommonModule, Sidebar, ReactiveFormsModule],
  templateUrl: './dev-tools.html',
  styleUrls: ['./dev-tools.scss']
})
export class DevToolsComponent {
  activeTab: 'my-games' | 'upload-game' = 'my-games';
  uploadGameForm: FormGroup;
  selectedFile: File | null = null;

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

  setActiveTab(tab: 'my-games' | 'upload-game') {
    this.activeTab = tab;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.uploadGameForm.valid && this.selectedFile) {
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
          this.setActiveTab('my-games');
        },
        error: (error) => {
          console.error('Error creating game:', error);
        }
      });
    }
  }
}
