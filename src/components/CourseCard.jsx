import { Link } from 'react-router-dom';
import { PlayCircle, Clock } from 'lucide-react';

export default function CourseCard({ course }) {
  const totalDuration = course.modules?.reduce((acc, mod) => {
    const [min, sec] = mod.duration.split(':').map(Number);
    return acc + min + sec / 60;
  }, 0);

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col group">
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {course.category}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <PlayCircle className="w-4 h-4" />
            <span>{course.modules?.length || 0} Modules</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.round(totalDuration || 0)} mins</span>
          </div>
        </div>
        
        <Link 
          to={`/course/${course.id}`}
          className="mt-4 block w-full text-center bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 text-slate-900 dark:text-slate-100 font-semibold py-2.5 rounded-lg transition-colors"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}
