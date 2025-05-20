import { useState, useEffect } from 'react';
import { getAttendanceByDateRange, deleteAttendance } from '../utils/api';
import { getClassById, DIVISIONS, getClassesByDivision } from '../utils/constants';
import DatePicker from 'react-datepicker';
import { Calendar, Filter, Edit2, Trash2, Eye, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewReports = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!startDate || !endDate) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        const response = await getAttendanceByDateRange(formattedStartDate, formattedEndDate);
        setAttendanceData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchAttendance();
  }, [startDate, endDate]);
  
  // Apply filters
  useEffect(() => {
    if (!attendanceData.length) return;
    
    let filtered = [...attendanceData];
    
    // Filter by division
    if (selectedDivision) {
      const classesInDivision = getClassesByDivision(selectedDivision);
      const classIds = classesInDivision.map(c => c.id);
      filtered = filtered.filter(item => classIds.includes(item.classId));
    }
    
    // Filter by specific class
    if (selectedClass) {
      filtered = filtered.filter(item => item.classId === selectedClass);
    }
    
    setFilteredData(filtered);
  }, [selectedDivision, selectedClass, attendanceData]);
  
  const getClassName = (classId: string) => {
    const classInfo = getClassById(classId);
    return classInfo ? classInfo.name : classId;
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await deleteAttendance(id);
    setAttendanceData(prev => prev.filter(item => item._id !== id));
    setFilteredData(prev => prev.filter(item => item._id !== id));
        toast.success('Attendance record deleted successfully');
      } catch (error) {
        console.error('Error deleting attendance:', error);
        toast.error('Failed to delete attendance record');
      }
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">View Attendance Reports</h1>
      
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Filter size={18} className="mr-2" />
          Filter Reports
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label flex items-center">
              <Calendar size={16} className="mr-1" />
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="form-input"
              dateFormat="yyyy-MM-dd"
              id="startDate"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate" className="form-label flex items-center">
              <Calendar size={16} className="mr-1" />
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="form-input"
              dateFormat="yyyy-MM-dd"
              id="endDate"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="division" className="form-label">Division</label>
            <select
              id="division"
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedClass('');
              }}
              className="form-select"
            >
              <option value="">All Divisions</option>
              {Object.values(DIVISIONS).map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="class" className="form-label">Class</label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-select"
              disabled={!selectedDivision}
            >
              <option value="">All Classes</option>
              {selectedDivision && getClassesByDivision(selectedDivision).map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button 
            className="btn btn-primary flex items-center"
            onClick={() => {
              // Refresh data with filters
              // In a real app, we might call the API with filter params
            }}
          >
            <Search size={18} className="mr-2" />
            Apply Filters
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div className="table-container">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No attendance records found for the selected filters
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getClassName(record.classId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.presentStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.absentStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.attendancePercentage.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/edit-attendance/${record._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                        <Link
                          to={`/view-attendance/${record._id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewReports;