import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      path: '/',
      icon: <Home className="w-6 h-6" />,
      label: '复盘',
    },
    {
      path: '/anime',
      icon: <Film className="w-6 h-6" />,
      label: '影评',
    },
    {
      path: '/user',
      icon: <User className="w-6 h-6" />,
      label: '我的',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center px-4 py-2 transition-all duration-300 ${currentPath === item.path ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <div className={`transition-all duration-300 ${currentPath === item.path ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;