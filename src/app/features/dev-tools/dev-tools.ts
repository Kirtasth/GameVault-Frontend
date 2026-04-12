import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../core/components/sidebar/sidebar';
import { MyGames } from './my-games/my-games';
import { UploadGame } from './upload-game/upload-game';

@Component({
  selector: 'app-dev-tools',
  imports: [CommonModule, Sidebar, MyGames, UploadGame],
  templateUrl: './dev-tools.html',
  styleUrls: ['./dev-tools.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsComponent {
  activeTab = signal<'my-games' | 'upload-game'>('my-games');

  setActiveTab(tab: 'my-games' | 'upload-game') {
    this.activeTab.set(tab);
  }

  onGameCreated() {
    this.setActiveTab('my-games');
  }
}
