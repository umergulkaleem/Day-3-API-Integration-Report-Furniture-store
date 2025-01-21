import React from "react";
import { createClient } from "@sanity/client";
import Link from "next/link";
import Image from "next/image";

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

async function getProductsByCategory(category: string) {
  const query = `*[_type == 'productnew' && category == $category]`;
  const products: Product[] = await client.fetch(query, { category });
  return products;
}

interface CategoryPageProps {
  params: { category: string }; // Explicitly defining params
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;

  let products: Product[] = [];

  try {
    products = await getProductsByCategory(category);
  } catch (error) {
    console.error("Error fetching products:", error);
    return <div>Error fetching products. Please try again later.</div>;
  }

  if (products.length === 0) {
    return <div>No products found in this category.</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center mb-6">
        {category} Products
      </h1>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li
            key={product.id}
            className="border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            <Link href={`/product/${product.id}`} className="block p-4">
              <div className="relative w-full h-56 mb-4">
                <Image
                  src={product.imagePath}
                  alt={product.name}
                  width={300}
                  height={100}
                  className="w-full h-full object-contain rounded-lg"
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
          </li>
        ))}
      </ul>
    </div>
  );
}
