const Joi = require('joi');

module.exports.listingSchema  = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.object({ url: Joi.string().allow("") })
}).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

// Auth payloads: strings only, unknown keys rejected. Email is normalized before later DB lookups.
module.exports.signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(8).max(72).required(),
}).unknown(false).strict();

module.exports.loginSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(1).max(72).required(),
}).unknown(false).strict();