
"use client";

import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { Product, Order } from '@/lib/types';
import { initialProducts, generateInitialOrders } from '@/lib/data';

const PRODUCTS_STORAGE_KEY = 'grocerEaseProducts';
const ORDERS_STORAGE_KEY = 'grocerEaseOrders';

interface DataContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Product) => void;
  addOrder: (order: Order) => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(initialProducts);
      }

      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders(generateInitialOrders(initialProducts));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
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
    setOrders(prev => [order, ...prev]);
  };
  
  const clearAllData = () => {
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    localStorage.removeItem('grocerEaseSettings'); // Also clear settings
    window.location.reload(); // Reload to apply changes and clear state
  }

  return (
    <DataContext.Provider value={{ products, orders, addProduct, addOrder, clearAllData }}>
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
