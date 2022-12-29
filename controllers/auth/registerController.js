import Joi from "joi"

const registerController = {
    register(req, res, next){
        

        const registerSchema = Joi.object({
            "name": Joi.string().min(3).max(30).required(),
            "email": Joi.string().email().required()
        })

        console.log(req.body);
        const { error } = registerSchema.validate(req.body);

        if(error){
            return res.json({"error": `Oops! ${error.message}`})
        }

        res.json({"response": "Welcome. Successfully registered!"})
    }
}

export default registerController;