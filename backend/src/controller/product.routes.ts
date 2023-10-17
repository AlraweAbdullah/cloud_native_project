/**
 * @swagger
 *   components:
 *    schemas:
 *      Product:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            format: int64
 *          name:
 *            type: string
 *            description: Product's name
 *          price:
 *            type: number
 *            format: int64
 *            description: Product's price
 *          description:
 *            type: string
 *            description: Product's description
 *          customerId:
 *            type: number
 *            formar: int64
 *            description: Id of the customer we should already have a customer id to link the product to it
 *            items:
 *               $ref: '#/components/schemas/Customer'
 *
 *      ProductInput:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: Product's name
 *          price:
 *            type: number
 *            format: int64
 *            description: Product's price
 *          description:
 *            type: string
 *            description: Product's description
 *          customerId:
 *            type: number
 *            format: int64
 *            description: Id of the customer we should already have a customer id to link the product to it
 *
 *      UpdateProductInput:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            format: int64
 *            description: Product's id
 *          name:
 *            type: string
 *            description: Product's name
 *          price:
 *            type: number
 *            format: int64
 *            description: Product's price
 *          description:
 *            type: string
 *            description: Product's description
 *          customerId:
 *            type: number
 *            format: int64
 *            description: Id of the customer we should already have n customer id to link the product to it
 *
 *
 */
import express, { Request, Response } from 'express';
import productService from '../service/product.service';
import type { ProductInput } from '../types/types';
const productRouter = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Link a product to a customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: The new product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Error
 */

productRouter.post('/', async (req: Request, res: Response) => {
    const newProduct = <ProductInput>req.body;
    try {
        const product = await productService.addProduct(newProduct);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /products/{id}/{isCustomerProducts}:
 *   get:
 *     summary: Retrieve products based on customer and isCustomerProducts flag.
 *     description: Get products data based on the customer ID and isCustomerProducts flag.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The customer's unique identifier.
 *       - in: path
 *         name: isCustomerProducts
 *         schema:
 *           type: boolean
 *         required: true
 *         description: A flag to indicate whether to fetch customer's products or not.
 *     responses:
 *       200:
 *         description: Products data based on the path parameters.
 *       404:
 *         description: Error if the customer or products data is not found.
 */

productRouter.get('/:id/:isCustomerProducts', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);
        const isCustomerProducts: boolean = req.params.isCustomerProducts === 'true';

        const customerProducts = await productService.getProductsOf(id, isCustomerProducts);
        res.status(200).json(customerProducts);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

// /**
// * @swagger
// * /products/title/{title}:
// *   get:
// *     security:
// *       - bearerAuth: []
// *     summary: Get  products by their titles .
// *     responses:
// *       200:
// *         description: Returns products or throw an error
// *         content:
// *           application/json:
// *             schema:
// *                $ref: '#/components/schemas/Product'
// *     parameters :
// *        - name: title
// *          in: path
// *          description: id of the product
// *          required: true
// *          type: string
// *
// */
// productRouter.get("/title/:title",async (req:Request, res:Response) =>{
//     try{
//         const name:string = req.params.name
//         const products = await productService.getProductByName({name: name});
//         res.status(200).json(products)
//     }catch(error){
//         res.status(500).json({status:'error', errorMessage: error.message})
//     }
// })

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete  a product by id
 *     responses:
 *       200:
 *         description: Returns the deleted boook, if not then an error is returned
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Product'
 *     parameters :
 *        - name: id
 *          in: path
 *          description: id of the product
 *          required: true
 *          type: integer
 *          format: int64
 *
 */
productRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);
        const deleteProduct = await productService.deleteProductById({ id: id });
        res.status(200).json(deleteProduct);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /products:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: The updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Error
 */
productRouter.put('/', async (req: Request, res: Response) => {
    const product = <ProductInput>req.body;
    try {
        const newProduct = await productService.updateProduct(product);
        res.status(200).json(newProduct);
    } catch (error) {
        res.status(500).json({ status: 'error', errorMessage: error.message });
    }
});

export { productRouter };
