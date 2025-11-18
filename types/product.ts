// /types/product.ts

export type ProductSpecifications = {
    [key: string]: string;
};

export type Product = {
    slug: string;
    title: string;
    price: number;
    mrp: number;
    images: string[];
    rating: number;
    reviews: number;
    stock: number;
    description: string;
    specifications: ProductSpecifications;
};
