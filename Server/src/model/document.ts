import mongoose, { Schema } from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
    format: {
      type: String,
      enum: ["pdf", "docx", "txt"],
      required: true,
    },
    bytes: {
      type: Number,
      required: true,
      min: 1,
      max: 5 * 1024 * 1024,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "ready", "failed"],
      default: "pending",
      index: true,
    },
    previewUrl: {
  type: String,
  default: null,
},
  },
  { timestamps: true }
);

documentSchema.index({ userId: 1, createdAt: -1 });

const Document = mongoose.model("Document", documentSchema);

export default Document;