import { GraduationCap } from 'lucide-react';
import { ReactNode } from 'react';

interface NavbarProps {
  children?: ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;