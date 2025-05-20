import { useState, useEffect } from 'react';
import { getClassesByDivision, DIVISIONS } from '../utils/constants';
import { createAttendance } from '../utils/api';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { Calendar, Save, Users } from 'lucide-react';

const TakeAttendance = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [totalStudents, setTotalStudents] = useState('');
  const [presentStudents, setPresentStudents] = useState('');
  const [absentRollNumbers, setAbsentRollNumbers] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [availableClasses, setAvailableClasses] = useState<Array<{id: string, name: string}>>([]);

  // Update available classes when division changes
  useEffect(() => {
    if (selectedDivision) {
      setAvailableClasses(getClassesByDivision(selectedDivision));
      setSelectedClass('');
    } else {
      setAvailableClasses([]);
    }
  }, [selectedDivision]);

  // Calculate absent count
  const absentCount = totalStudents && presentStudents 
    ? parseInt(totalStudents) - parseInt(presentStudents) 
    : 0;

  // Calculate attendance percentage
  const attendancePercentage = totalStudents && presentStudents && parseInt(totalStudents) > 0
    ? ((parseInt(presentStudents) / parseInt(totalStudents)) * 100).toFixed(2)
    : '0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClass || !date || !totalStudents || !presentStudents || !teacherName) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const attendanceData = {
        date: date.toISOString().split('T')[0],
        classId: selectedClass,
        totalStudents: parseInt(totalStudents),
        presentStudents: parseInt(presentStudents),
        absentStudents: absentCount,
        absentRollNumbers: absentRollNumbers.split(',').map(num => num.trim()),
        attendancePercentage: parseFloat(attendancePercentage),
        teacherName
      };
      
      await createAttendance(attendanceData);
      toast.success('Attendance recorded successfully');
      
      // Reset form
      setPresentStudents('');
      setAbsentRollNumbers('');
      setTeacherName('');
      
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error('Failed to record attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Take Attendance</h1>
      
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
              <label htmlFor="division" className="form-label">Division</label>
              <select
                id="division"
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select Division</option>
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
                required
                disabled={!selectedDivision}
              >
                <option value="">Select Class</option>
                {availableClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="totalStudents" className="form-label flex items-center">
                <Users size={16} className="mr-1" />
                Total Students
              </label>
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
                disabled={!totalStudents}
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
                  Submitting...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeAttendance;