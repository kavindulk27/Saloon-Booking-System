import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Review } from '../types';
import { mockReviews } from '../utils/mockData';

interface ReviewState {
    reviews: Review[];
    addReview: (review: Review) => void;
    getServiceAverage: (serviceId: string) => number;
    getServiceReviewCount: (serviceId: string) => number;
    getServiceReviews: (serviceId: string) => Review[];
    getStaffAverage: (staffId: string) => number;
    getStaffReviewCount: (staffId: string) => number;
}

export const useReviewStore = create<ReviewState>()(
    persist(
        (set, get) => ({
            reviews: [...mockReviews],

            addReview: (review) => {
                set(state => ({ reviews: [review, ...state.reviews] }));
            },

            getServiceAverage: (serviceId) => {
                const serviceReviews = get().reviews.filter(r => r.serviceId === serviceId);
                if (serviceReviews.length === 0) return 0;
                const total = serviceReviews.reduce((acc, r) => acc + r.rating, 0);
                return total / serviceReviews.length;
            },

            getServiceReviewCount: (serviceId) => {
                return get().reviews.filter(r => r.serviceId === serviceId).length;
            },

            getServiceReviews: (serviceId) => {
                return get().reviews.filter(r => r.serviceId === serviceId);
            },

            getStaffAverage: (staffId) => {
                const staffReviews = get().reviews.filter(r => r.staffId === staffId);
                if (staffReviews.length === 0) return 0;
                const total = staffReviews.reduce((acc, r) => acc + r.rating, 0);
                return total / staffReviews.length;
            },

            getStaffReviewCount: (staffId) => {
                return get().reviews.filter(r => r.staffId === staffId).length;
            },
        }),
        {
            name: 'saloon-reviews',
        }
    )
);
