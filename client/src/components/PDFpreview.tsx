
"use client";

import { useEffect, useState } from "react";
import { getDocumentPreview } from "@/service/documentService";

interface PdfPreviewProps {
  documentId: string | null;
  token: string;
}

export default function PdfPreview({
  documentId,
}: PdfPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!documentId ) {
      setPdfUrl(null);
      setError("");
      setLoading(false);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setError("");
        setPdfUrl(null);

        const blob = await getDocumentPreview(documentId);

        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err) {
        console.error("PDF Preview Error:", err);

        if (!cancelled) {
          setError("Unable to load PDF preview.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [documentId]);

  if (!documentId) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-xl border bg-gray-50">
        <p className="text-gray-500">
          Select a document to preview
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-xl border">
        <p className="text-gray-500">Loading PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-white">
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="PDF Document Preview"
          className="h-[700px] w-full"
        />
      )}
    </div>
  );
}
