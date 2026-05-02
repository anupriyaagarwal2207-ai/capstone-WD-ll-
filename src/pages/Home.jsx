import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoursesStart, fetchCoursesSuccess, fetchCoursesFailure } from '../store/slices/courseSlice';
import { courseService } from '../services/api';
import CourseCard from '../components/CourseCard';
import { useDebounce } from '../hooks/useDebounce';
import { Search } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector(state => state.courses);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchCourses = async () => {
      dispatch(fetchCoursesStart());
      try {
        const response = await courseService.getAll(debouncedSearch);
        dispatch(fetchCoursesSuccess(response.data));
      } catch (err) {
        dispatch(fetchCoursesFailure(err.message));
      }
    };
    fetchCourses();
  }, [dispatch, debouncedSearch]);

  return (
    <div className="py-8">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Level Up Your <span className="text-blue-600 dark:text-blue-500">Skills</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore our premium courses and start learning today. Build your future with the best instructors.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12 relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by title or category..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border-none shadow-lg bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-shadow outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-slate-500 dark:text-slate-400 mt-12">
          <p className="text-xl">No courses found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
