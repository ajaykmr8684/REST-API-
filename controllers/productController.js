import Joi from "joi"
import { Product } from "../models";
import multer from "multer"
import path from "path"
import fs from "fs"
import CustomErrorHandler from "../services/CustomErrorHandler";
import productSchema from "../validators/productSchema";

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
        const filePath = req.file.path.replace("\\", "/")
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
    },
    async update(req, res, next) {
        //Multipart form data
        handleMultipartData(req, res, async (err) => {
            if(err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            let filePath;
            if(req.file) {
                filePath = req.file.path.replace("\\", "/")
            } 
            const {error} = productSchema.validate(req.body);
            if(error) {
                if(req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if(err) {
                        return next(CustomErrorHandler.serverError(err.message))
                        }
                 })
                }
                
             return next(error)
        }

        let document;
        const {name, price, size} = req.body;
        try {
            document = await Product.findOneAndUpdate({_id: req.params.id}, {
                name,
                price,
                size,
                ...(req.file && {image: filePath})
            }, {new: true})
        } catch (error) {
            return next(error);
        }
        console.log(document)
        res.status(201).json(document)
        
        })
    },
    async destroy(req, res, next) {
        const document = await Product.findOneAndRemove({_id: req.params.id})
        if(!document) {
            return next(new Error("Nothing to delete!"))
        }
        //now delete the image as well
        const filePath = document._doc.image;
        await fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if(err) {
                return next(CustomErrorHandler.serverError())
            }
        })
        res.json(document);
    },
    async index (req, res, next) {
        let documents;
        //pagination (using mongoose pagination)
        try {
            documents = await Product.find().select("-createdAt -updatedAt -__v").sort({_id: -1});
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },
    async show (req, res, next) {
        let product;
        try {
            product = await Product.findOne({_id: req.params.id}).select("-updatedAt -__v")
            return res.json(product)
        } catch (error) {
            return next(CustomErrorHandler.serverError())
        }
    }
}

export default productController;