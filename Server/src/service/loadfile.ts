import cloudinary from "../config/cloudinary.js";
import { PDFParse } from "pdf-parse";

export const loadPdf = async (
  publicId: string
): Promise<string> => {
  const url = cloudinary.utils.private_download_url(
    publicId,
    "pdf",
    {
      resource_type: "raw",
      type: "authenticated",
    }
  );

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`PDF download failed: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  const parser = new PDFParse({
    data: new Uint8Array(buffer),
  });

  try {
    const result = await parser.getText();
    const text = result.text.trim();

    if (!text) {
      throw new Error("No readable text found in PDF");
    }
    return text;
  } finally {
    await parser.destroy();
  }
};

