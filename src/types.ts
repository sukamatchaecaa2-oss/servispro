export type OrderCategory = 'HP' | 'Laptop' | 'Konsol Game' | 'TV' | 'Lainnya';

export type ServiceMethod = 'Antar ke Toko' | 'Panggil Teknisi';

export type OrderStatus =
  | 'Menunggu Antrean'
  | 'Sedang Dicek'
  | 'Sedang Diperbaiki'
  | 'Selesai Siap Diambil'
  | 'Gagal Diperbaiki';

export interface Order {
  id: string; // Format: SP-2026-XXXXX
  customerName: string;
  customerWhatsapp: string;
  customerEmail?: string;
  category: OrderCategory;
  brandType: string;
  complaint: string;
  method: ServiceMethod;
  status: OrderStatus;
  technicianNotes: string;
  repairCost: number;
  createdAt: string; // Real-time date formatted
  sparepartId?: string;
  sparepartName?: string;
  sparepartPrice?: number;
  technicianFee?: number;
}

export interface Sparepart {
  id: string;
  name: string;
  stock: number;
  price: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type UserRole = 'admin' | 'customer';

export interface LoggedInUser {
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  comment: string;
  rating: number;
  date: string;
}
