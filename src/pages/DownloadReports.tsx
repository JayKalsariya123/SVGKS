import { useState, useEffect, useRef } from 'react';
import { DIVISIONS, getClassesByDivision } from '../utils/constants';
import DatePicker from 'react-datepicker';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Calendar, Download, FileText, Printer } from 'lucide-react';
import { getAttendanceByDateRange } from '../utils/api';
import { toast } from 'react-toastify';

const DownloadReports = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [reportFormat, setReportFormat] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  
  const tableRef = useRef<HTMLTableElement>(null);
  
  useEffect(() => {
    fetchAttendanceData();
  }, [startDate, endDate, selectedDivision, selectedClass]);

  const fetchAttendanceData = async () => {
    if (!startDate || !endDate) return;

    try {
      setLoading(true);
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      const response = await getAttendanceByDateRange(formattedStartDate, formattedEndDate);
      let data = response.data;

      if (selectedDivision) {
        const classesInDivision = getClassesByDivision(selectedDivision);
        const classIds = classesInDivision.map(c => c.id);
        data = data.filter((item: any) => classIds.includes(item.classId));
      }

      if (selectedClass) {
        data = data.filter((item: any) => item.classId === selectedClass);
      }

      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };
  
  const generatePDF = () => {
    if (!attendanceData.length) {
      toast.error('No data available to generate PDF');
      return;
    }

    setLoading(true);
    
    try {
      const doc = new jsPDF();
      
      doc.setProperties({
        title: 'Attendance Report',
        subject: 'School Attendance Report',
        author: 'sanskruti School, Vidyamanjari Gyanpeeth Campus, Sihor',
        creator: 'Attendance System'
      });
      
      doc.setFontSize(20);
      doc.text('sanskruti School, Vidyamanjari Gyanpeeth Campus, Sihor', 105, 15, { align: 'center' });
      doc.setFontSize(14);
      doc.text('Attendance Report', 105, 25, { align: 'center' });
      
      doc.setFontSize(10);
      const dateRange = `Period: ${startDate?.toLocaleDateString()} to ${endDate?.toLocaleDateString()}`;
      const divisionText = selectedDivision ? `Division: ${selectedDivision}` : 'All Divisions';
      const classText = selectedClass ? `Class: ${getClassesByDivision(selectedDivision).find(cls => cls.id === selectedClass)?.name}` : 'All Classes';
      
      doc.text(dateRange, 15, 35);
      doc.text(divisionText, 15, 40);
      doc.text(classText, 15, 45);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 50);
      
      if (reportFormat === 'summary' || reportFormat === 'detailed') {
        const headers = reportFormat === 'summary' 
          ? ['Date', 'Class', 'Total', 'Present', 'Absent', '%', 'Teacher']
          : ['Date', 'Class', 'Total', 'Present', 'Absent', '%', 'Absent Roll Numbers', 'Teacher'];

        const rows = attendanceData.map(item => {
          const baseRow = [
            new Date(item.date).toLocaleDateString(),
            item.classId,
            item.totalStudents,
            item.presentStudents,
            item.absentStudents,
            `${item.attendancePercentage.toFixed(2)}%`,
            item.teacherName
          ];

          if (reportFormat === 'detailed') {
            baseRow.splice(6, 0, item.absentRollNumbers.join(', '));
          }

          return baseRow;
        });

        autoTable(doc, {
          startY: 60,
          head: [headers],
          body: rows,
          theme: 'grid',
          styles: { fontSize: reportFormat === 'detailed' ? 8 : 9, cellPadding: 2 },
          headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] }
        });
      } else {
        // Template format
        doc.setFontSize(16);
        doc.text('sanskruti School, Vidyamanjari Gyanpeeth Campus, Sihor, Vidyanagari Gnanbhid Campus-Siddhar', 105, 70, { align: 'center' });
        
        doc.setFontSize(14);
        doc.text('Daily Attendance Report', 105, 80, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Academic Year: ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`, 20, 90);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 90);

        // Group data by division and class
        const groupedData = attendanceData.reduce((acc: any, curr: any) => {
          const division = getClassesByDivision(selectedDivision).find(c => c.id === curr.classId)?.division;
          if (!acc[division]) acc[division] = {};
          acc[division][curr.classId] = curr;
          return acc;
        }, {});

        // Generate division-specific tables
        Object.entries(groupedData).forEach(([division, classes]: [string, any], index) => {
          const classIds = Object.keys(classes);
          const headers = ['#', 'Details', ...classIds, 'Total'];
          
          const rows = [
            ['1', 'Present Count'],
            ['2', 'Absent Count'],
            ['3', 'Total Count'],
            ['4', 'Absent Roll Numbers'],
            ['5', 'Percentage'],
            ['6', 'Teacher Signature']
          ];

          // Fill in the data
          classIds.forEach(classId => {
            const data = classes[classId];
            rows[0].push(data.presentStudents.toString());
            rows[1].push(data.absentStudents.toString());
            rows[2].push(data.totalStudents.toString());
            rows[3].push(data.absentRollNumbers.join(', '));
            rows[4].push(`${data.attendancePercentage.toFixed(2)}%`);
            rows[5].push('');
          });

          // Add totals
          rows[0].push(Object.values(classes).reduce((sum: number, c: any) => sum + c.presentStudents, 0).toString());
          rows[1].push(Object.values(classes).reduce((sum: number, c: any) => sum + c.absentStudents, 0).toString());
          rows[2].push(Object.values(classes).reduce((sum: number, c: any) => sum + c.totalStudents, 0).toString());
          rows[3].push('');
          rows[4].push(`${(Object.values(classes).reduce((sum: number, c: any) => sum + c.attendancePercentage, 0) / classIds.length).toFixed(2)}%`);
          rows[5].push('');

          autoTable(doc, {
            startY: index === 0 ? 100 : doc.previousAutoTable.finalY + 10,
            head: [headers],
            body: rows,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 3, halign: 'center' },
            headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
            columnStyles: {
              0: { cellWidth: 10 },
              1: { cellWidth: 35, halign: 'left' }
            }
          });
        });
      }
      
      doc.save('Attendance_Report.pdf');
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrint = () => {
    if (!tableRef.current) {
      toast.error('No data available to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Attendance Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1, h2 { text-align: center; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
              th { background-color: #1e3a8a; color: white; }
              .metadata { margin-bottom: 20px; }
              .metadata p { margin: 5px 0; }
            </style>
          </head>
          <body>
            <h1>sanskruti School, Vidyamanjari Gyanpeeth Campus, Sihor</h1>
            <h2>Attendance Report</h2>
            <div class="metadata">
              <p>Period: ${startDate?.toLocaleDateString()} to ${endDate?.toLocaleDateString()}</p>
              <p>${selectedDivision ? `Division: ${selectedDivision}` : 'All Divisions'}</p>
              <p>${selectedClass ? `Class: ${getClassesByDivision(selectedDivision).find(cls => cls.id === selectedClass)?.name}` : 'All Classes'}</p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            ${tableRef.current.outerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.setTimeout(function() {
                  window.close();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Download Attendance Reports</h1>
      
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Generate Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="form-group">
            <label htmlFor="reportFormat" className="form-label">Report Format</label>
            <select
              id="reportFormat"
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className="form-select"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="template">School Template Format</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={generatePDF}
            className="btn btn-primary flex items-center"
            disabled={loading || !attendanceData.length}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                Download PDF
              </>
            )}
          </button>
          
          <button
            onClick={handlePrint}
            className="btn btn-secondary flex items-center"
            disabled={!attendanceData.length}
          >
            <Printer size={18} className="mr-2" />
            Print Report
          </button>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FileText size={18} className="mr-2" />
          Preview Report
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : attendanceData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No attendance records found for the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table ref={tableRef} className="min-w-full divide-y divide-gray-200 border text-sm">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2">Class</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Present</th>
                  <th className="px-4 py-2">Absent</th>
                  <th className="px-4 py-2">Percentage</th>
                  {reportFormat === 'detailed' && (
                    <th className="px-4 py-2">Absent Roll Numbers</th>
                  )}
                  <th className="px-4 py-2">Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceData.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-2 border">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border text-center">{item.classId}</td>
                    <td className="px-4 py-2 border text-center">{item.totalStudents}</td>
                    <td className="px-4 py-2 border text-center">{item.presentStudents}</td>
                    <td className="px-4 py-2 border text-center">{item.absentStudents}</td>
                    <td className="px-4 py-2 border text-center">{item.attendancePercentage.toFixed(2)}%</td>
                    {reportFormat === 'detailed' && (
                      <td className="px-4 py-2 border text-center">{item.absentRollNumbers.join(', ')}</td>
                    )}
                    <td className="px-4 py-2 border text-center">{item.teacherName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadReports;
