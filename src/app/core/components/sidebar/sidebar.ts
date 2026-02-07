import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  isCollapsed = false;
  isDeveloper = false;
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.userService.isUserDeveloper().subscribe({
        next: (isDev) => this.isDeveloper = isDev,
        error: (err) => console.error('Error checking developer status:', err)
      });
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.isDeveloper = false;
        this.router.navigate(['/login']).then();
      },
      error: (err) => {
        console.error(err);
        // Even if the backend call fails, we should probably clear local storage and redirect
        this.isDeveloper = false;
        localStorage.clear();
        this.router.navigate(['/login']).then();
      }
    });
  }
}
