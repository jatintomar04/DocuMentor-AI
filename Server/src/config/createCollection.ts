import "dotenv/config";
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
});

const setupCollection = async () => {
  const collectionName = "resume-documents";

  const collections = await client.getCollections();

  const exists = collections.collections.some(
    (collection) => collection.name === collectionName
  );

  if (!exists) {
    await client.createCollection(collectionName, {
      vectors: {
        size: 3072,
        distance: "Cosine",
      },
    });

    console.log("Collection created");
  }

  await client.createPayloadIndex(collectionName, {
    field_name: "metadata.documentId",
    field_schema: "keyword",
  });

  console.log("Payload index created successfully!");
};

setupCollection().catch(console.error);
export { client as qdrantClient };