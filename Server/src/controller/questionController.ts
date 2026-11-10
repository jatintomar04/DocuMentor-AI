
import type { Request, Response } from "express";
import { askQuestion } from "../service/askQuestion.js";

export const questionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { documentId, question } = req.body;

    if (
      typeof documentId !== "string" ||
      !documentId.trim() ||
      typeof question !== "string" ||
      !question.trim()
    ) {
      res.status(400).json({
        message: "documentId and question are required",
      });
      return;
    }

    const answer = await askQuestion(
      documentId.trim(),
      question.trim()
    );

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Question failed:", error);

    res.status(500).json({
      message: "Failed to answer question",
    });
  }
};
