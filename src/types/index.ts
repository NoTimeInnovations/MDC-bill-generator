export interface Treatment {
  id: string;
  name: string;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  age: number;
  phoneNumber: string;
  opNumber: string;
  treatments: Treatment[];
  total: number;
  date: string;
}