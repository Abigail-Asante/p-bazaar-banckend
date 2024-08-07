import Joi from "joi";

export const orderValidator = Joi.object({
    userId: Joi.string(),
    productId: Joi.string(),
    orderDate:  Joi.date(),
    status: Joi.string().valid('Pending', 'Completed', 'Cancelled').default('Pending'),
    amount: Joi.string()
});