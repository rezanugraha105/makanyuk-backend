const autoBind = require('auto-bind');
const config = require('../../utils/config');
const { message } = require('../../validator/users/schema');

class FoodReviewsHandler {
    constructor(foodReviewsService, storageService, validator) {
        this._foodReviewsService = foodReviewsService;
        this._storageService = storageService;
        this._validator = validator;

        autoBind(this);
    }

    async postReviewHandler(request, h) {
        this._validator.validatefoodReviewPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { title, description, photoUrl, rating, lat, lon } = request.payload;
        this._validator.validateImageHeaders(photoUrl.hapi.headers);

        const filename = await this._storageService.writeFile(photoUrl, photoUrl.hapi);
        const fileLocation = `https://${config.app.host}/reviews/images/${filename}`;

        const newReview = await this._foodReviewsService.addReview(credentialId, { title, description, photoUrl: fileLocation, rating, lat, lon });

        const response = h.response({
            status: 'success',
            message: 'Review Anda berhasil ditambahkan!.',
            data: {
                newReview
            },
        });
        response.code(201);
        return response;
    }

    async getAllReviewsHandler(request, h) {
        const reviews = await this._foodReviewsService.getAllReviews();
        const response = h.response({
            status: 'success',
            message: 'Berhasil mengambil semua review.',
            data: {
                reviews
            },
        });
        response.code(200);
        return response;
    }

    async getReviewByIdHandler(request, h) {
        const { id } = request.params;
        const review = await this._foodReviewsService.getReviewById(id);
        const response = h.response({
            status: 'success',
            message: 'Berhasil mengambil review dengan Id',
            data: {
                review
            },
        });
        response.code(200);
        return response;
    }

    async getReviewUpdateByIdHandler(request, h) {
        const { id } = request.params;
        const review = await this._foodReviewsService.getReviewUpdateById(id);
        const response = h.response({
            status: 'success',
            message: 'Berhasil mengambil review dengan Id',
            data: {
                review
            },
        });
        response.code(200);
        return response;
    }

    async getMyReviews(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const reviews = await this._foodReviewsService.getReviewByUserId(credentialId);
        const response = h.response({
            status: 'success',
            message: 'Berhasil mengambil review kamu',
            data: {
                reviews
            },
        });
        response.code(200);
        return response;
    }

    async deleteReviewByIdHandler(request, h) {
        const { id } = request.params;
        await this._foodReviewsService.deleteReviewById(id);

        return h.response({
            status: 'success',
            message: 'Review berhasil dihapus'
        });
    }

    async updateReviewByIdHandler(request, h) {
        this._validator.validatefoodReviewUpdatePayload(request.payload);

        const { id } = request.params;
        const { title, description, rating, lat, lon } = request.payload;

        await this._foodReviewsService.updateReviewById(id, { title, description, rating, lat, lon });

        const response =  h.response({
            status: 'success',
            message: 'Review berhasil diperbarui'
        });
        response.code(200);
        return response;
    }

}

module.exports = FoodReviewsHandler;