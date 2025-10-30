import axios, { basePath } from '../axios-instance';

export type GetProductResponse = {
  id: string;
  name: string;
};

const path = `${basePath}/products`;

export class ProductApi {
  public static GetAllProducts = async () => {
    const response = await axios.get(path);
    return response.data as GetProductResponse[];
  };

  public static GetProductByName = async (name: string): Promise<GetProductResponse | null> => {
    const response = await axios.get(`${path}?name=${name}`);
    const results = response.data as GetProductResponse[];

    return results?.length == 1 ? results[0] : Promise.resolve(null);
  };
}
