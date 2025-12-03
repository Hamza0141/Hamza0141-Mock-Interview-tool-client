import React from 'react';

const Rating = ({ rating, isCountNumberShow }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="rating">
            {[...Array(fullStars)].map((_, index) => (
                <i key={`full-${index}`} className="bx bxs-star" />
            ))}
            {halfStar && <i className="bx bxs-star-half" />}
            {[...Array(emptyStars)].map((_, index) => (
                <i key={`empty-${index}`} className="bx bx-star" />
            ))}
            {isCountNumberShow && <span>{rating.toFixed(1)}</span>}
        </div>
    );
};

export default Rating;
