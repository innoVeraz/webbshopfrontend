"use client";

import { useState } from "react";
import { useCart } from "../context/cart-context";
import { createCustomer, getCustomerByEmail } from "../../../lib/api";
import { Order } from "../types/order";
import { createOrder } from "../../../lib/order-service";
import { createStripeCheckoutSession } from "../../../lib/stripe-service";
import Image from "next/image";


export default function Checkout() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "default123",
    phone: "",
    street_address: "",
    postal_code: "",
    city: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      localStorage.setItem('checkoutForm', JSON.stringify(newData));
      return newData;
    });
  };

  useState(() => {
    const savedForm = localStorage.getItem('checkoutForm');
    if (savedForm) {
      setFormData(JSON.parse(savedForm));
    }
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (cart.length === 0) {
      setError("Din varukorg är tom");
      setLoading(false);
      return;
    }

    try {
      // Kontrollera om kunden redan finns
      let customer_id;
      const existingCustomer = await getCustomerByEmail(formData.email);
      
      if (existingCustomer) {
        customer_id = existingCustomer.id;
      } else {
        // Skapa ny kund om den inte finns
        const customerResponse = await createCustomer(formData);
        customer_id = customerResponse.id;
      }

      const orderItems = cart.map((item) => {
        if (!item.id) {
          throw new Error(`Product ID is missing for item: ${item.name}`);
        }
        return {
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        };
      });

      const orderData: Order = {
        id: 0,
        customer_id: customer_id,
        total_price: totalPrice,
        payment_status: "unpaid",
        payment_id: null,
        order_status: "pending",
        created_at: new Date().toISOString(),
        order_items: orderItems,
      };

      const orderResponse = await createOrder(orderData);
      console.log('Order created:', orderResponse);
      

      const stripeItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price, 
      }));

      console.log('Creating Stripe session for order:', orderResponse.id);
      const { url: checkoutUrl } = await createStripeCheckoutSession({
        orderId: orderResponse.id,
        items: stripeItems,
      });

      localStorage.setItem('lastOrderId', orderResponse.id.toString());
      console.log('Redirecting to Stripe:', checkoutUrl);
      window.location.href = checkoutUrl;
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Order failed:", error);
        setError(error.message || "Något gick fel vid skapande av order");
      } else {
        console.error("Order failed:", error);
        setError("Ett okänt fel inträffade");
      }
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Kassa</h1>
        <p className="text-gray-600">Din varukorg är tom.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Kassa</h1>
      <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Din varukorg</h2>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
              {item.image && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/public${item.image}`}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md"
                  unoptimized
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.price} kr</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="btn btn-circle btn-sm"
                  onClick={() => updateQuantity(item.id!, Math.max(1, item.quantity - 1))}
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button 
                  className="btn btn-circle btn-sm"
                  onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                >
                  +
                </button>
                <button 
                  className="btn btn-error btn-sm ml-2"
                  onClick={() => removeFromCart(item.id!)}
                >
                  Ta bort
                </button>
              </div>
            </div>
          ))}
          <div className="text-right text-xl font-bold pt-4 border-t">
            Totalt: {totalPrice} kr
          </div>
        </div>
      </div>
      <form onSubmit={handleOrderSubmit} className="space-y-6">
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Dina uppgifter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="firstname" 
              value={formData.firstname}
              placeholder="Förnamn" 
              onChange={handleChange} 
              className="input input-bordered w-full" 
              required 
            />
            <input 
              type="text" 
              name="lastname" 
              value={formData.lastname}
              placeholder="Efternamn" 
              onChange={handleChange} 
              className="input input-bordered w-full" 
              required 
            />
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              placeholder="E-post" 
              onChange={handleChange} 
              className="input input-bordered w-full" 
              required 
            />
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone}
              placeholder="Telefonnummer" 
              onChange={handleChange} 
              className="input input-bordered w-full" 
              required 
            />
            <input 
              type="text" 
              name="street_address" 
              value={formData.street_address}
              placeholder="Gatuadress" 
              onChange={handleChange} 
              className="input input-bordered w-full" 
              required 
            />
            <input 
              type="text" 
              name="postal_code" 
              value={formData.postal_code}
              placeholder="Postnummer" 
              onChange={handleChange} 
              className="input input-bordered w-full" 
              required 
            />
            <input 
              type="text" 
              name="city" 
              value={formData.city}
              placeholder="Stad" 
              onChange={handleChange} 
              className="input input-bordered w-full" 
              required 
            />
            <input 
              type="text" 
              name="country" 
              value={formData.country}
              placeholder="Land" 
              onChange={handleChange} 
              className="input input-bordered w-full" 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full text-lg py-3"
          disabled={loading}
        >
          {loading ? "Bearbetar..." : "Gå till betalning"}
        </button>

        {error && (
          <div className="bg-error text-error-content p-4 rounded-lg">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
