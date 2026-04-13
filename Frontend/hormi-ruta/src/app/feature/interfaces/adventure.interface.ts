export interface Adventure {
  id: string; // UUID
  category: string;
  name: string;
  description: string;
  duration: string;
  minAge: number;
  difficulty: string;
  physicalRequirements?: string;
  mainImageUrl?: string;
  price: number,
  priceNote: "Entrada al lugar"
}

export interface CreateAdventure {
  categoryId: number;
  name: string;
  description: string;
  difficultyId: number;
  duration: string;
  minAge: number;
  physicalRequirements?: string;
}