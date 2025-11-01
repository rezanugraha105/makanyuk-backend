const mappingDBfoodReviews = ({
    id,
    username,
    user_id,
    title,
    description,
    photo_url,
    rating,
    latitude,
    longitude,
    created_at,
}) => ({
    id: id,
    username: username,
    userId: user_id,
    title: title,
    description: description,
    photoUrl: photo_url,
    rating: rating,
    lat: latitude,
    lon: longitude,
    createdAt: created_at,
});

module.exports = {
    mappingDBfoodReviews
};