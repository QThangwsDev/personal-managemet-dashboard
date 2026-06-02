import SidebarMoblie from '../components/SidebarMoblie';
import SidebarDesktop from '../components/SidebarDestop';
import HeaderMobile from '../components/HeaderMobile';
import { AppstoreOutlined , ScheduleOutlined, DollarOutlined, CheckSquareOutlined, CalendarOutlined} from '@ant-design/icons';
import Overview from '../pages/Overview';


function Userlayout() {
    

     const navItems = [
        {
            id:'Home',
            label:'Home',
            to:'/',
            icon: <AppstoreOutlined />
        },

        {
            id:'Schedule',
            label:'Schedule',
            to:'/schedule',
            icon: <ScheduleOutlined />
        },
        {
            id:'Tasks',
            label:'Tasks',
            to:'/tasks',
            icon: <CheckSquareOutlined />
        },
        {
            id:'Expense',
            label:'Expense',
            to:'/expense',
            icon: <DollarOutlined />
        },
        {
            id:'Cycle',
            label:'Cycle',
            to:'/cycle',
            icon: <CalendarOutlined />
        }
    ];


    return (
        
        <div className='w-full h-screen bg-white text-white flex flex-col-reverse md:flex-row relative overflow-hidden'>
            
            {/* SIDEBAR MOBILE */}
            {/* Giữ nguyên khóa chặt ở giữa không bị chạy qua phải */}
            <div className='w-[90%] max-w-md h-20 bg-white fixed bottom-4 left-1/2 -translate-x-1/2 p-3 rounded-3xl shadow-2xl z-50 md:hidden flex items-center justify-center border border-gray-100'>
               <SidebarMoblie
                    navItems={navItems} />
            </div>

            {/* SIDEBAR DESKTOP */}
            <div className='hidden md:flex w-50 h-full bg-gray-800 text-white items-center justify-center'>
               <SidebarDesktop navItems={navItems} />
            </div>
     
            {/* MAIN CONTENT (VÙNG NỘI DUNG CHÍNH) */}
            
            <div className='bg-[#251B19] h-full w-full flex flex-col pt-18 md:pt-0 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                {/* Nội dung chính sẽ được hiển thị ở đây */}
                {/* outlet o day */}

                <Overview />
            </div>

            {/* HEADER MOBILE */}
            <div className='w-full h-18 fixed top-0 bg-gray-800 text-white flex items-center justify-center z-40 md:hidden border-b border-gray-700'>
                <HeaderMobile />
            </div>

        </div>
    );
}

export default Userlayout;