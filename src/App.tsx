import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TakeAttendance from './pages/TakeAttendance';
import ViewReports from './pages/ViewReports';
import EditAttendance from './pages/EditAttendance';
import DownloadReports from './pages/DownloadReports';
import ViewAttendance from './pages/ViewAttendance';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="take-attendance" element={<TakeAttendance />} />
        <Route path="view-reports" element={<ViewReports />} />
        <Route path="edit-attendance/:id" element={<EditAttendance />} />
        <Route path="view-attendance/:id" element={<ViewAttendance />} />
        <Route path="download-reports" element={<DownloadReports />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;