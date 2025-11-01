const FoodReviewsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'reviews',
    version: '1.0.0',
    register: async(server, { foodReviewsService, storageService, validator}) => {
        const foodReviewsHandler = new FoodReviewsHandler(foodReviewsService, storageService, validator);
        server.route(routes(foodReviewsHandler));
    }
};