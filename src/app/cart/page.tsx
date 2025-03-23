"use client";

import { useCart } from "../context/cart-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, clearCart, updateQuantity } = useCart();


  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Varukorg</h1>

      {cart.length === 0 ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((product) => (
              <div key={product.id} className="border p-4 rounded-md flex items-center gap-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/public${product.image}`}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-md"
                  unoptimized
                />
                <div className="flex-1">
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="text-gray-600">{product.price} SEK</p>
                  <div className="flex items-center mt-2">
                    <Button variant="outline" onClick={() => updateQuantity(product.id!, product.quantity - 1)}>
                      -
                    </Button>
                    <span className="mx-2">{product.quantity}</span>
                    <Button variant="outline" onClick={() => updateQuantity(product.id!, product.quantity + 1)}>
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <p className="text-xl font-bold">Total: {totalPrice} SEK</p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={clearCart}>
                Töm varukorg
              </Button>
              <Link href="/checkout">
                <Button>Gå till kassan</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
