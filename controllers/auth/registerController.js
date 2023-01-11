import Joi from "joi"
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt"
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const registerController = {
    async register(req, res, next){
        
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        })

        const { error } = registerSchema.validate(req.body);

        if(error){
            return next(error);
        }

        //Checks user exists or not
         try {
            const exists = await User.exists({email: req.body.email});

            if(exists) {
                return next(CustomErrorHandler.alreadyExists('This email has already been taken. Try other.'))
            }
         } catch (error) {

            return next(error);
         }

         //hash password
         const hashedPassword = await bcrypt.hash(req.body.password, 10);

         //prepare the model
         const {name, email} = req.body;
         const user = new User( {
            name,
            email,
            password: hashedPassword
         })
         
         let access_token;
         let refresh_token;
         try {
            const result = await user.save()
            //we have to send json token to user
            access_token = JwtService.sign({_id: result._id, role: result.role})
            refresh_token = JwtService.sign({_id: result._id, role: result.role}, '1y', REFRESH_SECRET)

            //data whitelist
            await RefreshToken.create({token: refresh_token})
         } catch (error) {
            return next(error)
         }


        res.json({access_token, refresh_token})
    }

}

export default registerController;