
export type Page = 'landing' | 'selection' | 'editor' | 'preview' | 'admin';

export interface BottleModel {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  price: number;
}

export interface CustomizationState {
  color: string;
  material: 'matte' | 'glossy' | 'metallic';
  labelUrl?: string;
  labelScale: number;
  labelRotation: number;
  labelY: number;
  capColor: string;
  labelTexture?: string;
}

export interface Order {
  id: string;
  bottleName: string;
  customer: string;
  status: 'pending' | 'processing' | 'shipped';
  date: string;
  total: number;
}
