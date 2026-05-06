import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  isSidebarOpen = signal(false);
  isCollapsed = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  toggleCollapsed() {
    this.isCollapsed.update(v => !v);
  }
}
