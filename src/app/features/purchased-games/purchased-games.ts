import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../core/components/sidebar/sidebar';
import { CatalogService } from '../../core/services/catalog.service';
import { GamePage } from '../../core/models/catalog.model';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-purchased-games',
  standalone: true,
  imports: [CommonModule, Sidebar, RouterLink],
  templateUrl: './purchased-games.html',
  styleUrl: './purchased-games.css'
})
export class PurchasedGames implements OnInit {
  private catalogService = inject(CatalogService);

  games$!: Observable<GamePage>;

  ngOnInit() {
    this.games$ = this.catalogService.getPurchasedGames();
  }
}
