"use client";
import React from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";

const CheckoutPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center mb-6">Checkout</h1>

      {cart.length > 0 ? (
        <ul className="divide-y divide-gray-300">
          {cart.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center gap-4 p-2">
              <Image
                src={product.imagePath}
                alt="product image"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div className="flex-grow">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-xs text-gray-500">{product.description}</p>
                <p className="text-sm">Quantity: {quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  +
                </button>
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CheckoutPage;
