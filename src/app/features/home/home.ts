import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Sidebar} from '../../core/components/sidebar/sidebar';
import {CatalogService} from '../../core/services/catalog.service';
import {GamePage} from '../../core/models/catalog.model';
import {catchError, Observable, of} from 'rxjs';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Sidebar, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private gameService = inject(CatalogService);
  private authService = inject(AuthService);
  games$!: Observable<GamePage>;
  isDeveloper$: Observable<boolean> = of(false);

  ngOnInit() {
    this.games$ = this.gameService.getGames();

    if (this.authService.isAuthenticated()) {
      this.isDeveloper$ = this.gameService.isUserDeveloper().pipe(
        catchError((err) => {
          console.error(err);
          return of(false);
        })
      );
    }
  }
}
