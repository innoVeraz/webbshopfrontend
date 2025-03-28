"use client";

import { useEffect, useState } from "react";
import { Order } from "@/app/types/order";
import { fetchOrders, updateOrder, deleteOrder } from "../../../lib/order-service";

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, newStatus: string) => {
    await updateOrder(id, {
      payment_status: newStatus,
      order_status: "confirmed",
      payment_id: "manual",
    });
    loadOrders();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Vill du verkligen radera ordern?")) {
      await deleteOrder(id);
      loadOrders();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Adminpanel</h1>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">Inga ordrar hittades.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>ID</th>
                <th>Kund</th>
                <th>Status</th>
                <th>Total</th>
                <th>Datum</th>
                <th>Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <strong>{order.customer_firstname} {order.customer_lastname}</strong>
                    <br />
                    <span className="text-sm text-gray-500">{order.customer_email}</span>
                  </td>
                  <td>
                    <span className={`badge badge-outline badge-${order.payment_status === "paid" ? "success" : "warning"}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td>{order.total_price} SEK</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                  <button className="btn btn-success" onClick={() => handleUpdate(order.id!, "paid")}> Betald</button>
                  <button className="btn btn-error"  onClick={() => handleDelete(order.id!)}>Radera</button>
               
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
