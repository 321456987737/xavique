import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  status: { type: String, enum: ["active", "hidden"], default: "active" },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);

