import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.UUID(), // or use uuid library
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    customer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    items: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
// Ensure updatedAt is refreshed automatically
OrderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
