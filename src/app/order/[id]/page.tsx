"use client";
import { useEffect, useState } from "react";
import { fetchOrder } from "../../../../lib/order-service";
import { Order } from "@/app/types/order";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    fetchOrder(Number(orderId))
      .then(setOrder)
      .catch(() => setError("Misslyckades att hämta order"))
      .finally(() => setLoading(false));
  }, [orderId]);
  
  // Don't render anything during SSR
  if (!isClient) {
    return <div className="container mx-auto p-4">Laddar...</div>;
  }
  
  if (loading) return <p>Laddar order...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>Ingen order hittades.</p>;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      <p>Status: {order.order_status}</p>
      <p>Totalt pris: {order.total_price} SEK</p>
      <h2 className="text-xl font-bold mt-4">Produkter:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {order.order_items.map((item) => (
          <div key={item.product_id} className="border p-4 rounded-md">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/public/product-placeholder.jpg`}
              alt={item.product_name}
              width={100}
              height={100}
              className="rounded-md"
              unoptimized
            />
            <h3 className="font-semibold">{item.product_name}</h3>
            <p>Antal: {item.quantity}</p>
            <p>Pris: {item.unit_price} SEK</p>
          </div>
        ))}
      </div>
    </div>
  );
}
