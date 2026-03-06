import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CatalogService } from '../../services/catalog.service';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  isCollapsed = false;

  private readonly catalogService = inject(CatalogService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  isDeveloper = this.catalogService.isDeveloper;
  userProfile = this.userService.userProfile;
  cartItemCount = this.cartService.totalItems;

  ngOnInit() {
    // If we're authenticated but don't know the dev status yet, fetch it
    if (this.authService.isAuthenticated()) {
      if (this.isDeveloper() === null) {
        this.catalogService.isUserDeveloper().subscribe();
      }

      // Also fetch user profile for avatar/username in sidebar if not already loaded
      if (this.userProfile() === null) {
        this.userService.fetchProfile().subscribe();
      }
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.catalogService.clearCache();
        this.userService.clearProfile();
        this.router.navigate(['/login']).then();
      },
      error: (err) => {
        console.error(err);
        this.catalogService.clearCache();
        this.userService.clearProfile();
        this.authService.purgeAuth();
        this.router.navigate(['/login']).then();
      }
    });
  }
}
