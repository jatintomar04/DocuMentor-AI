import type { Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";

import Document from "../model/document.js";
import {
  createUploadSignature,
  verifyUploadedAsset,
} from "../service/docService.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import { embedPDF } from "../service/embedPdf.js";
import cloudinary from "../config/cloudinary.js";
import { qdrantClient } from "../config/createCollection.js";
import axios from "axios";

const confirmSchema = z.object({
  publicId: z.string().min(1).max(300),
  title: z.string().trim().min(1).max(200),
});

export const getUploadSignature = (req: AuthRequest, res: Response) => {
  if (!req.userId || !mongoose.isValidObjectId(req.userId)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const uploadData = createUploadSignature(req.userId);
  return res.status(200).json(uploadData);
};




export const confirmDocumentUpload = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId || !mongoose.isValidObjectId(req.userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = confirmSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request",
        errors: parsed.error.flatten(),
      });
    }

    const { publicId, title } = parsed.data;
    const expectedPrefix = `documents/${req.userId}/`;

    if (!publicId.startsWith(expectedPrefix)) {
      return res.status(403).json({
        message: "You cannot upload for another user",
      });
    }

    const existing = await Document.findOne({ publicId });

    if (existing) {
      if (existing.userId.toString() !== req.userId) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      return res.status(200).json({
        message: "Document already registered",
        document: existing,
      });
    }

    const asset = await verifyUploadedAsset(publicId);

    const allowedFormats = ["pdf", "docx", "txt"] as const;

    const format = allowedFormats.find(
      (item) => item === asset.format
    );

    if (!format) {
      return res.status(400).json({
        message: "Unsupported document format",
      });
    }
    

    // 1. Save document in MongoDB
  
const document = await Document.create({
  userId: req.userId,
  title,
  publicId: asset.publicId,
  format,
  bytes: asset.bytes,
  status: "pending",
});
    // 2. Return response while PDF processing runs
    res.status(201).json({
      message: "Document uploaded successfully. Processing started.",
      document,
    });

    // 3. Automatically generate embeddings for PDFs
    if (format === "pdf") {
      void (async () => {
        try {
          await embedPDF(
            document.publicId,
            document._id.toString()
          );

          await Document.updateOne(
            { _id: document._id },
            { $set: { status: "completed" } }
          );

          console.log(
            `Embedding completed for document: ${document._id}`
          );
        } catch (error) {
          console.error(
            `Embedding failed for document ${document._id}:`,
            error
          );

          await Document.updateOne(
            { _id: document._id },
            { $set: { status: "failed" } }
          );
        }
      })();
    }
  } catch (error) {
    console.error("Confirm document upload error:", error);

    if (!res.headersSent) {
      return res.status(400).json({
        message: "Could not verify uploaded document",
      });
    }
  }
};



export const getMyDocuments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const documents = await Document.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({ documents });
  } catch (error) {
    console.error("Fetch documents error:", error);

    return res.status(500).json({
      message: "Could not fetch documents",
    });
  }
};



export const previewDocument = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // 1. Get document ID and authenticated user ID
    const documentId = req.params.documentId;
    const userId = req.userId;

    // 2. Validate document ID
    if (
      typeof documentId !== "string" ||
      !mongoose.isValidObjectId(documentId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid document ID",
      });
      return;
    }

    // 3. Validate user ID
    if (!userId || !mongoose.isValidObjectId(userId)) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Authentication required.",
      });
      return;
    }

    // 4. Find document belonging to authenticated user
    const document = await Document.findOne({
      _id: new mongoose.Types.ObjectId(documentId),
      userId: new mongoose.Types.ObjectId(userId),
      format: "pdf",
    }).exec();

    if (!document) {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
      return;
    }

    // 5. Get Cloudinary public ID
    const publicId = document.publicId;

    if (!publicId) {
      res.status(404).json({
        success: false,
        message: "Document file not found in storage",
      });
      return;
    }

    // 6. Generate authenticated PDF download URL
    const pdfUrl = cloudinary.utils.private_download_url(
      publicId,
      "pdf",
      {
        resource_type: "raw",
        type: "authenticated",
        attachment: false,
      }
    );

    // 7. Fetch PDF from Cloudinary
    const pdfResponse = await axios.get<ArrayBuffer>(pdfUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    // 8. Convert response into Buffer
    const pdfBuffer = Buffer.from(pdfResponse.data);

    // 9. Send PDF response
    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(document.title || "document.pdf")}"`
    );

    res.setHeader("Content-Length", pdfBuffer.length);

    res.setHeader("Cache-Control", "private, no-store");

    res.status(200).send(pdfBuffer);

  } catch (error: unknown) {
    console.error("PDF PREVIEW ERROR:", error);

    if (axios.isAxiosError(error)) {
      console.error("Cloudinary response status:", error.response?.status);

      res.status(502).json({
        success: false,
        message: "Unable to fetch PDF from Cloudinary",
        error: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to preview document",
      error:
        error instanceof Error
          ? error.message
          : "Internal server error",
    });
  }
};



// Remove document from Qdrant, Cloudinary and MongoDB

export const removeDocument = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { documentid } = req.body;
    const userId = req.userId;

    // 1. Validate document ID
    if (!documentid || !mongoose.isValidObjectId(documentid)) {
      return res.status(400).json({
        success: false,
        message: "Valid document ID required",
      });
    }

    // 2. Validate user
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 3. Find document belonging to logged-in user
    const document = await Document.findOne({
      _id: documentid,
      userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // 4. Delete vectors from Qdrant
    await qdrantClient.delete("resume-documents", {
      wait: true,
      filter: {
        must: [
          {
            key: "metadata.documentId",
            match: {
              value: document._id.toString(),
            },
          },
        ],
      },
    });

    console.log("Qdrant embeddings deleted");

    // 5. Delete PDF/file from Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(
      document.publicId,
      {
        resource_type: "raw",
        type: "authenticated",
        invalidate: true,
      }
    );

    if (
      cloudinaryResult.result !== "ok" &&
      cloudinaryResult.result !== "not found"
    ) {
      throw new Error("Cloudinary file deletion failed");
    }

    console.log("Cloudinary file deleted");

    // 6. Delete document from MongoDB
    await Document.deleteOne({
      _id: document._id,
      userId,
    });

    console.log("MongoDB document deleted");

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });

  } catch (error) {
    console.error("Remove document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete document",
      error:
        error instanceof Error
          ? error.message
          : "Internal server error",
    });
  }
};