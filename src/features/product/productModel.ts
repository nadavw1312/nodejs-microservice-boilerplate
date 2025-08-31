import { Schema, model, Document } from "mongoose";
import { BaseDocument } from "@utils/mongodb/MongooseBaseDal";

export interface ProductDocument extends BaseDocument {
  title: string;
  description: string;
  price: number;
  supplier: string;
  status: "active" | "draft" | "archived";
}

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    supplier: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add any mongoose middleware here
productSchema.pre("save", function (next) {
  // Example validation
  if (this.price < 0) {
    next(new Error("Price cannot be negative"));
  }
  next();
});

export const ProductModel = model<ProductDocument>("Product", productSchema);
