import client from "../../scripts/importSanityData.mjs";

export default async function handler(req, res) {
  try {
    const products = await client.fetch(`*[_type == 'product']`);
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch products", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
