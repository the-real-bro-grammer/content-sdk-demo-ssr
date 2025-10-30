import { ProductsMiddleware } from 'src/middleware/products-middleware';

const handler = new ProductsMiddleware().getHandler();

export default handler;
