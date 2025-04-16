"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order } from '../types/order';
import { useCart } from '../context/cart-context';

// Create a separate component that uses useSearchParams
function ConfirmationContent() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    setIsClient(true);
    
    const fetchOrderDetails = async () => {
      try {
        // Get payment_id (session_id) from URL
        const session_id = searchParams.get('session_id');
        if (!session_id) {
          throw new Error('Ingen betalningsinformation hittades');
        }

        // Fetch order details using payment_id
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/payment/${session_id}`);
        if (!response.ok) {
          throw new Error('Kunde inte hämta orderinformation');
        }

        const orderData = await response.json();

        // Ta bort onödig uppdatering av order - webhook hanterar detta
        setOrder(orderData);

        // Clear cart and stored form data
        clearCart();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('checkoutForm');
          localStorage.removeItem('lastOrderId');
        }

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Något gick fel');
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchOrderDetails();
    }
  }, [searchParams, clearCart, isClient]);

  // Don't render anything during SSR
  if (!isClient) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Laddar...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p>Hämtar orderinformation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
          <p>{error || 'Kunde inte hitta ordern'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-success mb-2">Tack för din beställning!</h1>
          <p className="text-xl">Order #{order.id}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Leveransadress</h2>
            <div className="space-y-2">
              <p>{order.customer_firstname} {order.customer_lastname}</p>
              <p>{order.customer_street_address}</p>
              <p>{order.customer_postal_code} {order.customer_city}</p>
              <p>{order.customer_country}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Beställningsinformation</h2>
            <div className="space-y-2">
              <p>Orderdatum: {new Date(order.created_at).toLocaleDateString()}</p>
              <p>E-post: {order.customer_email}</p>
              <p>Telefon: {order.customer_phone}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Beställda produkter</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Antal</th>
                  <th>Pris</th>
                  <th>Totalt</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item) => (
                  <tr key={`${item.product_id}-${item.product_name}`}>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit_price} kr</td>
                    <td>{item.quantity * item.unit_price} kr</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-bold">Totalt:</td>
                  <td className="font-bold">{order.total_price} kr</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component that wraps the content in a Suspense boundary
export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-4 text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p>Hämtar orderinformation...</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}