import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess: (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    },
    fetchCoursesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchEnrolledCoursesSuccess: (state, action) => {
      state.enrolledCourses = action.payload;
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    }
  },
});

export const { 
  fetchCoursesStart, 
  fetchCoursesSuccess, 
  fetchCoursesFailure,
  fetchEnrolledCoursesSuccess,
  setCurrentCourse
} = courseSlice.actions;

export default courseSlice.reducer;
