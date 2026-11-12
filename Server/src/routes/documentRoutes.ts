import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { confirmDocumentUpload, getMyDocuments, getUploadSignature, previewDocument, removeDocument } from "../controller/docController.js";

const router = Router();

router.post("/upload-signature", authMiddleware, getUploadSignature);
router.post("/confirm-upload", authMiddleware, confirmDocumentUpload);
router.get("/documents", authMiddleware, getMyDocuments);
router.get("/:documentId/preview",authMiddleware,previewDocument)
router.delete("/remove",authMiddleware,removeDocument)

export default router;