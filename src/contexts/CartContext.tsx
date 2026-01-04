import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Animal } from '../mock-data/mockData';

interface CartContextType {
  items: CartItem[];
  addItem: (animal: Animal, quantity: number) => void;
  removeItem: (animalId: string) => void;
  updateQuantity: (animalId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (animal: Animal, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.animalId === animal.id);
      if (existing) {
        return prev.map((item) =>
          item.animalId === animal.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { animalId: animal.id, quantity, price: animal.price }];
    });
  };

  const removeItem = (animalId: string) => {
    setItems((prev) => prev.filter((item) => item.animalId !== animalId));
  };

  const updateQuantity = (animalId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(animalId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.animalId === animalId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

