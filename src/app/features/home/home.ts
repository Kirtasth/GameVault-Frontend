import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../core/components/sidebar/sidebar';
import { CatalogService } from '../../core/services/catalog.service';
import { Game, GamePage } from '../../core/models/catalog.model';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { GamePreview } from '../../core/components/game-preview/game-preview';
import {UserService} from '../../core/services/user.service';
import {UserRole} from '../../core/models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Sidebar, RouterLink, GamePreview],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private catalogService = inject(CatalogService);
  private userService = inject(UserService);

  games$!: Observable<GamePage>;
  selectedGame: Game | null = null;
  isDeveloper = false;

  ngOnInit() {
    this.games$ = this.catalogService.getGames();

    const profile = this.userService.userProfile();
    if (profile) {
      this.isDeveloper = profile.roles.some(r => r.role === UserRole.DEVELOPER);
    } else {
      this.userService.fetchProfile().subscribe(profile => {
        this.isDeveloper = profile.roles.some(r => r.role === UserRole.DEVELOPER);
      });
    }
  }

  openPreview(game: Game) {
    this.selectedGame = game;
  }

  closePreview() {
    this.selectedGame = null;
  }
}
