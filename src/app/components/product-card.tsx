'use client';

import { Product } from "../types/product";
import Image from "next/image";
import { useCart } from "../context/cart-context";
import { useState } from "react";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Check if this is a search result
  const isSearchResult = 'isSearchResult' in product && product.isSearchResult;
  
  // Determine the image source to use
  const imageSource = isSearchResult && product.imageUrl && !imageError 
    ? product.imageUrl 
    : `${process.env.NEXT_PUBLIC_API_URL}/public/${product.image}`;
  
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up to parent
    if (isSearchResult && product.link) {
      window.open(product.link, '_blank');
    }
  };
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up to parent
    addToCart(product);
  };
  
  const handleImageError = () => {
    if (isSearchResult && product.imageUrl) {
      setImageError(true);
    }
  };
  const externalPriceDisplay = product.externalPrice 
    ? `${product.externalPrice.value} ${product.externalPrice.currency}`
    : null;
  
  return (
    <div 
      className={`card bg-base-100 shadow-sm h-full transition-all duration-200 ${isHovered ? 'scale-[1.02]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="">
        <div 
          className={`w-full h-[180px] relative ${isSearchResult ? 'cursor-pointer' : ''}`}
          onClick={handleImageClick}
        >
          {isSearchResult && product.imageUrl && !imageError ? (
            <Image
              src={imageSource}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="pb-2 object-cover"
              onError={handleImageError}
              unoptimized={isSearchResult} 
            />
          ) : (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/public/${product.image}`}
              alt={product.name}
              fill
              className="pb-2 object-cover"
            />
          )}
          {isSearchResult && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              Från Axel Arigato
            </div>
          )}
        </div>
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-base">
          {product.name}
        </h2>
        <p className="text-sm line-clamp-2">{product.description}</p>
        <p className="text-lg font-bold">
          {isSearchResult 
            ? externalPriceDisplay || 'Pris: Se butik'
            : `${product.price} SEK`
          }
        </p>
        <div className="card-actions justify-end mt-auto pt-2">
          <button 
            className="btn btn-primary w-full"
            onClick={handleButtonClick}
          >
            Lägg i varukorg
          </button>
        </div>
      </div>
    </div>
  );
};
