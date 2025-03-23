"use client";

import { useState } from "react";
import { useCart } from "../context/cart-context";
import { useRouter } from "next/navigation";
import { createCustomer } from "../../../lib/api";
import { Order } from "../types/order";
import { createOrder } from "../../../lib/order-service";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  // 📝 Formulärdata för ny kund
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "default123", // Tillfälligt lösenord eftersom backend kräver det
    phone: "",
    street_address: "",
    postal_code: "",
    city: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📌 Hantera formulär-input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // 1️⃣ 🔥 Skapa kund i backend och hämta `customer_id`
      const customerResponse = await createCustomer(formData);
      const customer_id = customerResponse.id; // Få tillbaka customer_id
  
      // 2️⃣ Beräkna totalpris
      const total_price = cart.reduce((sum, item) => sum + item.quantity! * item.price, 0);

      console.log("Cart innan order skickas:", JSON.stringify(cart, null, 2));

      const orderItems = cart.map((item) => {
        if (item.id === undefined) {
          throw new Error("Product ID saknas");
        }
        return {
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity!,
          unit_price: item.price,
        };
      });

      // 3️⃣ Skapa orderdata med alla nödvändiga fält
      const orderData: Order = {
        id: 0, // Backend genererar ID
        customer_id: customer_id, // ✅ Använd kundens ID
        total_price: total_price, // ✅ Beräknat totalpris
        payment_status: "unpaid",
        payment_id: null,
        order_status: "pending",
        created_at: new Date().toISOString(), // Backend genererar också, men TypeScript kräver det
        order_items: orderItems, // ✅ Använd den beräknade ordern
      };
        console.log("Order skickas till backend:", JSON.stringify(orderData, null, 2));

 
        
      // 4️⃣ Skicka ordern till backend
      const orderResponse = await createOrder(orderData);
      console.log("Order Created:", orderResponse);
  
      // 🧹 Rensa varukorgen efter order
      clearCart();
      alert("Beställning genomförd!");
      router.push("/orders"); // 🔥 Skickas till ordersidan
    } catch (error) {
      console.error("Order failed:", error);
      setError("Misslyckades att skapa order");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kassa</h1>

      <form onSubmit={handleOrderSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="firstname" placeholder="Förnamn" onChange={handleChange} required />
          <input type="text" name="lastname" placeholder="Efternamn" onChange={handleChange} required />
          <input type="email" name="email" placeholder="E-post" onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Telefonnummer" onChange={handleChange} required />
          <input type="text" name="street_address" placeholder="Adress" onChange={handleChange} required />
          <input type="text" name="postal_code" placeholder="Postnummer" onChange={handleChange} required />
          <input type="text" name="city" placeholder="Stad" onChange={handleChange} required />
          <input type="text" name="country" placeholder="Land" onChange={handleChange} required />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Skickar order..." : "Slutför beställning"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
