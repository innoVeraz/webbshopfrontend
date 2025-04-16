'use client';

import { Product } from "../types/product";
import Image from "next/image";
import { useCart } from "../context/cart-context";

export const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();
  return (
    <div className="card bg-base-100 shadow-sm h-full">
      <figure className="">
        <div className="w-full h-[180px] sm:h-[300px] relative">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/public/${product.image}`}
            alt={product.name}
            fill
            className=" pb-2"
            unoptimized
          />
        </div>
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-base">{product.name}</h2>
        <p className="text-sm line-clamp-2">{product.description}</p>
        <p className="text-lg font-bold">{product.price} SEK</p>
        <div className="card-actions justify-end mt-auto pt-2">
          <button className="btn btn-primary w-full" onClick={() => addToCart(product)}>Lägg i varukorg</button>
        </div>
      </div>
    </div>
  );
};
