export type DesignMode = 'obsidian' | 'apex';

export type Department = 'men' | 'women' | 'kids';

export type ActiveScreen =
  | 'home'
  | 'men'
  | 'women'
  | 'kids'
  | 'product'
  | 'updates'
  | 'orders'
  | 'register';

export type ShoeCategory = 'all' | 'marathon' | 'track' | 'trail';

export type UpdateCategory = 'all' | 'drop' | 'restock' | 'telemetry' | 'order';

export interface Colorway {
  id: string;
  name: string;
  hexPrimary: string;
  hexAccent: string;
  image: string;
}

export interface SizeOption {
  us: string;
  inStock: boolean;
  lowStock?: boolean;
}

export interface ShoeTelemetry {
  dropMm: number;
  weightOz: number;
  stackMm: number;
  plate: string;
  foam: string;
  energyReturn: string;
}

export interface ProductPhoto {
  id: string;
  label: string;
  src: string;
}

export interface FreeGiftProduct {
  name: string;
  sku: string;
  valuePKR: number;
  description: string;
}

export interface ShoeProduct {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  department: Department;
  sizeScaleLabel: string;
  category: Exclude<ShoeCategory, 'all'>;
  categoryLabel: string;
  originalPrice: number;
  price: number;
  statusNote: string;
  releaseNote: string;
  description: string;
  outsoleImage: string;
  gallery: ProductPhoto[];
  colorways: Colorway[];
  sizes: SizeOption[];
  telemetry: ShoeTelemetry;
  freeGift: FreeGiftProduct;
}

export interface CartItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  colorwayName: string;
  colorwayHex: string;
  usSize: string;
  originalPrice: number;
  price: number;
  quantity: number;
  image: string;
  freeGiftName?: string;
  freeGiftValue?: number;
}

export interface DropUpdate {
  id: string;
  category: Exclude<UpdateCategory, 'all'>;
  categoryLabel: string;
  title: string;
  summary: string;
  timestamp: string;
  author: string;
  productId?: string;
  productName?: string;
  highlightMetric?: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  returnDeadline?: string;
  customerName: string;
  whatsappPhone: string;
  shippingAddress: string;
  status: 'Confirmed' | 'Preparing Shipment' | 'In Transit' | 'Delivered';
  trackingCode: string;
  items: CartItem[];
  total: number;
}

export interface WhatsAppPreferences {
  recipientPhone: string;
  notifyDrops: boolean;
  notifyRestocks: boolean;
  notifyOrders: boolean;
  notifyTelemetry: boolean;
}

export interface RegisteredUser {
  memberId: string;
  fullName: string;
  email: string;
  whatsappPhone: string;
  preferredDepartment: Department;
  preferredUsSize: string;
  city: string;
  shippingAddress: string;
  notifyWhatsappDrops: boolean;
  registeredAt: string;
  passDigest?: string;
}
