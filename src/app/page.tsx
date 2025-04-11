'use client';

import { useEffect, useState } from "react";
import { fetchProducts } from "../../lib/api";
import { Product } from "./types/product";
import { ProductCard } from "./components/product-card";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    setIsLoggedIn(!!userToken);

    if (userToken) {
      fetchProducts()
        .then(setProducts)
        .catch(console.error);
    }
  }, []);

  // Filtrera och sortera produkter
  const filteredProducts = products
    .filter(product => !selectedCategory || product.category === selectedCategory)
    .sort((a, b) => {
      if (sortOrder === 'price-low') return a.price - b.price;
      if (sortOrder === 'price-high') return b.price - a.price;
      return 0;
    });

  return (
    <main className="min-h-screen">
      {!isLoggedIn && (
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="container mx-auto px-6 py-20 relative">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Välkommen till MyShop
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  Upptäck vårt breda sortiment av kvalitetsprodukter för alla tillfällen
                </p>
                <div className="space-x-4">
                  <Link 
                    href="/login" 
                    className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200"
                  >
                    Logga in
                  </Link>
                  <Link 
                    href="/register" 
                    className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
                  >
                    Skapa konto
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {isLoggedIn && (
        <section className="container mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Våra produkter</h2>
            <div className="flex space-x-4">
              <select 
                className="select select-bordered w-full max-w-xs"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Alla kategorier</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kids">Kids</option>
              </select>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}