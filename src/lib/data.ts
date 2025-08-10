import type { Product, Order, CartItem } from './types';

export const initialProducts: Product[] = [
  {
    id: 'prod_001',
    name_en: 'Fresh Apples',
    name_bn: 'তাজা আপেল',
    sku: 'FRT-APL-01',
    unit: 'kg',
    stock_quantity: 100,
    selling_price: 250,
    buying_price: 180,
    category: 'Fruits',
    low_stock_threshold: 10,
    imageUrl: 'https://placehold.co/300x300.png',
  },
  {
    id: 'prod_002',
    name_en: 'Whole Milk',
    name_bn: 'পূর্ণ দুধ',
    sku: 'DRY-MLK-01',
    unit: 'pcs',
    stock_quantity: 50,
    selling_price: 120,
    buying_price: 90,
    category: 'Dairy',
    low_stock_threshold: 5,
    imageUrl: 'https://placehold.co/300x300.png',
  },
  {
    id: 'prod_003',
    name_en: 'Brown Bread',
    name_bn: 'বাদামী রুটি',
    sku: 'BKY-BRD-01',
    unit: 'pcs',
    stock_quantity: 30,
    selling_price: 80,
    buying_price: 50,
    category: 'Bakery',
    low_stock_threshold: 6,
    imageUrl: 'https://placehold.co/300x300.png',
  },
  {
    id: 'prod_004',
    name_en: 'Chicken Breast',
    name_bn: 'মুরগির বুকের মাংস',
    sku: 'MT-CKN-01',
    unit: 'kg',
    stock_quantity: 25,
    selling_price: 450,
    buying_price: 350,
    category: 'Meat',
    low_stock_threshold: 5,
    imageUrl: 'https://placehold.co/300x300.png',
  },
  {
    id: 'prod_005',
    name_en: 'Carrots',
    name_bn: 'গাজর',
    sku: 'VEG-CRT-01',
    unit: 'kg',
    stock_quantity: 80,
    selling_price: 60,
    buying_price: 40,
    category: 'Vegetables',
    low_stock_threshold: 15,
    imageUrl: 'https://placehold.co/300x300.png',
  },
  {
    id: 'prod_006',
    name_en: 'Organic Eggs',
    name_bn: 'জৈব ডিম',
    sku: 'DRY-EGG-01',
    unit: 'pcs',
    stock_quantity: 60,
    selling_price: 15,
    buying_price: 10,
    category: 'Dairy',
    low_stock_threshold: 12,
    imageUrl: 'https://placehold.co/300x300.png',
  },
  {
    id: 'prod_007',
    name_en: 'Lentils',
    name_bn: 'মসুর ডাল',
    sku: 'GRN-LNT-01',
    unit: 'kg',
    stock_quantity: 200,
    selling_price: 140,
    buying_price: 110,
    category: 'Grains',
    low_stock_threshold: 20,
    imageUrl: 'https://placehold.co/300x300.png',
  },
  {
    id: 'prod_008',
    name_en: 'Olive Oil',
    name_bn: 'জলপাই তেল',
    sku: 'OIL-OLV-01',
    unit: 'pcs',
    stock_quantity: 40,
    selling_price: 900,
    buying_price: 750,
    category: 'Pantry',
    low_stock_threshold: 8,
    imageUrl: 'https://placehold.co/300x300.png',
  },
];

const generateRandomOrder = (id: number, date: Date, products: Product[]): Order => {
  const orderItems: CartItem[] = [];
  const numItems = Math.floor(Math.random() * 5) + 1;
  let subtotal = 0;
  let totalProfit = 0;

  for (let i = 0; i < numItems; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = product.unit === 'pcs' ? Math.floor(Math.random() * 5) + 1 : parseFloat((Math.random() * 2 + 0.5).toFixed(2));
    const itemSubtotal = product.selling_price * quantity;
    const itemProfit = (product.selling_price - product.buying_price) * quantity;
    
    orderItems.push({
      product,
      quantity,
      subtotal: itemSubtotal,
      profit: itemProfit
    });

    subtotal += itemSubtotal;
    totalProfit += itemProfit;
  }

  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const paymentMethods: ('cash' | 'mobile-pay' | 'card')[] = ['cash', 'card', 'mobile-pay'];
  const isDue = Math.random() > 0.8;
  const amountPaid = isDue ? parseFloat((total * (Math.random() * 0.5 + 0.2)).toFixed(2)) : total;
  const amountDue = total - amountPaid;

  return {
    id: `ORD-${String(id).padStart(3, '0')}`,
    items: orderItems,
    subtotal,
    tax,
    discount: 0,
    total,
    totalProfit,
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    cashierId: `cashier_0${Math.ceil(Math.random() * 2)}`,
    createdAt: date.toISOString(),
    paymentStatus: isDue ? 'due' : 'paid',
    amountPaid: amountPaid,
    amountDue: amountDue,
    customer: { id: `CUST-00${Math.floor(Math.random() * 5) + 1}`, name: 'Walking Customer' }
  };
};

export const generateInitialOrders = (products: Product[]): Order[] => {
    const orderList: Order[] = [];
    const today = new Date();
    let orderId = 1;

    for (let i = 90; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const numOrders = Math.floor(Math.random() * 5) + 2; // 2 to 6 orders per day
        for (let j = 0; j < numOrders; j++) {
            orderList.push(generateRandomOrder(orderId++, date, products));
        }
    }
    return orderList.reverse();
}
