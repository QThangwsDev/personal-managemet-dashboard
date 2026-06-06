import { useLocation } from "react-router-dom";

const HeaderMobile = () => {

    const location = useLocation();

    const pageTitles = {
        "/": "Overview",          // Vì path="/" kết hợp với route index sẽ render Overview
        "/schedule": "Schedule",  // Đường dẫn /schedule
        "/tasks": "To-Do List",   // Đường dẫn /tasks (Bạn có thể đổi thành "Tasks" tùy ý)
        "/expense": "Expenses",   // Đường dẫn /expense
        "/cycle": "Cycle"
    };
    const currentTitle = pageTitles[location.pathname] || "Home";

    return (
        <div className='w-full h-full flex items-center justify-between px-4'>
            {/* Logo hoặc tên ứng dụng */}
            <div className='text-lg font-bold tracking-wide'>Per</div>

            {/* Ten trang hien tai */}
            <div className='text-sm tracking-wide font-bold'>{currentTitle}</div>

             {/* icon Avartar */}
            <div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                JD
            </div>            
        </div>
    )

};

export default HeaderMobile;