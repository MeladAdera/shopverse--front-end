
// src/routes/producDatails.tsx
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ShoppingCart, Check, Minus, Plus, Loader2 } from "lucide-react";
import { useParams, useNavigate } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ReviewCard } from "../components/productdatails/ReviewCard";
import Galliry from "../components/ui/Galliry";
import Subscribe from "../components/ui/Subscribe";
import Footer from "../components/ui/Footer";
import { productService } from '@/services/product.service';
import type { Product } from '@/types/product';

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : null;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  
  const [selectedImage, setSelectedImage] = useState(0);
  // 🔧 **تغيير هنا: تخزين القيمة الفعلية بدلاً من index**
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [selectedSize, setSelectedSize] = useState<string>("Medium"); 
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'faq'>('details');
  
  // 🔧 **الـ 4 ألوان الأساسية**
  const baseColors = ["Black", "Blue", "Red", "Green"];
  
  // 🔧 **الـ 4 مقاسات الأساسية**
  const baseSizes = ["Small", "Medium", "Large", "X-Large"];
  
  const AlsoLikeProducts = [
    {
      name: "VERTICAL STRIPED SHIRT",
      category: "Men's Fashion",
      image: "/image copy 13.png",
      price: "34.99",
      originalPrice: "43.99",
      discount: "-20%",
      rating: 4.5,
      ratingStars: "★★★★★"
    },
    {
      name: "VERTICAL STRIPED SHIRT",
      category: "Men's Fashion",
      image: "/image copy 14.png",
      price: "34.99",
      originalPrice: "43.99",
      discount: "-20%",
      rating: 4.5,
      ratingStars: "★★★★★"
    },
    {
      name: "VERTICAL STRIPED SHIRT",
      category: "Men's Fashion",
      image: "/image copy 15.png",
      price: "34.99",
      originalPrice: "43.99",
      discount: "-20%",
      rating: 4.5,
      ratingStars: "★★★★★"
    },
    {
      name: "VERTICAL STRIPED SHIRT",
      category: "Men's Fashion",
      image: "/image copy 16.png",
      price: "34.99",
      originalPrice: "43.99",
      discount: "-20%",
      rating: 4.5,
      ratingStars: "★★★★★"
    },
  ];
  
  const AlsoLike = (
    <svg width="100%" height="36" viewBox="0 0 578 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M38.56 1.11997L24.8 24.28V34.72H13.72V24.24L0 1.11997H11.64L18.84 13.76H19.72L26.92 1.11997H38.56ZM54.8088 35.84C43.2487 35.84 35.7688 28.68 35.7688 17.92C35.7688 7.15997 43.2487 -3.05176e-05 54.8088 -3.05176e-05C66.3688 -3.05176e-05 73.8488 7.15997 73.8488 17.92C73.8488 28.68 66.3688 35.84 54.8088 35.84ZM54.8088 26.28C59.2087 26.28 62.8488 23.24 62.8488 17.92C62.8488 12.6 59.2087 9.55997 54.8088 9.55997C50.4088 9.55997 46.7688 12.6 46.7688 17.92C46.7688 23.24 50.4088 26.28 54.8088 26.28ZM93.4719 35.84C81.9119 35.84 76.0719 30.92 76.0719 20.08V1.11997H87.2319V19.8C87.2319 23.96 89.0719 26.56 93.4719 26.56C97.8719 26.56 99.7919 23.96 99.7919 19.8V1.11997H110.872V20C110.872 30.92 105.032 35.84 93.4719 35.84ZM124.072 34.72V1.11997H138.032L143.512 20.28H144.312L149.792 1.11997H163.752V34.72H153.192V19.84H152.312L148.032 34.72H139.792L135.512 19.84H134.632V34.72H124.072ZM166.541 34.72V1.11997H177.621V34.72H166.541ZM216.576 16.16V34.72H210.656L210.496 30.28C208.176 33.48 203.976 35.84 198.056 35.84C187.736 35.84 179.816 28.68 179.816 17.92C179.816 7.15997 187.336 -3.05176e-05 199.016 -3.05176e-05C206.976 -3.05176e-05 215.096 3.83997 216.416 12.88H205.416C204.736 11.2 202.536 9.55997 199.256 9.55997C194.296 9.55997 190.816 12.84 190.816 17.92C190.816 23 194.376 26.28 198.936 26.28C200.576 26.28 204.776 25.84 205.896 21.92H198.496V16.16H216.576ZM243.676 1.11997H254.756V34.72H243.676V22.56H230.636V34.72H219.556V1.11997H230.636V13.28H243.676V1.11997ZM292.612 1.11997V10.36H280.532V34.72H269.452V10.36H257.372V1.11997H292.612ZM333.219 34.72L331.739 30.28H317.339L315.859 34.72H304.419L316.779 1.11997H332.299L344.659 34.72H333.219ZM320.059 22.08H329.019L325.499 11.52H323.579L320.059 22.08ZM346.259 34.72V1.11997H357.339V25.48H375.259V34.72H346.259ZM394.041 35.84C382.441 35.8 376.961 32.2 377.241 23.48H387.201C387.321 25.76 389.241 27.16 394.041 27.2C398.281 27.24 400.241 26.04 400.241 24.48C400.241 23.4 399.641 22.28 396.361 21.8L392.041 21.12C385.681 20.08 378.041 19.32 378.041 10.72C378.041 4.07997 383.441 -3.05176e-05 394.121 -3.05176e-05C403.761 -3.05176e-05 410.481 2.67997 410.281 12.28H400.401C400.001 10.04 398.121 8.63997 393.881 8.63997C390.201 8.63997 388.681 9.75997 388.681 11.28C388.681 12.24 389.281 13.4 391.841 13.8L395.401 14.4C402.081 15.52 411.241 15.72 411.241 24.92C411.241 32.24 405.561 35.88 394.041 35.84ZM431.778 35.84C420.217 35.84 412.738 28.68 412.738 17.92C412.738 7.15997 420.217 -3.05176e-05 431.778 -3.05176e-05C443.338 -3.05176e-05 450.818 7.15997 450.818 17.92C450.818 28.68 443.338 35.84 431.778 35.84ZM431.778 26.28C436.177 26.28 439.818 23.24 439.818 17.92C439.818 12.6 436.177 9.55997 431.778 9.55997C427.378 9.55997 423.738 12.6 423.738 17.92C423.738 23.24 427.378 26.28 431.778 26.28ZM463.447 34.72V1.11997H474.527V25.48H492.447V34.72H463.447ZM495.228 34.72V1.11997H506.308V34.72H495.228ZM545.743 34.72H534.423L525.463 22.76H524.743L520.143 27.68V34.72H509.103V1.11997H520.143V14.44H520.863L532.983 1.11997H545.303L531.663 16.08L545.743 34.72ZM546.744 34.72V1.11997H577.024V9.99997H557.824V14.28H576.304V21.56H557.824V25.84H577.024V34.72H546.744Z" fill="black"/>
</svg>
  );

   // جلب بيانات المنتج
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        setError('Product ID is missing');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const productData = await productService.getProductById(productId);
        setProduct(productData);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId]);

  // وظيفة لبناء رابط الصورة
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '/placeholder.jpg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    return imagePath;
  };

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-black mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Loading Product</h3>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Product not available'}</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-black text-white hover:bg-gray-800"
          >
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-8 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="/" 
                className="text-gray-500 hover:text-black"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="/shop" 
                className="text-gray-500 hover:text-black"
              >
                Shop
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                href={`/category/${product.category_id}`}
                className="text-gray-500 hover:text-black"
              >
                {product.category_name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-black">{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product Main Section */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          
          {/* Left Column - Product Gallery */}
          <div className=" " >
 <div className="flex flex-col lg:flex-row gap-4 md:gap-6 justify-center items-center h-full  ">
    
    {/* Left Column - Thumbnail Images */}
    <div className="flex lg:flex-col order-2 lg:order-1 gap-3 lg:gap-4 w-full lg:w-1/4 h-full lg:h-full ">
      {product.image_urls.slice(0, 3).map((img, index) => (
        <button
          key={index}
          onClick={() => setSelectedImage(index)}
          className={`relative overflow-hidden rounded-lg  transition-all w-full h-full ${
            selectedImage === index 
              ? "border-black" 
              : " hover:border-gray-400"
          }`}
        >
          <img 
            src={getImageUrl(img)} 
            alt={`Product view ${index + 1}`}
            className="object-cover aspect-square lg:aspect-auto"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.jpg';
            }}
          />
        </button>
      ))}
    </div>

              {/* Right Column - Main Image */}
               <div className="order-1 lg:order-2 lg:w-3/4 h-full lg:h-full">
      <div className="relative h-full overflow-hidden rounded-xl bg-gray-100 aspect-square lg:aspect-auto ">
        <img 
          src={getImageUrl(product.image_urls[selectedImage])} 
          alt={product.name}
          className="h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg';
          }}
        />
                </div>
              </div>

            </div>
          </div>

