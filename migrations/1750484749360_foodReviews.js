
exports.up = (pgm) => {
    pgm.createTable('food_reviews', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        description: {
            type: 'TEXT',
            notNull: true,
        },
        photo_url: {
            type: 'TEXT',
            notNull: true,
        },
        rating: {
            type: 'FLOAT',
            notNull: true,
        },
        latitude: {
            type: 'DOUBLE PRECISION',
            notNull: true,
        },
        longitude: {
            type: 'DOUBLE PRECISION',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP WITH TIME ZONE',
            default: pgm.func('CURRENT_TIMESTAMP'),
            notNull: true,
        }
    });

    pgm.addConstraint('food_reviews', 'fk_food_reviews_user_id.user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('food_reviews');
};
