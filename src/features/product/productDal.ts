import { injectable } from "tsyringe";
import { Product, CreateProductRequest, UpdateProductRequest } from "./productApiTypes";
import MongooseBaseDal, { BaseDocument } from "@utils/mongodb/MongooseBaseDal";
import { ProductDocument, ProductModel } from "./productModel";

@injectable()
export class ProductDal extends MongooseBaseDal<ProductDocument> {
  constructor() {
    super(ProductModel);
  }

  async createProduct(data: CreateProductRequest): Promise<ProductDocument> {
    const product = await this.create({
      ...data,
      status: "draft",
    });

    return product;
  }

  async getProduct(id: string): Promise<ProductDocument | null> {
    return this.findById(id);
  }

  async updateProduct(id: string, data: UpdateProductRequest): Promise<ProductDocument | null> {
    return this.update(id, data);
  }

  async listProducts(page: number = 1, limit: number = 10): Promise<{ products: ProductDocument[]; total: number }> {
    const result = await this.findAll({}, page, limit);
    return {
      products: result.items,
      total: result.total,
    };
  }
}
