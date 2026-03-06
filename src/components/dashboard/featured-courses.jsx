import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useGetCoursesQuery } from "@/actions/courseActions";

const FeaturedCourses = () => {
  const navigate = useNavigate();

  // Fetch courses
  const { data: coursesData, isLoading, error } = useGetCoursesQuery({});
  const featuredCourses = useMemo(() => {
    const courses = coursesData?.data || coursesData || [];
    return courses.slice(0, 9);
  }, [coursesData]);
  const marqueeDuration = useMemo(
    () => `${Math.max(featuredCourses.length * 5, 24)}s`,
    [featuredCourses.length]
  );

  const handleCourseClick = (course) => {
    navigate(`/courses/${course.slug || course._id}`);
  };

  const renderCourseCard = (course, keyPrefix = "item") => (
    <div
      key={`${keyPrefix}-${course._id || course.slug || course.title}`}
      onClick={() => handleCourseClick(course)}
      className="flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-96 cursor-pointer group/card"
    >
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden bg-gray-700 flex-shrink-0">
          <img
            src={
              course.thumbnail ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop"
            }
            alt={course.title}
            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {course.category && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                {course.category}
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-white font-bold !text-base !sm:text-lg mb-2 line-clamp-2 group-hover/card:text-blue-400 transition-colors">
            {course.title}
          </h3>
          {course.price !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">
                ₹{course.price}
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <>
                  <span className="text-gray-500 line-through text-sm">
                    ₹{course.originalPrice}
                  </span>
                  <span className="text-green-400 text-xs font-semibold">
                    {Math.round(
                      ((course.originalPrice - course.price) /
                        course.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 rounded w-64 mb-4"></div>
            <div className="h-4 rounded w-96 mb-8"></div>
            <div className="flex gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-80 h-64 rounded-xl flex-shrink-0"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-400">
            <p>Failed to load courses. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredCourses.length && !isLoading) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>No courses available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Interview Preparation
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-3xl">
            Build job-ready skills with our{" "}
            <span className="text-white font-semibold">
              Comprehensive Interview Preparation Bundle
            </span>{" "}
            that includes multiple courses like
          </p>
        </div>

        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div
            className="featured-marquee-track flex w-max hover:[animation-play-state:paused] motion-reduce:animate-none"
            style={{ "--marquee-duration": marqueeDuration }}
          >
            <div className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6">
              {featuredCourses.map((course) => renderCourseCard(course, "a"))}
            </div>
            <div
              className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6"
              aria-hidden="true"
            >
              {featuredCourses.map((course) => renderCourseCard(course, "b"))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .featured-marquee-track {
          animation: featuredMarquee var(--marquee-duration, 28s) linear infinite;
          will-change: transform;
        }

        @keyframes featuredMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedCourses;
