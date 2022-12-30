import Joi from "joi"
import CustomErrorHandler from "../../services/CustomErrorHandler";

const registerController = {
    register(req, res, next){
        
        const registerSchema = Joi.object({
            "name": Joi.string().min(3).max(30).required(),
            "email": Joi.string().email().required()
        })

        const { error } = registerSchema.validate(req.body);

        if(error){
            return next(error);
        }

        //Checks user exists or not
         try {
            const exists = true;

            if(exists) {
                return next(CustomErrorHandler.alreadyExists('This email has already been taken. Try other.'))
            }
         } catch (error) {
            return next(error);
         }

        res.json({"response": "Welcome. Successfully registered!"})
    }
}

export default registerController;