import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAttendanceById } from '../utils/api';
import { getClassById } from '../utils/constants';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const ViewAttendance = () => {
  const { id } = useParams();
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await getAttendanceById(id!);
        setAttendance(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance details');
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Attendance record not found</p>
        <Link to="/view-reports" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Back to Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to="/view-reports" className="text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Details</h1>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(attendance.date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Class</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {getClassById(attendance.classId)?.name || attendance.classId}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Teacher</dt>
                <dd className="mt-1 text-sm text-gray-900">{attendance.teacherName}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Attendance Summary</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Students</dt>
                <dd className="mt-1 text-sm text-gray-900">{attendance.totalStudents}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Present Students</dt>
                <dd className="mt-1 text-sm text-gray-900">{attendance.presentStudents}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Absent Students</dt>
                <dd className="mt-1 text-sm text-gray-900">{attendance.absentStudents}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Attendance Percentage</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {attendance.attendancePercentage.toFixed(2)}%
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {attendance.absentRollNumbers && attendance.absentRollNumbers.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Absent Students</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                Roll Numbers: {attendance.absentRollNumbers.join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance; 