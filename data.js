const users = [
  { id: '1', name: 'Student User', email: 'student@test.com', password: 'password', role: 'student', enrolledCourses: ['c1'], progress: [{ courseId: 'c1', completedModules: ['m1'], progressPercentage: 50 }] },
  { id: '2', name: 'Admin User', email: 'admin@test.com', password: 'password', role: 'admin', enrolledCourses: [], progress: [] }
];

const courses = [
  {
    id: 'c1',
    title: 'React for Beginners',
    description: 'Learn the basics of React, hooks, and state management.',
    category: 'Development',
    instructor: 'Admin User',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    modules: [
      { id: 'm1', title: 'Introduction to React', videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', duration: '10:00', notes: 'Welcome to React' },
      { id: 'm2', title: 'State and Props', videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', duration: '15:00', notes: 'Understanding state' }
    ]
  },
  {
    id: 'c2',
    title: 'Advanced UI Design',
    description: 'Master TailwindCSS and Framer Motion for beautiful web apps.',
    category: 'Design',
    instructor: 'Admin User',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    modules: [
      { id: 'm3', title: 'Design Systems', videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', duration: '20:00', notes: 'Building a design system' }
    ]
  }
];

module.exports = { users, courses };
