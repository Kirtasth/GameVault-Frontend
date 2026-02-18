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
