const authentications = require('../api/authentications');
const users = require('../api/users');
const reviews = require('../api/reviews');
const AuthenticationsService = require('../services/postgres/AuthenticationsService');
const UsersService = require('../services/postgres/UsersService');
const FoodReviewsService = require ('../services/postgres/FoodReviewsService');
const StorageService = require('../services/storage/storageService');
const TokenManager = require('../tokenize/TokenManager');
const AuthenticationsValidator = require('../validator/authentications'); 
const UsersValidator = require('../validator/users');
const foodReviewsValidator = require('../validator/reviews');
const path = require('path');


const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();
const foodReviewsService = new FoodReviewsService();
const storageService = new StorageService(path.resolve(process.cwd(), 'src/api/reviews/file/images'));

module.exports = [
    {
        plugin: users,
        options: {
            service: usersService,
            validator: UsersValidator,
        }
    },
    {
        plugin: authentications,
        options: {
            authenticationsService,
            usersService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator,
        }
    },
    {
        plugin: reviews,
        options: {
            foodReviewsService,
            storageService,
            validator: foodReviewsValidator,
        }
    }
];