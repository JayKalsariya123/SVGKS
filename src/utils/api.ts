import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Classes
export const getClasses = () => api.get('/classes');
export const getClassById = (id: string) => api.get(`/classes/${id}`);
export const createClass = (data: any) => api.post('/classes', data);
export const updateClass = (id: string, data: any) => api.put(`/classes/${id}`, data);
export const deleteClass = (id: string) => api.delete(`/classes/${id}`);
export const getClassesByDivision = (division: string) => api.get(`/classes/division/${division}`);

// Attendance
export const createAttendance = (data: any) => api.post('/attendance', data);
export const getAttendanceById = (id: string) => api.get(`/attendance/${id}`);
export const updateAttendance = (id: string, data: any) => api.put(`/attendance/${id}`, data);
export const deleteAttendance = (id: string) => api.delete(`/attendance/${id}`);
export const getAttendanceByDate = (date: string) => api.get(`/attendance/date/${date}`);
export const getAttendanceByClass = (classId: string) => api.get(`/attendance/class/${classId}`);
export const getAttendanceByDateAndClass = (date: string, classId: string) => 
  api.get(`/attendance/date/${date}/class/${classId}`);
export const getAttendanceStats = () => api.get('/attendance/stats');
export const getAttendanceByDateRange = (startDate: string, endDate: string) => 
  api.get(`/attendance/range/${startDate}/${endDate}`);

// Reports
export const generateReport = (filters: any) => api.post('/reports/generate', filters);
export const getReportById = (id: string) => api.get(`/reports/${id}`);
export const getAllReports = () => api.get('/reports');

export default api;