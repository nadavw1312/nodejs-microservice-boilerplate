import { Controller, Get, Post, Put, Path, Body, Query, Route, Tags, Middlewares } from 'tsoa';
import { injectable } from 'tsyringe';
import { ProductBl } from './productBl';
import { CreateProductRequest, UpdateProductRequest, ProductResponse, ProductsListResponse } from './productApiTypes';
import validate from '../../middlewares/validate-middleware';
import { createProductSchema, updateProductSchema, getProductSchema, listProductsSchema } from './productValidation';

@Route('products')
@Tags('Products')
@injectable()
export class ProductController extends Controller {
    constructor(private productBl: ProductBl) {
        super();
    }

    /**
     * Create a new product
     * @param requestBody Product creation data
     */
    @Post()
    @Middlewares([validate(createProductSchema)])
    public async createProduct(@Body() requestBody: CreateProductRequest): Promise<ProductResponse> {
        return this.productBl.createProduct(requestBody);
    }

    /**
     * Get a product by ID
     * @param id Product ID
     */
    @Get('{id}')
    @Middlewares([validate(getProductSchema)])
    public async getProduct(@Path() id: string): Promise<ProductResponse> {
        return this.productBl.getProduct(id);
    }

    /**
     * Update a product
     * @param id Product ID
     * @param requestBody Product update data
     */
    @Put('{id}')
    @Middlewares([validate(updateProductSchema)])
    public async updateProduct(
        @Path() id: string,
        @Body() requestBody: UpdateProductRequest
    ): Promise<ProductResponse> {
        return this.productBl.updateProduct(id, requestBody);
    }

    /**
     * List products with pagination
     * @param page Page number
     * @param limit Items per page
     */
    @Get()
    @Middlewares([validate(listProductsSchema)])
    public async listProducts(
        @Query() page?: number,
        @Query() limit?: number
    ): Promise<ProductsListResponse> {
        return this.productBl.listProducts(page, limit);
    }
}
