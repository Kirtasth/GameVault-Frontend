export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  developerId: string;
  releaseDate: Date;
  tags: string[];
}
