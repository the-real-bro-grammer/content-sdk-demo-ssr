import { NextApiRequest, NextApiResponse } from 'next';
import demoProducts from 'src/lib/data/demo-products.json';
import { Product } from 'src/types/demo-4/product';

type ProductsResponse = {
  products: Product[];
};

export class ProductsMiddleware {
  private readonly products: Product[];

  constructor() {
    this.products = demoProducts as Product[];
  }

  getHandler() {
    return this.handler.bind(this);
  }

  private async handler(
    req: NextApiRequest,
    res: NextApiResponse<ProductsResponse | { message: string }>
  ): Promise<void> {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      res.status(405).json({ message: 'Method Not Allowed' });
      return;
    }

    try {
      const queryName = req.query.name;
      const searchTerm = Array.isArray(queryName) ? queryName[0] : queryName;

      const products = searchTerm
        ? await this.searchProductsByName(searchTerm)
        : await this.getAllProducts();

      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: 'Unable to load products' });
    }
  }

  private async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  private async searchProductsByName(name: string): Promise<Product[]> {
    const term = name.trim().toLowerCase();

    if (!term.length) {
      return this.getAllProducts();
    }

    return this.products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(term);
      const slugMatch = product.slug.toLowerCase().includes(term);

      return nameMatch || slugMatch;
    });
  }
}
