"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order } from '../types/order';
import { useCart } from '../context/cart-context';
import { updateOrder } from '../../../lib/order-service';

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const session_id = searchParams.get('session_id');
        const order_id = searchParams.get('order_id');
        const lastOrderId = order_id || localStorage.getItem('lastOrderId');

        if (!session_id || !lastOrderId) {
          throw new Error('Orderinformation saknas. Kontrollera din orderhistorik eller kontakta kundtjänst.');
        }

        try {
          await updateOrder(parseInt(lastOrderId), {
            payment_status: "paid",
            payment_id: session_id,
            order_status: "received"
          });
        } catch (updateError) {
          console.error('Kunde inte uppdatera orderstatusen:', updateError);

        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${lastOrderId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Ordern kunde inte hittas. Kontrollera din orderhistorik eller kontakta kundtjänst.');
          }
          throw new Error('Ett fel uppstod när orderinformationen skulle hämtas. Vänligen försök igen.');
        }

        const orderData = await response.json();
        if (!orderData) {
          throw new Error('Ingen orderinformation hittades.');
        }

        setOrder(orderData);
        clearCart();
        localStorage.removeItem('checkoutForm');
        localStorage.removeItem('lastOrderId');

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ett oväntat fel uppstod. Vänligen kontakta kundtjänst.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, clearCart]);

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
                  <tr key={item.product_id}>
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