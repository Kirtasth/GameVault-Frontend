import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {CatalogService} from '../../services/catalog.service';
import {catchError, Observable, of} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  isCollapsed = false;
  isDeveloper$: Observable<boolean> = of(false);
  private readonly authService = inject(AuthService);
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.isDeveloper$ = this.catalogService.isUserDeveloper().pipe(
        catchError((err) => {
          console.error(err);
          return of(false);
        })
      );
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.isDeveloper$ = of(false);
        this.router.navigate(['/login']).then();
      },
      error: (err) => {
        console.error(err);
        // Even if the backend call fails, we should probably clear local storage and redirect
        this.isDeveloper$ = of(false);
        localStorage.clear();
        this.router.navigate(['/login']).then();
      }
    });
  }
}
