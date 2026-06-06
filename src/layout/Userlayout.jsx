import SidebarMoblie from '../components/SidebarMoblie';
import SidebarDesktop from '../components/SidebarDesktop'; 
import HeaderMobile from '../components/HeaderMobile';
import { AppstoreOutlined, ScheduleOutlined, DollarOutlined, CheckSquareOutlined, CalendarOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

function UserLayout() {
    const [isScroll, setScroll] = useState(false);
    const [collapse, setCollapse] = useState(false);
    
    const handleScroll = (e) => {
        const scrollTop = e.currentTarget.scrollTop;
        setScroll(scrollTop > 20);
    };

    const handleCollapse = () =>{
        setCollapse(!collapse);
    }
    const navItems = [
        { id: 'Home', label: 'Home', to: '/', icon: <AppstoreOutlined className='ml-1' /> },
        { id: 'Schedule', label: 'Schedule', to: '/schedule', icon: <ScheduleOutlined className='ml-1' /> },
        { id: 'Tasks', label: 'Tasks', to: '/tasks', icon: <CheckSquareOutlined className='ml-1'/> },
        { id: 'Expense', label: 'Expense', to: '/expense', icon: <DollarOutlined className='ml-1' /> },
        { id: 'Cycle', label: 'Cycle', to: '/cycle', icon: <CalendarOutlined className='ml-1' /> }
    ];

    return (
        <div className='w-full h-screen bg-white flex flex-col-reverse md:flex-row relative overflow-hidden'>
            
            {/* SIDEBAR MOBILE: Dùng lại CSS để tránh chớp khi kéo màn hình */}
            <div className='w-[90%] max-w-md h-20 bg-white fixed bottom-4 left-1/2 -translate-x-1/2 p-3 rounded-3xl shadow-2xl z-50 md:hidden flex items-center justify-center border border-gray-100'>
               <SidebarMoblie navItems={navItems} />
            </div>

            {/* SIDEBAR DESKTOP */}
            <div className={`hidden md:flex ${collapse ? 'w-20':'w-50'} h-full bg-[#352319] text-white items-center justify-center m-0 flex-shrink-0 transition-all duration-300`}>
               <SidebarDesktop 
                    navItems={navItems}
                    collapse={collapse}
                    onClick={handleCollapse}
                />
            </div>
     
            {/* MAIN CONTENT */}
            <div 
                className='bg-[#251B19] flex-1 h-full w-full flex flex-col pt-18 md:pt-0 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                onScroll={handleScroll}   
            >
                <Outlet />
            </div>

            {/* HEADER MOBILE */}
            <div className={`w-full h-18 fixed top-0 transition-colors duration-300 ${isScroll ? 'bg-[#28201b]' : 'bg-[#40332a]'} text-white flex items-center justify-center z-40 md:hidden border-b border-gray-700`}>
                <HeaderMobile />
            </div>

        </div>
    );
}
export default UserLayout;