"use client";

import { useCart } from "../context/cart-context";
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
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => updateQuantity(product.id!, Math.max(1, (product.quantity ?? 1) - 1))}
                  >
                    -
                  </button>
                  <span className="mx-2">{product.quantity}</span>
                  <button
                    className="btn btn-sm"
                    onClick={() => updateQuantity(product.id!, product.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button className="btn btn-error" onClick={clearCart}>
              Töm varukorg
            </button>
            <div>
              <p className="text-xl font-bold">Totalt: {totalPrice} SEK</p>
              <Link href="/checkout" className="btn btn-primary mt-2">
                Gå till kassan
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
