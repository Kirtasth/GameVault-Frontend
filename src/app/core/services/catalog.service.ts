import {inject, Injectable } from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {Game, NewDeveloperModel} from '../models/catalog.model';
import {BackendService} from './api/backend.service';
import {AuthService} from './auth.service';
import {UserRole} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private readonly backendService = inject(BackendService);
  private readonly authService = inject(AuthService);


  // Mock data for now - will be replaced with API calls later
  private games: Game[] = [
    {
      id: '1',
      title: 'Cyber Odyssey 2077',
      description: 'An immersive open-world RPG set in a dystopian future where technology and humanity collide.',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070',
      developerId: 'dev1',
      releaseDate: new Date('2023-12-10'),
      tags: ['RPG', 'Sci-Fi', 'Open World']
    },
    {
      id: '2',
      title: 'Medieval Legends',
      description: 'Conquer kingdoms and build your empire in this strategy masterpiece set in the middle ages.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=2070',
      developerId: 'dev2',
      releaseDate: new Date('2023-11-15'),
      tags: ['Strategy', 'Medieval', 'Multiplayer']
    },
    {
      id: '3',
      title: 'Space Explorer',
      description: 'Explore the infinite universe, discover new planets, and survive against alien threats.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1614728853913-1e221a6572ef?auto=format&fit=crop&q=80&w=2070',
      developerId: 'dev1',
      releaseDate: new Date('2024-01-20'),
      tags: ['Adventure', 'Space', 'Survival']
    },
    {
      id: '4',
      title: 'Racing Elite',
      description: 'Experience the thrill of high-speed racing with realistic physics and stunning graphics.',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071',
      developerId: 'dev3',
      releaseDate: new Date('2023-10-05'),
      tags: ['Racing', 'Sports', 'Simulation']
    },
    {
      id: '5',
      title: 'Mystery Manor',
      description: 'Solve complex puzzles and uncover the dark secrets of the haunted manor.',
      price: 19.99,
      imageUrl: 'https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&q=80&w=2070',
      developerId: 'dev2',
      releaseDate: new Date('2023-09-30'),
      tags: ['Puzzle', 'Horror', 'Mystery']
    },
    {
      id: '6',
      title: 'Pixel Warriors',
      description: 'A retro-style platformer with challenging levels and nostalgic 8-bit music.',
      price: 14.99,
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070',
      developerId: 'dev3',
      releaseDate: new Date('2024-02-01'),
      tags: ['Platformer', 'Retro', 'Indie']
    }
  ];

  getGames(): Observable<Game[]> {
    return of(this.games);
  }

  getGameById(id: string): Observable<Game | undefined> {
    return of(this.games.find(g => g.id === id));
  }

  registerDeveloper(developer: NewDeveloperModel): Observable<any> {
    return this.backendService.registerDeveloper(developer);
  }

  isUserDeveloper(): Observable<boolean> {
    const userId = this.authService.getUserId();

    if (!userId) {
      throw new Error('User ID not found');
    }

    return this.backendService.getUserProfile(userId).pipe(
      map(userProfile => userProfile.roles.some(role => role.role === UserRole.DEVELOPER))
    );
  }
}
