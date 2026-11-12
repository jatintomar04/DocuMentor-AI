
import "dotenv/config";
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
});

const setupCollection = async () => {
  const collectionName = "resume-documents";

  const result = await client.getCollections();

  const exists = result.collections.some(
    (collection) => collection.name === collectionName
  );

  if (!exists) {
    await client.createCollection(collectionName, {
      vectors: {
        size: 3072,
        distance: "Cosine",
      },
    });

    console.log("Collection created!");
  }

  // Create payload index for documentId
  await client.createPayloadIndex(collectionName, {
    field_name: "documentId",
    field_schema: "keyword",
  });

  console.log("documentId payload index created!");
};

setupCollection().catch(console.error);
