
import "dotenv/config";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

import { loadPdf } from "./loadfile.js";

export const embedPDF = async (
  publicId: string,
  documentId: string
): Promise<void> => {
  // Check environment variables
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing");
  }

  if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
    throw new Error("Qdrant credentials are missing");
  }

  if (!documentId.trim()) {
    throw new Error("documentId is required");
  }

  // 1. Download PDF and extract text
  const text = await loadPdf(publicId);

  // 2. Clean extracted text
  const cleanText = text
    .replace(/--\s*\d+\s+of\s+\d+\s*--/g, "")
    .trim();

  if (!cleanText) {
    throw new Error("No text available for embedding");
  }

  // 3. Split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const chunks = await splitter.createDocuments(
    [cleanText],
    [
      {
        source: publicId,
        documentId: documentId.trim(),
      },
    ]
  );

  console.log("Total chunks:", chunks.length);
  console.log("Indexing document:", documentId);

  // 4. Initialize Gemini embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  // 5. Connect to Qdrant Cloud
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: "resume-documents",
    }
  );

  // 6. Store PDF chunks and metadata
  await vectorStore.addDocuments(chunks);

  console.log("PDF chunks and embeddings stored successfully in Qdrant!");
};
