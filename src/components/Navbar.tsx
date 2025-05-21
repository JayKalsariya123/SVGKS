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
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {children}
            <div className="flex items-center ml-2 lg:ml-0">
              <GraduationCap className="h-8 w-8 text-blue-800 flex-shrink-0" />
              <h1 className="ml-2 text-base sm:text-lg lg:text-xl font-semibold text-blue-800 truncate max-w-[200px] sm:max-w-[300px] lg:max-w-none">
                Sanskriti School, Vidyamanjari Gyanpeeth Campus, Sihor
              </h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <p className="text-sm text-gray-600">Attendance Management System</p>
          </div>
          <div className="flex items-center">
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
