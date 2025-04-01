import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavItemProps {
  label: string;
  active?: boolean;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({ label, active = false, href }) => {
  return (
    <Link href={href}>
      <div className={`px-4 py-2 rounded-full ${
        active 
          ? 'bg-gray-800 text-white' 
          : 'bg-purple-500 text-white hover:bg-purple-600'
      }`}>
        {label}
      </div>
    </Link>
  );
};

interface HeaderProps {
  userName: string;
  userRole: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center">
            <div className="text-purple-600 mr-2">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 3C9.716 3 3 9.716 3 18C3 26.284 9.716 33 18 33C26.284 33 33 26.284 33 18C33 9.716 26.284 3 18 3Z" fill="#8B5CF6" fillOpacity="0.2"/>
                <path d="M24 13C24 15.2091 22.2091 17 20 17C17.7909 17 16 15.2091 16 13C16 10.7909 17.7909 9 20 9C22.2091 9 24 10.7909 24 13Z" fill="#8B5CF6"/>
                <path d="M12 17C12 19.2091 10.2091 21 8 21C5.79086 21 4 19.2091 4 17C4 14.7909 5.79086 13 8 13C10.2091 13 12 14.7909 12 17Z" fill="#8B5CF6"/>
                <path d="M32 17C32 19.2091 30.2091 21 28 21C25.7909 21 24 19.2091 24 17C24 14.7909 25.7909 13 28 13C30.2091 13 32 14.7909 32 17Z" fill="#8B5CF6"/>
                <path d="M16 25C16 27.2091 14.2091 29 12 29C9.79086 29 8 27.2091 8 25C8 22.7909 9.79086 21 12 21C14.2091 21 16 22.7909 16 25Z" fill="#8B5CF6"/>
                <path d="M28 25C28 27.2091 26.2091 29 24 29C21.7909 29 20 27.2091 20 25C20 22.7909 21.7909 21 24 21C26.2091 21 28 22.7909 28 25Z" fill="#8B5CF6"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold">HowlX</h1>
          </div>
        </Link>
      </div>
      
      <div className="flex space-x-2">
        <NavItem label="Transcribe & reporta" href="/" active={true} />
        <NavItem label="Dashboard" href="/dashboard" />
        <NavItem label="Howl AI" href="/ai" />
        <NavItem label="Log de llamadas" href="/log" />
      </div>
      
      <div className="flex items-center">
        <div className="mr-2 text-right">
          <div>{userName}</div>
          <div className="text-sm text-gray-500">{userRole}</div>
        </div>
        {/* <div className="w-10 h-10 rounded-full bg-purple-200 overflow-hidden">
          <Image 
            src="https://i.pravatar.cc/40?img=68" 
            alt="User profile" 
            width={40} 
            height={40} 
            className="object-cover"
          />
        </div> */}
      </div>
    </header>
  );
};

export default Header;