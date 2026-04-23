const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mappingDBfoodReviews } = require('../../utils/index');

class FoodReviewsService {
    constructor() {
        this._pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
        });
    }

    async addReview(userId, {title, description, photoUrl, rating, lat, lon }) {
        const id = `review-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO food_reviews (id, user_id, title, description, photo_url, rating, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING * ',
            values: [id, userId, title, description, photoUrl, rating, lat, lon],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Review gagal ditambahkan.');
        }

        return mappingDBfoodReviews(result.rows[0]);
    }

    async getAllReviews() {
        const result = await this._pool.query('SELECT food_reviews.*, users.username FROM food_reviews JOIN users ON food_reviews.user_id = users.id');
        return result.rows.map(mappingDBfoodReviews);
    }

    async getReviewById(id) {
        const query = {
            text: 'SELECT food_reviews.*, users.username FROM food_reviews JOIN users ON food_reviews.user_id = users.id WHERE food_reviews.id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Id tidak ditemukan!.');
        }

        return mappingDBfoodReviews(result.rows[0]);
    }

    async getReviewByUserId(userId) {
        const query = {
            text: 'SELECT food_reviews.*, users.username FROM food_reviews JOIN users ON food_reviews.user_id = users.id WHERE food_reviews.user_id = $1 ORDER BY food_reviews.created_at DESC',
            values: [userId],
        };
        const result = await this._pool.query(query);

        return result.rows.map(mappingDBfoodReviews);
    }

    async deleteReviewById(id) {
        const query = {
            text: 'DELETE FROM food_reviews WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Review Gagal dihapus, Id tidak ditemukan');
        }
    }

    async updateReviewById(id, { title, description, rating, lat, lon}) {
        const query = {
            text: `UPDATE food_reviews SET title = $1, description = $2, rating = $3, latitude = $4, longitude = $5, created_at = NOW() WHERE id = $6 RETURNING id `,
            values: [title, description, rating, lat, lon, id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Review Gagal diperbarui, Id tidak ditemukan')
        }

        return mappingDBfoodReviews(result.rows[0]);
    }

    async getReviewUpdateById(id) {
        const query = {
            text: 'SELECT food_reviews.id, food_reviews.user_id, food_reviews.title, food_reviews.description, food_reviews.rating, food_reviews.latitude, food_reviews.longitude, food_reviews.created_at, users.username FROM food_reviews JOIN users ON food_reviews.user_id = users.id WHERE food_reviews.id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Id tidak ditemukan!.');
        }

        return mappingDBfoodReviews(result.rows[0]);
    }

}

module.exports = FoodReviewsService;