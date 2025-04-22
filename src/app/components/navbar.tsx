"use client";

import Link from "next/link";
import { useCart } from "../context/cart-context";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="navbar bg-base-200 shadow-md px-6 flex justify-between">
          <div>
          <Link href="/" className="btn btn-ghost normal-case text-xl">MyShop</Link>
          <details>
                <summary>Categories</summary>
                <ul className="p-2">
                  <li><Link href="/category/women">Women</Link></li>
                  <li><Link href="/category/men">Men</Link></li>
                  <li><Link href="/category/kids">Kids</Link></li>
                </ul>
              </details>
              </div>
      <div className="navbar-start">

        <div className="dropdown md:hidden">
          <label tabIndex={0} className="">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="flex menu menu-sm dropdown-content mt-3 z-[10] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/admin">Admin</Link></li>
          </ul>
        </div>

      </div>
      <div className="navbar-end">
        <Link href="/cart" className="btn btn-ghost btn-circle">
          <div className="indicator flex space-between">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="badge badge-sm indicator-item">{totalItems}</span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
