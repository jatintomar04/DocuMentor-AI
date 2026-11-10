
import "dotenv/config";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

import { loadPdf } from "./loadfile.js";

export const embedPDF = async (
  publicId: string,
  documentId: string
): Promise<void> => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing in .env");
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

  // 3. Split text into chunks with metadata
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

  // 4. Initialize embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  // 5. Connect to ChromaDB
  const vectorStore = new Chroma(embeddings, {
    collectionName: "resume-documents",
    url: "http://localhost:8000",
  });

  // 6. Save chunks and metadata
  await vectorStore.addDocuments(chunks);

  console.log("PDF chunks and embeddings stored successfully!");
};
