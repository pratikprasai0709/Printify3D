
export type Page = 'landing' | 'selection' | 'editor' | 'preview' | 'admin' | 'login' | 'register';

export interface BottleModel {
  id?: string;
  _id?: string;
  name: string;
  type: string;
  thumbnail: string;
  price: number;
  modelPath: string;
}

export interface CustomizationState {
  color: string;
  material: 'matte' | 'glossy' | 'metallic';
  labelUrl?: string;
  imageScale: number;
  imageRotation: number;
  imageX: number;
  imageY: number;
  capColor: string;
  labelTexture?: string;
  text?: string;
  font?: string;
  textColor?: string;
  fontSize: number;
  textScale: number;
  textRotation: number;
  textX: number;
  textY: number;
}

export interface Order {
  id: string;
  bottleName: string;
  customer: string;
  status: 'pending' | 'processing' | 'shipped';
  date: string;
  total: number;
}
