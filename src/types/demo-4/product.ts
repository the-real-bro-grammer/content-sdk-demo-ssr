// Represents the shape of a single product returned by the demo commerce API.
export type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    category: string;
    imageUrl: string;
    brand: string;
    sku: string;
    stock: number;
    rating: number;
    reviewCount: number;
    tags: string[];
};
