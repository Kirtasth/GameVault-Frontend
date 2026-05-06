export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  developerId: string;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  statuses: string[];
  keysAvailable: number;
  usedKeys?: number;
}

export interface NewDeveloperModel {
  userId: number;
  name: string;
  description: string;
}

export interface NewGameModel {
  title: string;
  description: string;
  price: number;
  releaseDate: Date;
  image: File;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface GamePage {
  content: Game[];
  page: Page;
}

export interface CustomGameIds {
  ids: number[];
}

export interface GameKeyResponse {
  id: number;
  keyValue: string;
  isUsed: boolean;
  createdAt: string;
}

export interface PurchasedGameKeyResponse {
  gameId: number;
  gameTitle: string;
  imageUrl: string;
  keyValue: string;
  purchasedAt: string;
}