{/* Right Column - Product Details */}
<div className="space-y-3 md:space-y-4"> {/* Add vertical spacing between sections */}
  
  {/* Product Title */}
  <div className="pb-4 md:pb-6 border-b border-gray-200">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
      {product.name}
    </h1>
    
    {/* Rating */}
    <div className="flex items-center gap-2 mt-2">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(product.average_rating || 0) 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-gray-600">
        {(product.average_rating || 0).toFixed(1)}/5
        {product.review_count > 0 && ` (${product.review_count} reviews)`}
      </span>
    </div>
  </div>

  {/* Price */}
  <div className="pb-4 md:pb-6 border-b border-gray-200">
    <div className="flex items-center gap-3">
      <span className="text-3xl md:text-4xl font-bold text-gray-900">
        ${product.price.toFixed(2)}
      </span>
      {product.price < 1000 && (
        <>
          <span className="text-xl text-gray-500 line-through">
            ${(product.price * 1.2).toFixed(2)}
          </span>
          <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-bold">
            Save ${(product.price * 0.2).toFixed(2)}
          </span>
        </>
      )}
    </div>
  </div>

  {/* Description */}
  <div className="pb-6 md:pb-8 border-b border-gray-200">
    <p className="text-gray-600 leading-relaxed">
      {product.description}
    </p>
  </div>

  {/* 🔧 **Color Selection - المعدلة** */}
  <div className="pb-6 md:pb-8 border-b border-gray-200">
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Select Colors</h3>
      <div className="flex gap-3">
        {baseColors.map((color) => {
          const colorCodes: { [key: string]: string } = {
            "Black": "#000000",
            "Blue": "#3B82F6",
            "Red": "#EF4444",
            "Green": "#10B981"
          };

          return (
            <button
              key={color}
              onClick={() => setSelectedColor(color)} // ✅ اختيار اللون بالاسم
              className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                selectedColor === color 
                  ? "border-black" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: colorCodes[color] || "#ccc" }}
            >
              {selectedColor === color && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="sr-only">{color}</span>
            </button>
          );
        })}
      </div>
    </div>
  </div>

  {/* 🔧 **Size Selection - المعدلة** */}
  <div className="pb-6 md:pb-8 border-b border-gray-200">
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Choose Size</h3>
      <div className="flex gap-5">
        {baseSizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)} // ✅ اختيار المقاس بالاسم
            className={`px-2 py-2 rounded-full border-2 font-medium transition-all ${
              selectedSize === size
                ? "bg-black text-white border-black"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Buttons */}
  <div className="pt-2">
    <div className="flex flex-row sm:flex-row gap-3 sm:gap-4">
      
      {/* Quantity Button */}
      <Button 
        variant="outline" 
        className="rounded-full border-2 flex items-center justify-between 
                  py-3 sm:py-4 px-4 sm:px-6 
                  h-11 sm:h-12
                  w-full sm:w-auto sm:flex-1"
      >
        <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-base sm:text-lg font-medium">1</span>
        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      {/* Add to Cart Button */}
      <Button 
        className="bg-black text-white hover:bg-gray-800 
                  h-11 sm:h-12 
                  text-base sm:text-lg 
                  rounded-full 
                  w-full sm:w-auto sm:flex-2
                  flex items-center justify-center gap-2"
        onClick={() => {
          console.log('🛒 Adding to cart:', {
            productId: product.id,
            name: product.name,
            color: selectedColor,
            size: selectedSize,
            quantity: 1
          });
          alert(`Added to cart!\nColor: ${selectedColor}\nSize: ${selectedSize}`);
        }}
      >
        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
        Add to Cart
      </Button>

    </div>
  </div>
  

</div>
</div>
{/* Tabs Navigation - Responsive */}
<div className="container mx-auto">
  <div className="flex py-10">
    {['details', 'reviews', 'faq'].map((tab, index) => (
      <button
        key={tab}
        className={`
          flex-1 py-3 sm:py-4 text-center font-medium transition-all relative 
          ${index > 0 ? 'border-l border-gray-200' : ''}
          ${activeTab === tab
            ? 'text-black'
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
        onClick={() => setActiveTab(tab as any)}
      >
        <div className="inline-flex items-center justify-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm md:text-base truncate px-1">
            {tab === 'details' && (
              <>
                <span className="hidden sm:inline">Product Details</span>
                <span className="sm:hidden">Details</span>
              </>
            )}
            {tab === 'reviews' && (
              <>
                <span className="hidden sm:inline">Rating & Reviews</span>
                <span className="sm:hidden">Reviews</span>
              </>
            )}
            {tab === 'faq' && 'FAQS'}
          </span>
          
          {tab === 'reviews' && (
            <span className={`
              text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full shrink-0
              ${activeTab === 'reviews'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-600'
              }
            `}>
              {product.review_count || 0}
            </span>
          )}
        </div>
        
        {/* خط تحت التبويب النشط */}
        <div className={`
          absolute bottom-0 left-2 right-2 sm:left-0 sm:right-0 h-0.5 transition-all
          ${activeTab === tab ? 'bg-black' : 'bg-transparent'}
        `}></div>
      </button>
    ))}
  </div>
  
  {/* Reviews Grid */}
  <ReviewCard 
  productId={productId ?? undefined} 
  showAll={true} 
/>

  
  {/* Learn More Reviews Button - بسيط */}
 {product.review_count > 1 && (
  <div className="text-center mt-8">
    <button 
      onClick={() => navigate(`/product/${productId}/reviews`)}
      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors"
    >
      View All Reviews ({product.review_count})
    </button>
  </div>
)}

</div>

{/* Also Like Products */}
<Galliry  titleSvg={AlsoLike}
      products={AlsoLikeProducts}/>
      </div>
      
      {/* Subscribe */}
      <Subscribe/>
      
      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default ProductPage;