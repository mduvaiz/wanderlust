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

// Auth payloads: strings only, unknown keys rejected.
// Do not use .strict() here — it disables convert, so trim/lowercase would not run.
// Joi.validate() returns { error } (does not throw); route handlers flash and redirect.
module.exports.signupSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .pattern(/^[A-Za-z0-9_]+$/)
        .required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).max(72).required(),
}).unknown(false);

module.exports.loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(1).max(72).required(),
}).unknown(false);