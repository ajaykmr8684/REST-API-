import Joi from "joi"
import { Product } from "../models";
import multer from "multer"
import path from "path"
import fs from "fs"
import CustomErrorHandler from "../services/CustomErrorHandler";


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5}}).single('image')



const productController = {
    async store(req, res, next){

        //Multipart form data
        handleMultipartData(req, res, async (err) => {
            if(err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            
            console.log(req.file.path)
            const filePath = req.file.path.replace("\\", "/")
            //JOI Schema
        const productSchema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            size: Joi.string().required(),
        })

        const {error} = productSchema.validate(req.body);

        if(error) {
            fs.unlink(`${appRoot}/${filePath}`, (err) => {
                if(err) {
                    return next(CustomErrorHandler.serverError(err.message))
                }
               
            })
            return next(error)
        }

        let product;
        const {name, price, size} = req.body;
        try {
            product = await Product.create({
                name,
                price,
                size,
                image: filePath
            })
        } catch (error) {
            return next(error);
        }

        res.status(201).json(product)
        
        })
        

        // //Main
        // const {name, price, size, image} = req.body;

        // const product = new Product({
        //     name,
        //     price,
        //     size,
        //     image
        // })

        // const result = await product.save();

        // res.json({"name": result.name})


    }
}

export default productController;