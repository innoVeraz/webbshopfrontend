'use client';

import { useEffect, useState } from "react";
import { fetchProducts } from "../../../../lib/api";
import { Product } from "../../types/product";
import { ProductCard } from "../../components/product-card";
import { useRouter } from "next/navigation";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const category = params.slug;

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      router.push('/login');
      return;
    }

    fetchProducts()
      .then(allProducts => {
        const filteredProducts = allProducts.filter(
          (product: Product) => product.category.toLowerCase() === category.toLowerCase()
        );
        setProducts(filteredProducts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, router]);

  const categoryTitles: { [key: string]: string } = {
    women: 'Women',
    men: 'Men',
    kids: 'Kids'
  };

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
      <h1 className="text-3xl font-bold mb-8">{categoryTitles[category] || category}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-fr">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
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