import { Customer } from "@/app/types/customer";

export const fetchProducts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    return res.json();
  };

  export async function createCustomer(customerData: Customer) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
  
    if (!response.ok) {
      throw new Error("Misslyckades att skapa kund");
    }
  
    return response.json(); 
  }

  export async function createProduct(formData: FormData) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Misslyckades att skapa produkt");
    }
  
    return response.json();
  }

  export async function getCustomerByEmail(email: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/email/${email}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error("Kunde inte söka efter kund");
    }
    return response.json();
  }



