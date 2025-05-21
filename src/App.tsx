import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import TakeAttendance from './pages/TakeAttendance';
import ViewReports from './pages/ViewReports';
import DownloadReports from './pages/DownloadReports';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EditAttendance from './pages/EditAttendance';
import ViewAttendance from './pages/ViewAttendance';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      
        <div className="min-h-screen bg-gray-100">
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="take-attendance" element={<ProtectedRoute><TakeAttendance /></ProtectedRoute>} />
              <Route path="view-reports" element={<ProtectedRoute><ViewReports /></ProtectedRoute>} />
              <Route path="edit-attendance/:id" element={<ProtectedRoute><EditAttendance /></ProtectedRoute>} />
              <Route path="view-attendance/:id" element={<ProtectedRoute><ViewAttendance /></ProtectedRoute>} />
              <Route path="download-reports" element={<ProtectedRoute><DownloadReports /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      
    </AuthProvider>
  );
}

export default App;
