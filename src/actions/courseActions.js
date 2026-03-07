import { baseApi } from "../store/api/baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all courses with optional filters
    getCourses: builder.query({
      query: (filters = {}) => {
        let queryString = "course/get-all-courses";
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.category) params.append("category", filters.category);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.priceMin !== undefined)
          params.append("priceMin", filters.priceMin);
        if (filters.priceMax !== undefined)
          params.append("priceMax", filters.priceMax);

        const paramsString = params.toString();
        if (paramsString) {
          queryString += `?${paramsString}`;
        }

        return queryString;
      },
      providesTags: ["getCourses"],
    }),

    // Get a single course by ID
    getCourseById: builder.query({
      query: (id) => `course/get-course/${id}`,
      providesTags: ["getCourseById"],
    }),

    // Add review to a course
    addReview: builder.mutation({
      query: ({ courseId, rating, comment }) => ({
        url: `course/add-reviews/${courseId}`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: ["getCourseById", "getAllReviews"],
    }),

    // Get all reviews
    getAllReviews: builder.query({
      query: () => "course/get-all-reviews",
      providesTags: ["getAllReviews"],
    }),

    // Get sections with lectures for a course
    getCourseSections: builder.query({
      query: (courseId) => `course/${courseId}/sections`,
      providesTags: ["getCourseSections"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useAddReviewMutation,
  useGetAllReviewsQuery,
  useGetCourseSectionsQuery,
} = courseApi;
