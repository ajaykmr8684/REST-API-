import Joi from "joi"
import { Product } from "../models";


const productController = {
    async store(req, res, next){
        
        //JOI Schema
        const productSchema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            size: Joi.string().required(),
            image: Joi.string().required()
        })

        const {error} = productSchema.validate(req.body);

        if(error) {
            return next(error);
        }

        //Multer


        //Main
        const {name, price, size, image} = req.body;

        const product = new Product({
            name,
            price,
            size,
            image
        })

        const result = await product.save();

        res.json({"name": result.name})


    }
}

export default productController;