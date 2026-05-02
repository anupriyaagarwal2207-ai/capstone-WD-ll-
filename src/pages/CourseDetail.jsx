import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { courseService, userService } from '../services/api';
import { updateUserProgress } from '../store/slices/authSlice';
import VideoPlayer from '../components/VideoPlayer';
import { PlayCircle, CheckCircle, Lock, LayoutDashboard } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  const isEnrolled = user?.enrolledCourses?.includes(id);
  const progress = user?.progress?.find(p => p.courseId === id);
  const completedModules = progress?.completedModules || [];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await courseService.getById(id);
        setCourse(res.data);
        if (res.data.modules?.length > 0) {
          setActiveModule(res.data.modules[0]);
        }
      } catch (err) {
        setError('Course not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      const res = await courseService.enroll(id);
      // We would ideally fetch the user profile again or update state
      // For now we can refresh page or let dashboard handle it.
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  const handleMarkComplete = async (moduleId) => {
    try {
      const res = await userService.updateProgress(id, moduleId);
      dispatch(updateUserProgress(user.progress.map(p => p.courseId === id ? res.data : p)));
    } catch (err) {
      console.error('Failed to update progress', err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading course...</div>;
  if (error || !course) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="py-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Main Content Area */}
      <div className="flex-grow lg:w-2/3 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{course.title}</h1>
          <p className="text-slate-600 dark:text-slate-400">{course.description}</p>
        </div>

        {isEnrolled && activeModule ? (
          <div className="space-y-4">
            <VideoPlayer url={activeModule.videoUrl} />
            <div className="flex items-center justify-between bg-white dark:bg-dark-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-semibold text-lg">{activeModule.title}</h3>
                {activeModule.notes && <p className="text-sm text-slate-500 mt-1">{activeModule.notes}</p>}
              </div>
              <button
                onClick={() => handleMarkComplete(activeModule.id)}
                disabled={completedModules.includes(activeModule.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  completedModules.includes(activeModule.id)
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                {completedModules.includes(activeModule.id) ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video rounded-xl overflow-hidden group">
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <Lock className="w-16 h-16 text-white mb-4" />
              <p className="text-white text-lg font-medium mb-6">Enroll to unlock course content</p>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-70"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now for Free'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Playlist */}
      <div className="lg:w-1/3 flex-shrink-0">
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-24">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" /> Course Content
            </h2>
            {isEnrolled && progress && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{progress.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {course.modules?.map((module, idx) => (
              <button
                key={module.id}
                onClick={() => isEnrolled && setActiveModule(module)}
                className={`w-full flex items-start gap-3 p-4 text-left transition-colors ${
                  activeModule?.id === module.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'
                }`}
              >
                <div className="mt-0.5">
                  {completedModules.includes(module.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : isEnrolled ? (
                    <PlayCircle className={`w-5 h-5 ${activeModule?.id === module.id ? 'text-blue-600' : 'text-slate-400'}`} />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className={`font-medium ${activeModule?.id === module.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {idx + 1}. {module.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{module.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
