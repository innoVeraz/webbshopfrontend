'use client';

import { useEffect, useState } from "react";
import { fetchProducts } from "../../../../lib/api";
import { Product } from "../../types/product";
import { ProductCard } from "../../components/product-card";
import { useRouter, useParams } from "next/navigation";

export default function CategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const params = useParams();
  const category = params.slug as string;

  // Mark as client-side rendered
  useEffect(() => {
    setIsClient(true);
    
    // Check authentication
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      
      // Fetch products only when authenticated
      fetchProducts()
        .then(allProducts => {
          const filteredProducts = allProducts.filter(
            (product: Product) => product.category.toLowerCase() === category.toLowerCase()
          );
          setProducts(filteredProducts);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [category, router]);

  const categoryTitles: { [key: string]: string } = {
    women: 'Women',
    men: 'Men',
    kids: 'Kids'
  };

  // Don't render anything during SSR
  if (!isClient) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          Laddar...
        </div>
      </div>
    );
  }

  // Show loading when authenticating or fetching products
  if (isAuthenticated === null || loading) {
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
      <h1 className="text-3xl font-bold mb-8">{categoryTitles[category] || category}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-fr">
        {products.map((product) => (
          <ProductCard key={product.id || Math.random()} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Inga produkter hittades i denna kategori.</p>
        </div>
      )}
    </main>
  );
}