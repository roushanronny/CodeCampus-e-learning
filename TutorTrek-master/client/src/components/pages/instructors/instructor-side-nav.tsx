import React, { useState } from "react";
import { Link } from "react-router-dom";
import {MdLibraryAdd} from "react-icons/md"
import {
  HomeIcon,
} from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";

import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import {IoMdChatboxes} from 'react-icons/io'
import { FaUserGraduate } from "react-icons/fa";
import {UserCircleIcon} from "@heroicons/react/24/outline";


const icon = {
  className: "w-5 h-5 text-inherit",
};
const routes = [
  {
    title: "Home",
    icon: <HomeIcon {...icon} />,
    value: "home",
    path:'/instructors/'
  },
  {
    title: "View courses",
    icon: <Square3Stack3DIcon {...icon} />,
    value: "view-course",
    path:'/instructors/view-course'
  },
  {
    title: "Add courses",
    icon: <MdLibraryAdd {...icon} />,
    value: "add-course",
    path:'/instructors/add-course'
  },
  {
    title:"My students",
    icon:<FaUserGraduate {...icon}/>,
    value:"view-students",
    path:"/instructors/view-students"
  },
  {
    title:"My Profile",
    icon:<UserCircleIcon {...icon}/>,
    value:"view-profile",
    path:"/instructors/view-profile"
  },
  {
    title:"Channels",
    icon:<IoMdChatboxes {...icon}/>,
    value:"view-channels",
    path:'/instructors/view-channels'
  },
  
];

const InstructorSideNav: React.FC = () => {
  const location = useLocation()
  const parts = location.pathname.split('/');
  const result = parts.slice(2).join('/');
  const [isActive, setIsActive] = useState<string>(result===""?'home':result);
  const selected = false;
  const handleClick = (active: string) => {
    setIsActive(active);
  };
  return (
    <nav className='bg-white h-screen w-64 border-r border-gray-300 flex flex-col'>
      <ul className='py-6'>
        {routes.map(({ title, icon, value,path },index) => {
          return (
            <li key={index} className='py-2 px-4'>
              <Link 
                to={path} 
                className="block"
                onClick={() => {
                  handleClick(value);
                }}
              >
                <div
                  className={`flex items-center gap-4 capitalize rounded-md px-3 py-2 transition-colors ${
                    isActive === value 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  } ${isActive && selected ? " bg-indigo-600" : ""}`}
                >
                  {icon}
                  <Typography 
                    color={isActive===value?'inherit':'gray'} 
                    className='font-bold capitalize'
                  >
                    {title}
                  </Typography>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default InstructorSideNav;
