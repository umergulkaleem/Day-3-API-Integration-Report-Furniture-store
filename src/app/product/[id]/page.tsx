import { createClient } from "@sanity/client";
import { notFound } from "next/navigation";
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const query = `*[_type == 'productnew' && id == $id][0]`;
  const product: Product | null = await client.fetch(query, { id });

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-screen-lg mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800">
        {product.name}
      </h1>

      <div className="flex justify-center">
        <div className="relative w-80 h-80 md:w-96 md:h-96">
          <Image
            src={product.imagePath}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg text-gray-600 mt-4">{product.description}</p>
        <p className="text-xl font-bold text-gray-800 mt-2">
          Price: <span className="text-green-600">${product.price}</span>
        </p>
        <p className="text-sm text-gray-500">
          Discount: {product.discountPercentage}% Off
        </p>
        <p className="text-sm text-gray-500">
          Stock Level: {product.stockLevel}
        </p>
        <p className="text-sm text-gray-500">Category: {product.category}</p>
        <p className="text-sm text-gray-500">
          Featured: {product.isFeaturedProduct ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}
