const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/reviews',
        handler: handler.postReviewHandler,
        options: {
            auth: 'makanyuk_jwt',
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 512000,
            }
        }
    },
    {
        method: 'GET',
        path: '/reviews',
        handler: handler.getAllReviewsHandler,
        options: {
            auth: 'makanyuk_jwt',
        }
    },
    {
        method: 'GET',
        path: '/reviews/{id}',
        handler: handler.getReviewByIdHandler,
        options: {
            auth: 'makanyuk_jwt',
        }
    },
    {
        method: 'GET',
        path: '/reviews/images/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'file'),
            }
        },
        options: {
            auth: false,
            cors: {
                origin: ['*'],
            }
        }
    },
    {
        method: 'GET',
        path: '/reviews/my-reviews',
        handler: handler.getMyReviews,
        options: {
            auth: 'makanyuk_jwt',
        }
    },
    {
        method: 'GET',
        path: '/my-reviews-update/{id}',
        handler: handler.getReviewUpdateByIdHandler,
        options: {
            auth: 'makanyuk_jwt',
        }
    },
    {
        method: 'DELETE',
        path: '/reviews/{id}',
        handler: handler.deleteReviewByIdHandler,
        options: {
            auth: 'makanyuk_jwt',
        }
    },
    {
        method: 'PUT',
        path: '/reviews/{id}',
        handler: handler.updateReviewByIdHandler,
        options: {
            auth: 'makanyuk_jwt',
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
            }
        }
    },
];

module.exports = routes;