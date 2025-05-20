import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAttendanceById, updateAttendance } from '../utils/api';
import { getClassById } from '../utils/constants';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { Calendar, Save, ArrowLeft } from 'lucide-react';

const EditAttendance = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | null>(new Date());
  const [className, setClassName] = useState('');
  const [classId, setClassId] = useState('');
  const [totalStudents, setTotalStudents] = useState('');
  const [presentStudents, setPresentStudents] = useState('');
  const [absentRollNumbers, setAbsentRollNumbers] = useState('');
  const [teacherName, setTeacherName] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate absent count
  const absentCount = totalStudents && presentStudents 
    ? parseInt(totalStudents) - parseInt(presentStudents) 
    : 0;

  // Calculate attendance percentage
  const attendancePercentage = totalStudents && presentStudents && parseInt(totalStudents) > 0
    ? ((parseInt(presentStudents) / parseInt(totalStudents)) * 100).toFixed(2)
    : '0.00';
  
  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // In a real app, we would fetch from API
        // For now, we'll use mock data
        const mockData = {
          _id: id,
          date: '2025-06-02',
          classId: '8-a',
          totalStudents: 50,
          presentStudents: 48,
          absentStudents: 2,
          absentRollNumbers: [12, 33],
          attendancePercentage: 96.0,
          teacherName: 'Mr. Sharma'
        };
        
        const classInfo = getClassById(mockData.classId);
        
        setDate(new Date(mockData.date));
        setClassId(mockData.classId);
        setClassName(classInfo ? classInfo.name : mockData.classId);
        setTotalStudents(mockData.totalStudents.toString());
        setPresentStudents(mockData.presentStudents.toString());
        setAbsentRollNumbers(mockData.absentRollNumbers.join(', '));
        setTeacherName(mockData.teacherName);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchAttendance();
  }, [id]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !totalStudents || !presentStudents || !teacherName) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const attendanceData = {
        date: date.toISOString().split('T')[0],
        classId,
        totalStudents: parseInt(totalStudents),
        presentStudents: parseInt(presentStudents),
        absentStudents: absentCount,
        absentRollNumbers: absentRollNumbers.split(',').map(num => num.trim()),
        attendancePercentage: parseFloat(attendancePercentage),
        teacherName
      };
      
      // In a real app, we would call API
      // await updateAttendance(id!, attendanceData);
      
      toast.success('Attendance updated successfully');
      navigate('/view-reports');
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Attendance</h1>
        <button
          onClick={() => navigate('/view-reports')}
          className="btn btn-secondary flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Reports
        </button>
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
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="date" className="form-label flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Date
                </label>
                <DatePicker
                  selected={date}
                  onChange={(date: Date) => setDate(date)}
                  className="form-input"
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  id="date"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="class" className="form-label">Class</label>
                <input
                  type="text"
                  id="class"
                  value={className}
                  className="form-input"
                  readOnly
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="totalStudents" className="form-label">Total Students</label>
                <input
                  type="number"
                  id="totalStudents"
                  value={totalStudents}
                  onChange={(e) => setTotalStudents(e.target.value)}
                  className="form-input"
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="presentStudents" className="form-label">Present Students</label>
                <input
                  type="number"
                  id="presentStudents"
                  value={presentStudents}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    const total = parseInt(totalStudents);
                    if (!totalStudents || isNaN(total)) {
                      toast.error('Please enter total students first');
                      return;
                    }
                    if (value > total) {
                      toast.error('Present students cannot exceed total students');
                      return;
                    }
                    setPresentStudents(e.target.value);
                  }}
                  className="form-input"
                  min="0"
                  max={totalStudents || 0}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="absentCount" className="form-label">Absent Students</label>
                <input
                  type="number"
                  id="absentCount"
                  value={absentCount}
                  className="form-input"
                  readOnly
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="absentRollNumbers" className="form-label">
                  Absent Roll Numbers (comma separated)
                </label>
                <input
                  type="text"
                  id="absentRollNumbers"
                  value={absentRollNumbers}
                  onChange={(e) => setAbsentRollNumbers(e.target.value)}
                  className="form-input"
                  placeholder="e.g. 5, 12, 15, 22"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="percentage" className="form-label">Attendance Percentage</label>
                <input
                  type="text"
                  id="percentage"
                  value={`${attendancePercentage}%`}
                  className="form-input"
                  readOnly
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teacherName" className="form-label">Teacher Name</label>
                <input
                  type="text"
                  id="teacherName"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Update Attendance
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditAttendance;