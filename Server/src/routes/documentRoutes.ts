import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { confirmDocumentUpload, getMyDocuments, getUploadSignature, previewDocument } from "../controller/docController.js";

const router = Router();

router.post("/upload-signature", authMiddleware, getUploadSignature);
router.post("/confirm-upload", authMiddleware, confirmDocumentUpload);
router.get("/documents", authMiddleware, getMyDocuments);
router.get("/:documentId/preview",authMiddleware,previewDocument)

export default router;