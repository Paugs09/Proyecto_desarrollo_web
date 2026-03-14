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
  price: 0,
  priceNote: "Entrada al lugar"
}