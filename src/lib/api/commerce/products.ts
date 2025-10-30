import { Product } from 'src/types/demo-4/product';
import axios, { basePath } from '../axios-instance';

export type GetProductResponse = {
  products: Product[];
};

const path = `${basePath}/products`;

export class ProductApi {
  public static GetAllProducts = async () => {
    const response = await axios.get(path);
    return response.data as GetProductResponse;
  };

  public static GetProductByName = async (name: string): Promise<Product | null> => {
    const response = await axios.get(`${path}?name=${name}`);
    const results = response.data as GetProductResponse;

    return results?.products.length == 1 ? results.products[0] : Promise.resolve(null);
  };
}
