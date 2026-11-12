
import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

export const askQuestion = async (
  documentId: string,
  question: string
): Promise<string> => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing");
  }

  if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
    throw new Error("Qdrant credentials are missing");
  }

  if (!documentId?.trim()) {
    throw new Error("Document ID is required");
  }

  if (!question?.trim()) {
    throw new Error("Question cannot be empty");
  }

  // 1. Initialize Gemini embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  // 2. Connect to Qdrant Cloud
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: "resume-documents",
    }
  );

  // 3. Search only selected document chunks
  const relevantChunks = await vectorStore.similaritySearch(
    question.trim(),
    4,
    {
      documentId: documentId.trim(),
    }
  );

  if (relevantChunks.length === 0) {
    return "I couldn't find this information in the selected document.";
  }

  // 4. Prepare context
  const context = relevantChunks
    .map((doc, index) => `Chunk ${index + 1}:\n${doc.pageContent}`)
    .join("\n\n");

  // 5. Initialize Gemini LLM
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0,
  });

  // 6. Generate answer
  const response = await model.invoke([
    [
      "system",
      `You are an expert document analysis and question-answering AI.

Your sole purpose is to analyze the provided document context and answer user queries based EXCLUSIVELY on that text.

CRITICAL RULES:
1. STRICT BOUNDARIES: Do not use outside knowledge, internet search, or invent facts. Base your entire response ONLY on the supplied document context.
2. SUMMARIES & OVERVIEWS: If the user asks to summarize the document, explain what this document is, or requests a general overview, provide a clear, well-structured synthesis of its core topic, purpose, and key points using only the provided text.
3. SPECIFIC QUESTIONS: For targeted questions, extract the accurate answer directly from the context.
4. MISSING INFORMATION: If the context does not contain the necessary information, reply EXACTLY with: "I couldn't find this information in the selected document."
5. TONE & FORMAT: Be concise, accurate, and professional. Use bullet points for summaries when helpful.`,
    ],
    [
      "human",
      `Selected document context:\n${context}\n\nQuestion: ${question.trim()}`,
    ],
  ]);

  // 7. Return answer
  if (typeof response.content === "string") {
    return response.content;
  }

  return response.content
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
};
