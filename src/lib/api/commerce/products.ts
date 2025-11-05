import { Product } from 'src/types/demo-4/product';
import axios, { basePath } from '../axios-instance';

// Mirrors the shape returned by the ProductsMiddleware API.
export type GetProductResponse = {
    products: Product[];
};

const path = `${basePath}/commerce/products`;

export class ProductApi {
    public static GetAllProducts = async () => {
        // Used by the sitemap builder to fetch every available product.
        const response = await axios.get(path);
        return response.data as GetProductResponse;
    };

    public static GetProductByName = async (name: string): Promise<Product | null> => {
        // The Sitecore client calls this when resolving /shop/[slug] pages.
        const response = await axios.get(`${path}?name=${name}`);
        const results = response.data as GetProductResponse;

        return results?.products.length == 1 ? results.products[0] : Promise.resolve(null);
    };
}
