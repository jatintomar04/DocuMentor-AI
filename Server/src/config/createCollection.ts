
import "dotenv/config";
import { QdrantClient } from "@qdrant/js-client-rest";

if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
  throw new Error("Qdrant credentials missing in .env");
}

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const createCollection = async () => {
  const collectionName = "resume-documents";

  // Check whether collection already exists
  const result = await client.getCollections();

  const exists = result.collections.some(
    (collection) => collection.name === collectionName
  );

  if (exists) {
    console.log("Qdrant collection already exists!");
    return;
  }

  // Create collection
  await client.createCollection(collectionName, {
    vectors: {
      size: 3072,
      distance: "Cosine",
    },
  });

  console.log("Qdrant collection created successfully!");
};

createCollection().catch(console.error);
