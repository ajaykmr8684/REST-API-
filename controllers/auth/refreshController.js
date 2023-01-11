import Joi from "joi"
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../models";
import user from "../../models/user";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";

const refreshController = {
    async refresh(req, res, next){
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        })

        const {error} = refreshSchema.validate(req.body);

        if(error){
            return next(error);
        }

        //Logic
        let refreshToken;
        try {
            refreshToken =  await RefreshToken.findOne({token: req.body.refresh_token})


            if(!refreshToken){
                return next(CustomErrorHandler.unAuthorized("Invalid refresh token"))
            }

            let userId;
            try {
                const { _id } = await JwtService.verify(refreshToken.token, REFRESH_SECRET);
                userId = _id;
            } catch (error) {
                return next(CustomErrorHandler.unAuthorized("Invalid refresh token"))
            }

            const user = User.findOne({_id: userId})
            if(!user) {
                return next(CustomErrorHandler.unAuthorized("No user found"))
            }

            //Generate tokens
            const access_token =  JwtService.sign({_id: user._id, role: user.role})
            const refresh_token = JwtService.sign({_id: user._id, role: user.role}, '1y', REFRESH_SECRET)
            
             //data whitelist
             await RefreshToken.create({token: refresh_token})


             res.json({access_token, refresh_token})


        } catch (error) {
            return next(error);
        }

        
    }
}

export default refreshController