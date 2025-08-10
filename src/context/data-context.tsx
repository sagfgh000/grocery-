
"use client";

import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { Product, Order } from '@/lib/types';
import { initialProducts, generateInitialOrders } from '@/lib/data';
import { useSettings } from './settings-context';

const PRODUCTS_STORAGE_KEY = 'grocerEaseProducts';
const ORDERS_STORAGE_KEY = 'grocerEaseOrders';
const DATA_CLEARED_FLAG = 'grocerEaseDataCleared';

interface AllData {
  products: Product[];
  orders: Order[];
  settings: any;
}

interface DataContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Product) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, newPaymentAmount: number) => void;
  clearAllData: () => void;
  exportData: () => AllData;
  importData: (data: AllData) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const settingsContext = useSettings();

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      const dataCleared = localStorage.getItem(DATA_CLEARED_FLAG);

      // If data has been explicitly cleared, start with empty state.
      if (dataCleared === 'true') {
        setProducts([]);
        setOrders([]);
      } else if (storedProducts) {
        // If there's stored data, use it.
        setProducts(JSON.parse(storedProducts));
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        } else {
          setOrders([]);
        }
      } else {
        // This is a fresh start, load initial sample data.
        setProducts(initialProducts);
        setOrders(generateInitialOrders(initialProducts));
      }

    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      // Fallback to sample data in case of any error.
      setProducts(initialProducts);
      setOrders(generateInitialOrders(initialProducts));
    } finally {
        setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      } catch (error) {
        console.error("Failed to save products to localStorage", error);
      }
    }
  }, [products, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } catch (error) {
        console.error("Failed to save orders to localStorage", error);
      }
    }
  }, [orders, isInitialLoad]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const addOrder = (order: Order) => {
    // 1. Add the new order
    setOrders(prev => [order, ...prev]);

    // 2. Update stock quantities
    setProducts(prevProducts => {
        const newProducts = [...prevProducts];
        order.items.forEach(item => {
            const productIndex = newProducts.findIndex(p => p.id === item.product.id);
            if(productIndex !== -1) {
                newProducts[productIndex].stock_quantity -= item.quantity;
            }
        });
        return newProducts;
    });
  };
  
  const updateOrder = (orderId: string, newPaymentAmount: number) => {
    setOrders(prevOrders => 
        prevOrders.map(order => {
            if (order.id === orderId) {
                const newAmountPaid = order.amountPaid + newPaymentAmount;
                const newAmountDue = order.total - newAmountPaid;
                return {
                    ...order,
                    amountPaid: newAmountPaid,
                    amountDue: newAmountDue,
                    paymentStatus: newAmountDue <= 0 ? 'paid' : 'due',
                };
            }
            return order;
        })
    );
  };

  const clearAllData = () => {
    // Set state to empty arrays for a fresh start
    setProducts([]);
    setOrders([]);
    settingsContext.setSettings({
        shopName: 'ইয়া আলী খাদ্য ভান্ডার',
        shopAddress: '123 Fresh St, Farmville, USA',
    });
    
    // Clear all relevant keys from local storage
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    localStorage.removeItem('grocerEaseSettings');
    localStorage.removeItem('grocerEaseLanguage');
    // Set a flag indicating data has been cleared.
    localStorage.setItem(DATA_CLEARED_FLAG, 'true');
  }

  const exportData = (): AllData => {
    return {
      products,
      orders,
      settings: settingsContext.settings
    };
  };

  const importData = (data: AllData): boolean => {
    if (data && data.products && data.orders && data.settings) {
        setProducts(data.products);
        setOrders(data.orders);
        settingsContext.setSettings(data.settings);
        // When importing data, we assume the user wants to keep it.
        localStorage.removeItem(DATA_CLEARED_FLAG);
        return true;
    }
    return false;
  };


  return (
    <DataContext.Provider value={{ products, orders, addProduct, addOrder, updateOrder, clearAllData, exportData, importData }}>
      {!isInitialLoad && children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
