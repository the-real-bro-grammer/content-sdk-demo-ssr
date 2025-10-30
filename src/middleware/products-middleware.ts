import { NextApiRequest, NextApiResponse } from 'next';
import demoProducts from 'src/lib/data/demo-products.json';
import { Product } from 'src/types/demo-4/product';

// API payload shared with the ProductApi client.
type ProductsResponse = {
  products: Product[];
};

export class ProductsMiddleware {
  private readonly products: Product[];

  constructor() {
    // Read the demo catalog once so requests stay in-memory and fast.
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

      // Search by slug/name when a query parameter is provided; otherwise return the full list.
      const products = searchTerm
        ? await this.searchProductsByName(searchTerm)
        : await this.getAllProducts();

      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: 'Unable to load products' });
    }
  }

  private async getAllProducts(): Promise<Product[]> {
    // Returning the cached array keeps the API synchronous while preserving the Promise signature.
    return this.products;
  }

  private async searchProductsByName(name: string): Promise<Product[]> {
    const term = name.trim().toLowerCase();

    if (!term.length) {
      return this.getAllProducts();
    }

    // Allow both friendly names and URL slugs to match, so filters work for either value.
    return this.products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(term);
      const slugMatch = product.slug.toLowerCase().includes(term);

      return nameMatch || slugMatch;
    });
  }
}
