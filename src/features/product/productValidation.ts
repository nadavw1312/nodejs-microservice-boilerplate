import Joi from 'joi';

export const createProductSchema = {
    body: Joi.object().keys({
        title: Joi.string().required().min(3).max(100),
        description: Joi.string().required().min(10).max(1000),
        price: Joi.number().required().min(0),
        supplier: Joi.string().required()
    })
};

export const updateProductSchema = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        title: Joi.string().min(3).max(100),
        description: Joi.string().min(10).max(1000),
        price: Joi.number().min(0),
        status: Joi.string().valid('active', 'draft', 'archived')
    }).min(1)
};

export const getProductSchema = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
};

export const listProductsSchema = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10)
    })
};
