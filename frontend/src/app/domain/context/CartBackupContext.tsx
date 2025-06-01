import React, { createContext, useContext, useState, ReactNode } from "react";

// ✅ Cambiar 'bookId' por 'isbn'
type BackupItem = {
  isbn: string;
  quantity: number;
};

type CartBackupContextType = {
  backup: BackupItem[];
  setBackup: (items: BackupItem[]) => void;
  clearBackup: () => void;
};

const CartBackupContext = createContext<CartBackupContextType | undefined>(undefined);

export const useCartBackup = () => {
  const context = useContext(CartBackupContext);
  if (!context) {
    throw new Error("useCartBackup must be used within a CartBackupProvider");
  }
  return context;
};

export const CartBackupProvider = ({ children }: { children: ReactNode }) => {
  const [backup, setBackupState] = useState<BackupItem[]>([]);

  const setBackup = (items: BackupItem[]) => setBackupState(items);
  const clearBackup = () => setBackupState([]);

  return (
    <CartBackupContext.Provider value={{ backup, setBackup, clearBackup }}>
      {children}
    </CartBackupContext.Provider>
  );
};
