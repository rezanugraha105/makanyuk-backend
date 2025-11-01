const Joi = require('joi');

const foodReviewPayloadSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().min(10).required(),
    photoUrl: Joi.any().required().description('File Gambar Makanan'),
    rating: Joi.any().required(),
    lat: Joi.any(),
    lon: Joi.any()
});

const foodReviewUpdatePayloadSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().min(10).required(),
    rating: Joi.any().required(),
    lat: Joi.any(),
    lon: Joi.any()
})

const ImageHeadersSchema = Joi.object({
    'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg').required(),
}).unknown();

module.exports = {
    foodReviewPayloadSchema,
    ImageHeadersSchema,
    foodReviewUpdatePayloadSchema
}