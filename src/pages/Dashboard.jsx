import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userService } from '../services/api';
import { Link } from 'react-router-dom';
import { PlayCircle, Award, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const { user } = useSelector(state => state.auth);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await userService.getDashboard();
        setDashboardData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;
  if (!dashboardData) return null;

  const enrolledCourses = dashboardData.enrolledCourses || [];
  const completedCount = enrolledCourses.filter(c => c.progress === 100).length;
  
  const chartData = [
    { name: 'Completed', value: completedCount },
    { name: 'In Progress', value: enrolledCourses.length - completedCount },
  ];
  const COLORS = ['#10b981', '#3b82f6'];

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user.name}!</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Here's an overview of your learning progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Enrolled Courses</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{enrolledCourses.length}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Completed</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{completedCount}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-32 flex items-center justify-center">
           {enrolledCourses.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
           ) : (
             <p className="text-sm text-slate-400">No data yet</p>
           )}
        </div>
      </div>

      {/* Enrolled Courses List */}
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Courses</h2>
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-slate-800">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No courses yet</h3>
          <p className="text-slate-500 mb-6">Start exploring our catalog and enroll in your first course!</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => (
            <div key={course.id} className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
              <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-1">{course.title}</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1 text-slate-600 dark:text-slate-400">
                    <span>Progress</span>
                    <span className="font-medium text-slate-900 dark:text-white">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Link
                  to={`/course/${course.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 text-slate-900 dark:text-white font-medium py-2 rounded-lg transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  Continue Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
