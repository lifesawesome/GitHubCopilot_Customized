import { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';

interface Review {
    id: number;
    productName: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
}

const SAMPLE_REVIEWS: Review[] = [
    {
        id: 1,
        productName: 'SmartFeeder One',
        customerName: 'Whiskers McFluff',
        rating: 5,
        comment: 'My cat absolutely loves this! The AI scheduling is purr-fect.',
        date: '2026-05-10',
    },
    {
        id: 2,
        productName: 'AutoClean Litter Dome',
        customerName: 'Tabby Johnson',
        rating: 4,
        comment: 'Great self-cleaning action. Wish it was a bit quieter though.',
        date: '2026-05-15',
    },
    {
        id: 3,
        productName: 'CatFlix Entertainment Portal',
        customerName: 'Paws McGee',
        rating: 5,
        comment: 'Hours of entertainment for my indoor cats. Worth every penny!',
        date: '2026-05-20',
    },
    {
        id: 4,
        productName: 'PawTrack Smart Collar',
        customerName: 'Felix Underhill',
        rating: 3,
        comment: 'Tracking works well but battery life could be better.',
        date: '2026-06-01',
    },
];

interface StarRatingProps {
    rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    return (
        <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <div className="rounded-lg shadow-md p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {review.productName}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
            </div>
            <StarRating rating={review.rating} />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">— {review.customerName}</p>
        </div>
    );
};

export default function CustomerReviews() {
    const { darkMode } = useTheme();
    const [filterRating, setFilterRating] = useState<number | null>(null);

    const filteredReviews = filterRating
        ? SAMPLE_REVIEWS.filter((r) => r.rating === filterRating)
        : SAMPLE_REVIEWS;

    const averageRating =
        SAMPLE_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / SAMPLE_REVIEWS.length;

    return (
        <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Customer Reviews
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Average rating: {averageRating.toFixed(1)} / 5 ({SAMPLE_REVIEWS.length} reviews)
                </p>

                <div className="flex gap-2 mb-6 flex-wrap">
                    <button
                        onClick={() => setFilterRating(null)}
                        className={`px-3 py-1 text-sm rounded-full border ${
                            filterRating === null
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        All
                    </button>
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setFilterRating(rating)}
                            className={`px-3 py-1 text-sm rounded-full border ${
                                filterRating === rating
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {rating} ★
                        </button>
                    ))}
                </div>

                {filteredReviews.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No reviews match this filter.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
