import Joi from "joi"
const refreshController = {
    async refresh(req, res, next){
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        })
    }
}

export default refreshController