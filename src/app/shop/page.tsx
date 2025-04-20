'use client';

import { useEffect, useState } from "react";
import { fetchProducts } from "../../../lib/api";
import { Product } from "../types/product";
import { ProductCard } from "../components/product-card";
import { useRouter } from "next/navigation";
import { SearchBar } from "../components/search-bar";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
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
        <h1 className="text-3xl font-bold">Shop</h1>
        <div className="flex space-x-4">
          <SearchBar />
          {/* <select 
            className="select select-bordered w-full max-w-xs"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Alla kategorier</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
          </select> */}
          <select 
            className="select select-bordered w-full max-w-xs"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Senaste</option>
            <option value="price-low">Pris: Lågt till högt</option>
            <option value="price-high">Pris: Högt till lågt</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}