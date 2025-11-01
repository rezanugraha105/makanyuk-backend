const InvariantError = require('../../exceptions/InvariantError');
const { foodReviewPayloadSchema, ImageHeadersSchema, foodReviewUpdatePayloadSchema } = require('./schema');

const foodReviewsValidator = {
    validatefoodReviewPayload: (payload) => {
        const validationResult = foodReviewPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateImageHeaders: (headers) => {
        const validationResult = ImageHeadersSchema.validate(headers);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatefoodReviewUpdatePayload: (payload) => {
        const validationResult = foodReviewUpdatePayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
};

module.exports = foodReviewsValidator;