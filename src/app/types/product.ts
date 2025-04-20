export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  imageUrl?: string; // External image URL from search results
  link?: string; // External link for search results
  displayLink?: string; // Domain name for search results
  isSearchResult?: boolean; // Flag to identify search results
  externalPrice?: {
    value: number;
    currency: string;
  }; // Price info from search results
  productId?: string; // External product ID
};
