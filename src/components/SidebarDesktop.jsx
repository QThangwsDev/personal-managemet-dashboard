import Avatar from "./Avartar";
import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import { Dot, PanelLeftOpen,PanelRightOpen,Settings } from "lucide-react";
import { useState } from "react";

const SidebarDesktop = ({ navItems, collapse, onClick }) => {

    const [today] = useState(() => new Date());
    
    const date = today.getDate();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const monthInWord = monthNames[today.getMonth()];
    const year = today.getFullYear();   

    return (
        <div className='w-full h-full flex flex-col justify-start py-5 space-y-2 relative select-none'>
            {/* Logo hoặc tên ứng dụng */}
            <Logo collapse={collapse} />
            <Avatar collapse={collapse} />

            {/* Phần menu điều hướng */}
            
            <div className='flex flex-col justify-start  mx-4 mt-3'>
                {navItems.map(item => (
                    <NavLink 
                        key={item.id} 
                        to={item.to} 
                        end={item.to === '/'} 
                        className={({ isActive }) => 
                            `group cursor-pointer w-full flex items-center  mt-4 hover:bg-[#ad6b54] hover:text-white rounded-3xl px-2 py-2.5 transition-colors duration-200 ${
                                isActive ? 'bg-[#9b4829] text-white' : 'text-gray-400'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className='flex items-center space-x-3 w-full min-w-0'>
                                    {/* Icon cố định kích thước để tránh bóp méo layout */}
                                    <div className='w-6 h-6 shrink-0 flex items-center justify-center'>
                                        {item.icon}
                                    </div>
                                    
                                    {/* Text: Giải quyết dứt điểm lỗi nhảy static/absolute */}
                                    <span 
                                        className={`whitespace-nowrap transition-all duration-300 font-medium overflow-hidden ${
                                            collapse 
                                                ? 'w-0 opacity-0 pointer-events-none' 
                                                : 'w-auto opacity-100'
                                        }`}
                                    >
                                        {item.label}
                                    </span>

                                    {/* Bản Tooltip độc lập: Chỉ xuất hiện khi hover lúc sidebar đang thu gọn */}
                                    {collapse && (
                                        <div className="absolute left-16 invisible opacity-0 translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 bg-[#ad6b54] text-white text-xs px-2.5 py-1.5 rounded-md shadow-xl z-50 pointer-events-none font-medium">
                                            {item.label}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Dấu chấm active */}
                                {!collapse && isActive && (
                                    <Dot className="text-[#ff5d22] w-6 h-6 shrink-0" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

           
            <button className='mt-auto mx-4 cursor-pointer flex flex-row items-center justify-start hover:bg-[#ad6b54] hover:text-white rounded-lg px-3 py-2.5 transition-colors duration-200 text-gray-400 space-x-3'>
                <div className='shrink-0 flex items-center justify-center w-6 h-6'><Settings/></div>
                {!collapse && <p>Setting</p>}
            </button>
            
            {/* Nút bấm Toggle Thu gọn */}
            <div className='flex justify-center items-center pt-2'>
                <button 
                    className="w-10 h-8 cursor-pointer flex justify-center items-center hover:text-white text-gray-400 transition-colors duration-200" 
                    onClick={onClick}
                >
                    {collapse?<PanelLeftOpen/>:<PanelRightOpen/> }
                    
                </button>
            </div>
            
            {/* Khoảng đệm cố định */}
            <div className="h-6"></div>
            
            {/* Thông tin ngày tháng */}
            <span className='w-full absolute bottom-2 text-[11px] text-gray-500 flex justify-center items-center text-center px-1 pointer-events-none font-medium'>
                {collapse ? `${date} ${monthInWord.substring(0, 3)}` : `${monthInWord} ${date}, ${year}`}
            </span>
                
        </div>
    );
};

export default SidebarDesktop;