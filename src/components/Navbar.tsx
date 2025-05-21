import { GraduationCap, LogOut } from 'lucide-react';
import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  children?: ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:h-16">
          <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center">
              {children}
              <div className="flex items-center ml-2 lg:ml-0">
                <GraduationCap className="h-8 w-8 text-blue-800 flex-shrink-0" />
                <h1 className="ml-2 text-sm sm:text-base lg:text-lg font-semibold text-blue-800 truncate max-w-[150px] sm:max-w-[300px] lg:max-w-none">
                  Sanskriti School
                </h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="sm:hidden inline-flex items-center px-2 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut size={14} className="mr-1" />
              Logout
            </button>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4 mt-2 sm:mt-0">
            <p className="text-sm text-gray-600">Attendance Management System</p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
