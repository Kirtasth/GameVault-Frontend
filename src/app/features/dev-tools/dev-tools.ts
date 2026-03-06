import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../core/components/sidebar/sidebar';
import { MyGames } from './my-games/my-games';
import { UploadGame } from './upload-game/upload-game';

@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [CommonModule, Sidebar, MyGames, UploadGame],
  templateUrl: './dev-tools.html',
  styleUrls: ['./dev-tools.scss']
})
export class DevToolsComponent {
  activeTab: 'my-games' | 'upload-game' = 'my-games';

  setActiveTab(tab: 'my-games' | 'upload-game') {
    this.activeTab = tab;
  }

  onGameCreated() {
    this.setActiveTab('my-games');
  }
}
