'use client';

import { Product } from "../types/product";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "../context/cart-context";

export const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();
  return (
    <Card className="w-full max-w-sm border">
      <CardHeader>
        <h3 className="text-lg font-bold">{product.name}</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/public${product.image}`}
          alt={product.name}
          width={300}
          height={200}
          className="rounded-md"
        />
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="font-bold">{product.price} SEK</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => addToCart(product)}> Lägg i varukorg </Button>
      </CardFooter>
    </Card>
  );
};
