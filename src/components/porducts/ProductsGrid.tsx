// app/products/components/ProductsGrid.tsx
"use client";

import { useState } from "react";
import { Grid, List, Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard, { type Product } from "./ProductCard";
import { PaginationWrapper } from "./PaginationWrapper";

// بيانات حقيقية للمنتجات مع صور - تأكد أن جميع العناصر لها كل الخصائص
const realProducts: Product[] = [
  {
    id: 1,
    name: "VERTICAL STRIPED SHIRT",
    category: "Men's Fashion",
    image: "/image copy 13.png",
    price: "34.99",
    originalPrice: "43.99",
    discount: "-20%",
    rating: 4.5,
    ratingStars: "★★★★★",
    color: "Blue/White Stripes",
    isNew: true
  },
  {
    id: 2,
    name: "GRADIENT GRAPHIC T-SHIRT",
    category: "T-shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    price: "145.00",
    originalPrice: "160.00",
    discount: "-9%",
    rating: 4.8,
    ratingStars: "★★★★★",
    color: "Multicolor",
    isBestSeller: true
  },
  {
    id: 3,
    name: "SKINNY FIT JEANS",
    category: "Jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    price: "240.00",
    originalPrice: "260.00",
    discount: "-8%",
    rating: 4.2,
    ratingStars: "★★★★☆",
    color: "Blue Denim",
    isNew: true
  },
  {
    id: 4,
    name: "POLO WITH TIPPING DETAILS",
    category: "Shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
    price: "180.00",
    rating: 4.7,
    ratingStars: "★★★★★",
    color: "White",
    isBestSeller: true
  },
  {
    id: 5,
    name: "CHECKERED SHIRT",
    category: "Shirts",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
    price: "180.00",
    rating: 4.3,
    ratingStars: "★★★★☆",
    color: "Red/Black Checkered"
  },
  {
    id: 6,
    name: "BLACK STRIPED T-SHIRT",
    category: "T-shirts",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
    price: "120.00",
    originalPrice: "150.00",
    discount: "-20%",
    rating: 5.0,
    ratingStars: "★★★★★",
    color: "Black/White",
    isNew: true
  },
  {
    id: 7,
    name: "SLEEVE STRIPED T-SHIRT",
    category: "T-shirts",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop",
    price: "130.00",
    originalPrice: "160.00",
    discount: "-19%",
    rating: 4.5,
    ratingStars: "★★★★★",
    color: "Blue/White"
  },
  {
    id: 8,
    name: "OVERSIZED COTTON SHIRT",
    category: "Shirts",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    price: "95.00",
    rating: 4.1,
    ratingStars: "★★★★☆",
    color: "Beige",
    isNew: true
  },
  {
    id: 9,
    name: "CLASSIC DENIM JACKET",
    category: "Hoodie",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    price: "210.00",
    originalPrice: "230.00",
    discount: "-9%",
    rating: 4.6,
    ratingStars: "★★★★★",
    color: "Denim Blue",
    isBestSeller: true
  },
  {
    id: 10,
    name: "SPORT JOGGER PANTS",
    category: "Shorts",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop",
    price: "85.00",
    rating: 4.0,
    ratingStars: "★★★★☆",
    color: "Gray",
    isNew: true
  },
  {
    id: 11,
    name: "CASUAL BUTTON-UP SHIRT",
    category: "Shirts",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    price: "160.00",
    rating: 4.5,
    ratingStars: "★★★★★",
    color: "Navy Blue"
  },
  {
    id: 12,
    name: "HOODED SWEATSHIRT",
    category: "Hoodie",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    price: "125.00",
    originalPrice: "145.00",
    discount: "-14%",
    rating: 4.4,
    ratingStars: "★★★★☆",
    color: "Black",
    isBestSeller: true
  }
];

// ✅ تصحيح بناء mockProducts - مع معالجة لحالة undefined
const mockProducts: Product[] = Array.from({ length: 45 }, (_, i) => {
  // ✅ تأكد من وجود المنتج في realProducts
  const productIndex = i % realProducts.length;
  const baseProduct = realProducts[productIndex];
  
  // ✅ تحقق إذا كان baseProduct موجوداً
  if (!baseProduct) {
    // خيار بديل إذا كان هناك خطأ
    return {
      id: i + 1,
      name: "Default Product",
      category: "General",
      image: "https://via.placeholder.com/400x500",
      price: "99.99",
      rating: 4.0,
      ratingStars: "★★★★☆",
      color: "Black"
    };
  }
  
  const suffixes = ["(Premium)", "(Classic)", "(Limited Edition)", "(Exclusive)"];
  
  return {
    ...baseProduct,
    id: i + 1,
    name: `${baseProduct.name} ${suffixes[i % suffixes.length]}`,
    price: (parseFloat(baseProduct.price) * (0.9 + Math.random() * 0.2)).toFixed(2),
    rating: parseFloat((baseProduct.rating + (Math.random() * 0.4 - 0.2)).toFixed(1)), // ✅ تأكد أنه رقم
  };
});

function ProductsGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // ✅ تأكد من أن mockProducts موجودة وليست undefined
  if (!mockProducts || mockProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  // حساب المنتجات للصفحة الحالية
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = mockProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div className="w-full md:w-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Casual</h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, mockProducts.length)} of {mockProducts.length} premium products
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 md:gap-4 w-full md:w-auto">
          {/* View Toggle */}
          <div className="flex border rounded-lg overflow-hidden self-start">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-black text-white" : "bg-white text-gray-600"}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-black text-white" : "bg-white text-gray-600"}`}
            >
              <List size={18} />
            </button>
          </div>
          
          {/* Sort Dropdown */}
          <select className=" px-3 md:px-4 py-2 bg-white w-full xs:w-auto min-w-[180px] text-sm md:text-base">
            <option value="popularity">Sort by: Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="bestseller">Best Sellers</option>
          </select>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={viewMode === "grid" 
        ? "grid grid-cols-2 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        : "space-y-4 md:space-y-6"
      }>
        {currentProducts.map((product) => (
          viewMode === "grid" ? (
            <ProductCard key={product.id} product={product} />
          ) : (
            // List View
            <div key={product.id} className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6">
              <div className="w-full sm:w-32 h-32 md:h-40 bg-gray-200 rounded-lg shrink-0">
                <img
                  src={product.image || "https://via.placeholder.com/400x500"}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3E%F0%9F%9B%8D%3C/text%3E%3Ctext x='50%25' y='60%25' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle'%3EProduct Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {product.category || "General"}
                  </span>
                  {product.color && (
                    <span className="text-xs text-gray-500">{product.color}</span>
                  )}
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-2">{product.name || "Product"}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(product?.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{(product.rating || 0).toFixed(1)}/5</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl md:text-2xl font-bold">${product.price || "0.00"}</span>
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs md:text-sm self-start">
                    {product.category || "General"}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 text-sm md:text-base line-clamp-2">
                  Premium quality {(product.category || "product").toLowerCase()} with excellent comfort and style.
                </p>
                <div className="flex gap-2">
                  <Button className="bg-black hover:bg-gray-800 text-sm md:text-base">
                    <ShoppingCart size={16} className="mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart size={16} />
                  </Button>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Pagination */}
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={mockProducts.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}

export default ProductsGrid;