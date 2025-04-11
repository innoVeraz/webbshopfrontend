import { Order } from "@/app/types/order";  
  
export async function createOrder(order: Order) {
  const formattedOrder = {
    customer_id: order.customer_id, 
    payment_status: order.payment_status,
    payment_id: order.payment_id,
    order_status: order.order_status,
    order_items: order.order_items.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedOrder),
  });

  if (!response.ok) {
    throw new Error("Misslyckades att skapa order");
  }

  return response.json();
}

export const fetchOrders = async (): Promise<Order[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export const fetchOrder = async (orderId: number): Promise<Order> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  
  return response.json();
};

export const updateOrder = async (orderId: number, updates: Partial<Order>) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update order');
  }

  return response.json();
};

export const deleteOrder = async (id: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete order");
};
