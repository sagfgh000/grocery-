
export type Product = {
  id: string;
  name_en: string;
  name_bn: string;
  sku: string;
  unit: 'kg' | 'g' | 'pcs';
  stock_quantity: number;
  selling_price: number;
  buying_price: number;
  category: string;
  low_stock_threshold: number;
  imageUrl?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  subtotal: number;
  profit: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  totalProfit: number;
  paymentMethod: 'cash' | 'mobile-pay' | 'card';
  cashierId: string;
  createdAt: string; // Store as ISO string for serialization
  paymentStatus: 'paid' | 'due';
  amountPaid: number;
  amountDue: number;
  customer?: {
    id: string;
    name: string;
  };
};
