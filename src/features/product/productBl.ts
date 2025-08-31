import { injectable } from 'tsyringe';
import { ProductDal } from './productDal';
import { Product, CreateProductRequest, UpdateProductRequest, ProductResponse, ProductsListResponse } from './productApiTypes';
import ApiError from '@/utils/errors/ApiError';
import httpStatus from 'http-status';

@injectable()
export class ProductBl {
    constructor(private productDal: ProductDal) {}

    async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
        // Add validation if needed
        const product = await this.productDal.createProduct(data);
        return {
            success: true,
            data: product
        };
    }

    async getProduct(id: string): Promise<ProductResponse> {
        const product = await this.productDal.getProduct(id);
        if (!product) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
        }
        return {
            success: true,
            data: product
        };
    }

    async updateProduct(id: string, data: UpdateProductRequest): Promise<ProductResponse> {
        const product = await this.productDal.updateProduct(id, data);
        if (!product) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
        }
        return {
            success: true,
            data: product
        };
    }

    async listProducts(page: number = 1, limit: number = 10): Promise<ProductsListResponse> {
        const { products, total } = await this.productDal.listProducts(page, limit);
        return {
            success: true,
            data: products,
            total,
            page,
            limit
        };
    }
}
