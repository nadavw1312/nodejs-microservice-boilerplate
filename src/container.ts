import { container } from "tsyringe";
import mongoose from "mongoose";
import { ProductController } from "./features/product/productApiController";
import { ProductBl } from "./features/product/productBl";
import { ProductDal } from "./features/product/productDal";
import config from "./config";

// Configure Mongoose
mongoose.set("transactionAsyncLocalStorage", true);

// Initialize Mongoose and get the MongoClient
const mongooseConnection = mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Register MongoClient
container.register("MongoClient", {
  useFactory: (container) => mongoose.connection.getClient(),
});

// Register Product dependencies as singletons
container.registerSingleton(ProductController);
container.registerSingleton(ProductBl);
container.registerSingleton(ProductDal);
