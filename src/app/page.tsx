'use client';

import { useEffect, useState } from "react";
import { fetchProducts } from "../../lib/api";
import { Product } from "./types/product";
import { ProductCard } from "./components/product-card";



export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <main className="">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-24">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

