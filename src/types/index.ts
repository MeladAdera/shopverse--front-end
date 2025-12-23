import type { ReactNode } from "react";

export interface Product {
  originalPrice: any;
  rating: number;
  category: ReactNode;
  discount: any;
  image: string | undefined;
  id: number;
  name: string;
  description: string;
  price: number;              // ✅ رقم (1222)
  stock: number;              // ✅ رقم (8)
  image_urls: string[];       // ✅ مصفوفة ["/uploads/products/..."]
  category_id: number;
  category_name: string;      // ✅ "clothes"
  active: boolean;
  created_at: string;         // ✅ ISO string
  review_count: number;       // ✅ رقم (0)
  average_rating: number;     // ✅ رقم (0)
}

export interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  verified: boolean;
}

export interface StarRatingProps {
  rating: number;
}