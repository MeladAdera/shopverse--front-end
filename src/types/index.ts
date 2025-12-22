export interface Product {
  [x: string]: number;
  id: number;
  name: string;
  category: string;
  image: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
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