import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../core/components/sidebar/sidebar';
import { CatalogService } from '../../core/services/catalog.service';
import { Game } from '../../core/models/game.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Sidebar, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private gameService = inject(CatalogService);
  games$!: Observable<Game[]>;

  ngOnInit() {
    this.games$ = this.gameService.getGames();
  }
}
