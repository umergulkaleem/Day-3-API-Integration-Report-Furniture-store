"use client";
import React, { useState } from "react";
import { createClient } from "@sanity/client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  name: string;
  imagePath: string;
  price: number;
  description: string;
  discountPercentage: number;
  isFeaturedProduct: boolean;
  stockLevel: number;
  category: string;
};

// type CartItem = {
//   product: Product;
//   quantity: number;
// };

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: "2021-08-31",
  token: process.env.SANITY_API_TOKEN,
});

async function getProducts() {
  const query = `*[_type == 'productnew']`;
  const products: Product[] = await client.fetch(query);
  return products;
}

export default function ProductListing() {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  React.useEffect(() => {
    async function fetchProducts() {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1
        data-testid="cypress-title"
        className="text-4xl font-semibold text-center mb-6"
      >
        Our Products
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category List */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <ul className="grid grid-cols-1 gap-2">
            {[...new Set(products.map((product) => product.category))].map(
              (category) => (
                <li
                  key={category}
                  className="border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  <Link
                    href={`/category/${category}`}
                    className="block p-4 text-center text-gray-900 hover:text-yellow-500"
                  >
                    {category}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Cart Section */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Cart</h2>
          {cart.length > 0 ? (
            <ul className="divide-y divide-gray-300">
              {cart.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-4 p-2">
                  <Image
                    loading="lazy"
                    src={product.imagePath}
                    alt="product image"
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.description}
                    </p>
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
                  <Link href="/checkout">
                    <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      Proceed to Checkout
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        {/* Search Input */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-3 w-2/3 md:w-1/2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Display Filtered Products */}
        {filteredProducts.length > 0 ? (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between"
              >
                <Link
                  href={`/product/${product.id}`}
                  className="block flex-grow p-4"
                >
                  <div className="relative w-full h-56 mb-4">
                    <Image
                      loading="lazy"
                      src={product.imagePath}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-900 truncate">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-semibold text-gray-800">
                      ${product.price}
                    </p>
                    <span
                      className={`text-sm font-semibold ${
                        product.isFeaturedProduct
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {product.isFeaturedProduct ? "Featured" : "Regular"}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2 bg-blue-500 text-white rounded-b-lg hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            No products found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
