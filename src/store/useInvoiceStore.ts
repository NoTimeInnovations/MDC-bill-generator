import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Invoice } from '../types';

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  getInvoice: (id: string) => Invoice | undefined;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  addInvoice: (invoiceData) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: uuidv4(),
      invoiceNumber: `INV-${Date.now()}`,
    };
    set((state) => ({ invoices: [...state.invoices, newInvoice] }));
    return newInvoice;
  },
  getInvoice: (id) => {
    return get().invoices.find((invoice) => invoice.id === id);
  },
}));
