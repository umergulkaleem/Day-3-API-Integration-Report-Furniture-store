"use client";
import React, { useState } from "react";
import { createClient } from "@sanity/client";
import Link from "next/link";
import Image from "next/image"; // Import the Image component

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
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products on component mount
  React.useEffect(() => {
    async function fetchProducts() {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    }
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center mb-6">Our Products</h1>

      {/* Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update query on input change
          className="border border-gray-300 p-3 w-2/3 md:w-1/2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...new Set(products.map((product) => product.category))].map(
            (category) => (
              <li
                key={category}
                className="border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
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

      {/* Display filtered products */}
      {filteredProducts.length > 0 ? (
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
            >
              <Link href={`/product/${product.id}`} className="block p-4">
                <div className="relative w-full h-56 mb-4">
                  <Image
                    src={product.imagePath}
                    alt={product.name}
                    layout="fill" // Use layout fill to make the image fill the container
                    objectFit="contain" // Make sure the image is properly scaled
                    className="rounded-lg"
                  />
                </div>

                {/* Text and Description */}
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">
          No products found matching your search.
        </p>
      )}
    </div>
  );
}
