import { Collection } from "../../domain/models/collection";
import {
  Product,
  ProductCollectionItem,
} from "../../domain/models/product.model";
import { RelatedProduct } from "../../domain/models/related-product.model";
import { ProductRepositoty } from "../../domain/repositories/product.repository";
import { httpClient } from "../config/http-client";
import {
  productCollectionMapper,
  productMapper,
  relatedProductMapper,
} from "../mappers/product.mapper";

export class IProductDepository implements ProductRepositoty {
  async getProducts(page: number): Promise<Collection<ProductCollectionItem>> {
    const response = await httpClient.get("products", {
      params: {
        page: String(page),
      },
    });
    return productCollectionMapper(response.data);
  }

  async getProduct(id: number): Promise<Product> {
    const response = await httpClient.get(`products/${id}`);

    return productMapper(response.data);
  }
  async updateProduct(
    id: number,
    attributes: Record<string, any>
  ): Promise<Product> {
    const response = await httpClient.put(`products/${id}`, attributes);

    return productMapper(response.data);
  }
  async createProduct(attributes: Record<string, any>): Promise<Product> {
    const response = await httpClient.post("products", attributes);

    return productMapper(response.data);
  }
  async deleteProduct(id: number): Promise<void> {
    await httpClient.delete(`products/${id}`);
  }

  async addRelatedProduct(
    productId: number,
    relatedProductId: number
  ): Promise<RelatedProduct> {
    const response = await httpClient.post(
      `products/${productId}/related_products`,
      { related_product_id: relatedProductId }
    );
    return relatedProductMapper(response.data);
  }

  async removeRelatedProduct(
    productId: number,
    relatedProductId: number
  ): Promise<void> {
    await httpClient.delete(
      `products/${productId}/related_products/${relatedProductId}`
    );
  }
}

export default new IProductDepository();
