import { mapToProduct, mapToProducts } from '../../mapper/product.mapper';
import { database, Prisma } from '../../util/db.server';
import { Product } from '../model/product';

const addProduct = async ({
    name,
    price,
    description,
    customerId,
}: {
    name: string;
    price: number;
    description: string;
    customerId: number;
}): Promise<Product> => {
    try {
        const productPrisma = await database.product.create({
            data: {
                name,
                price,
                description,
                customer: {
                    connect: { id: customerId },
                },
            },
            include: {
                customer: { include: { products: true } },
            },
        });
        return mapToProduct(productPrisma);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error(`Seller has already a product with name {${name}}`);
            }
        }
        throw new Error(error.message);
    }
};

const getProductById = async ({ id }: { id: number }): Promise<Product> => {
    const product = await database.product.findUnique({
        where: { id: id },
        include: {
            customer: { include: { products: true } },
        },
    });

    if (!product) {
        throw new Error(`Product with id {${id}} couldn't be found`);
    }

    return mapToProduct(product);
};

const getProductByName = async ({ name }: { name: string }): Promise<Product[] | Error> => {
    const products = await database.product.findMany({
        where: {
            name: name,
        },
        include: {
            customer: { include: { products: true } },
        },
    });

    const mapper = mapToProducts(products);
    if (mapper.length == 0) {
        throw new Error(`Couldn't find name that contain {${name}}`);
    } else {
        return mapper;
    }
};

const getAllProducts = async (): Promise<Product[]> => {
    const products = await database.product.findMany({
        include: {
            customer: { include: { products: true } },
        },
    });
    return mapToProducts(products);
};

const deleteProductById = async ({ id }: { id: number }): Promise<Product> => {
    await getProductById({ id: id }); // Check if product exists by id
    const deleteProduct = await database.product.delete({
        where: {
            id: id,
        },
        include: {
            customer: { include: { products: true } },
        },
    });
    return mapToProduct(deleteProduct);
};

const updateProduct = async ({
    id,
    name,
    price,
    description,
    customerId,
}: {
    id: number;
    name: string;
    price: number;
    description: string;
    customerId: number;
}): Promise<Product> => {
    try {
        const productPrisma = await database.product.update({
            where: {
                id: id,
            },
            data: {
                name,
                price,
                description,
            },
            include: {
                customer: { include: { products: true } },
            },
        });
        return mapToProduct(productPrisma);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error(`Seller has already a product with name {${name}}`);
            }
        }
        throw new Error(error.message);
    }
};
const getProductsOf = async (id: number, isMyProduct: boolean): Promise<Product[]> => {
    const productsPrisma = await database.product.findMany({
        where: isMyProduct ? { customerId: id } : { NOT: { customerId: id } },
        include: {
            customer: { include: { products: true } },
        },
    });

    if (productsPrisma) {
        const products = mapToProducts(productsPrisma);
        return products;
    } else {
        return [];
    }
};

export default {
    addProduct,
    getAllProducts,
    getProductById,
    deleteProductById,
    getProductByName,
    updateProduct,
    getProductsOf,
};
