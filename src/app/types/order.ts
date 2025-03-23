

export type OrderItem = {
  id?: number; 
  order_id?: number; 
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
};
  
export type Order = {
  id: number | null;
  customer_id: number;  
  total_price?: number;
  payment_status: string;
  payment_id: string | null;
  order_status: string;
  created_at: string;
  order_items: {
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
  }[];

  // 👇 Dessa behövs för adminvyn
  customer_firstname?: string;
  customer_lastname?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_street_address?: string;
  customer_postal_code?: string;
  customer_city?: string;
  customer_country?: string;
};
  
  