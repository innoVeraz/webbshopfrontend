'use client';

import { useEffect, useState } from "react";
import { fetchProducts } from "../../../lib/api";
import { Product } from "../types/product";
import { ProductCard } from "../components/product-card";
import { useRouter } from "next/navigation";
import { SearchBar } from "../components/search-bar";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      router.push('/login');
      return;
    }

    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  // Filtrera och sortera produkter
  const filteredProducts = products
    .filter(product => !selectedCategory || product.category === selectedCategory)
    .sort((a, b) => {
      if (sortOrder === 'price-low') return a.price - b.price;
      if (sortOrder === 'price-high') return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          Laddar...
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
      <SearchBar />
        <div className="flex space-x-4">
       
          <select 
            className="select select-bordered w-full max-w-xs"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Price</option>
            <option value="price-low">Low to High</option>
            <option value="price-high">High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}