import { useState, useEffect } from 'react';
import { getAttendanceByDate } from '../utils/api';
import { CalendarDays, Users, Percent as Percentage, School } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageAttendance: 0,
    totalClasses: 0,
    todayPresent: 0,
    classWiseAttendance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await getAttendanceByDate(formattedDate);
        
        const attendanceData = response.data;
        const totalStudents = attendanceData.reduce((sum: number, record: any) => sum + record.totalStudents, 0);
        const presentStudents = attendanceData.reduce((sum: number, record: any) => sum + record.presentStudents, 0);
        const averageAttendance = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;
        
        setStats({
          totalStudents,
          averageAttendance,
          totalClasses: attendanceData.length,
          todayPresent: presentStudents,
          classWiseAttendance: attendanceData
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedDate]);

  const chartData = {
    labels: stats.classWiseAttendance.map((entry: any) => entry.classId),
    datasets: [
      {
        label: 'Attendance Percentage',
        data: stats.classWiseAttendance.map((entry: any) => entry.attendancePercentage),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      title: {
        display: true,
        text: 'Class-wise Attendance',
        font: {
          size: window.innerWidth < 768 ? 14 : 16
        }
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Attendance Percentage',
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Classes',
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      }
    },
  };

  return (
    <div className="animate-fade-in p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="form-group w-full sm:w-auto">
          <label htmlFor="date" className="form-label flex items-center text-sm sm:text-base">
            <CalendarDays size={16} className="mr-1" />
            Select Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date) => setSelectedDate(date)}
            className="form-input w-full sm:w-auto"
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            id="date"
          />
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="card flex items-center p-4 sm:p-6">
              <div className="p-3 rounded-full bg-blue-100 text-blue-800 mr-4">
                <Users size={window.innerWidth < 768 ? 20 : 24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-xl sm:text-2xl font-semibold">{stats.totalStudents}</p>
              </div>
            </div>
            
            <div className="card flex items-center p-4 sm:p-6">
              <div className="p-3 rounded-full bg-green-100 text-green-800 mr-4">
                <Percentage size={window.innerWidth < 768 ? 20 : 24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Attendance</p>
                <p className="text-xl sm:text-2xl font-semibold">{stats.averageAttendance.toFixed(2)}%</p>
              </div>
            </div>
            
            <div className="card flex items-center p-4 sm:p-6">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-800 mr-4">
                <CalendarDays size={window.innerWidth < 768 ? 20 : 24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Present Today</p>
                <p className="text-xl sm:text-2xl font-semibold">{stats.todayPresent}</p>
              </div>
            </div>
            
            <div className="card flex items-center p-4 sm:p-6">
              <div className="p-3 rounded-full bg-purple-100 text-purple-800 mr-4">
                <School size={window.innerWidth < 768 ? 20 : 24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-xl sm:text-2xl font-semibold">{stats.totalClasses}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="card lg:col-span-2 p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Class-wise Attendance</h2>
              <div className="h-[300px] sm:h-[400px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="card p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3 sm:space-y-4">
                <a 
                  href="/take-attendance" 
                  className="block w-full py-2.5 sm:py-3 px-4 bg-blue-800 text-white text-center rounded-md hover:bg-blue-900 transition-colors text-sm sm:text-base"
                >
                  Take Today's Attendance
                </a>
                <a 
                  href="/view-reports" 
                  className="block w-full py-2.5 sm:py-3 px-4 bg-slate-100 text-slate-800 text-center rounded-md hover:bg-slate-200 transition-colors text-sm sm:text-base"
                >
                  View Recent Reports
                </a>
                <a 
                  href="/download-reports" 
                  className="block w-full py-2.5 sm:py-3 px-4 bg-slate-100 text-slate-800 text-center rounded-md hover:bg-slate-200 transition-colors text-sm sm:text-base"
                >
                  Download Reports
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
