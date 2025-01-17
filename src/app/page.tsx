// app/page.tsx
import { createClient } from "@sanity/client";

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

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <h1>Products</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <img src={product.imagePath} alt={product.name} width="200" />
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <p>Stock Level: {product.stockLevel}</p>
            <p>Featured: {product.isFeaturedProduct ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
