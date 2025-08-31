export interface Product {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    title: string;
    description: string;
    price: number;
    supplier: string;
    status: 'active' | 'draft' | 'archived';
}

export interface CreateProductRequest {
    /** Product title */
    title: string;
    /** Product description */
    description: string;
    /** Product price */
    price: number;
    /** Supplier identifier */
    supplier: string;
}

export interface UpdateProductRequest {
    /** Product title */
    title?: string;
    /** Product description */
    description?: string;
    /** Product price */
    price?: number;
    /** Product status */
    status?: 'active' | 'draft' | 'archived';
}

export interface ProductResponse {
    /** Operation success status */
    success: boolean;
    /** Product data */
    data: Product;
}

export interface ProductsListResponse {
    /** Operation success status */
    success: boolean;
    /** List of products */
    data: Product[];
    /** Total number of products */
    total: number;
    /** Current page number */
    page: number;
    /** Number of items per page */
    limit: number;
}
