import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {CatalogService} from '../../services/catalog.service';
import {UserService} from '../../services/user.service';
import {CartService} from '../../services/cart.service';
import {NavigationService} from '../../services/navigation.service';
import { DebounceClickDirective } from '../../directives/debounce-click.directive';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, DebounceClickDirective],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly navService = inject(NavigationService);

  isCollapsed = this.navService.isCollapsed;
  isSidebarOpen = this.navService.isSidebarOpen;
  isDeveloper = this.catalogService.isDeveloper;
  userProfile = this.userService.userProfile;
  cartItemCount = this.cartService.totalItems;
  isAuthenticated = this.authService.isAuthenticatedSignal;

  ngOnInit() {
    // If we're authenticated but don't know the dev status yet, fetch it
    if (this.isAuthenticated()) {
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
    this.navService.toggleCollapsed();
  }

  closeSidebar() {
    this.navService.closeSidebar();
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
