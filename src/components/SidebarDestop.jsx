import Avatar from "./Avartar";
import Logo from "./Logo";




const SidebarDesktop = ({navItems}) => {


    return (
        <div className='w-full h-full bg-gray-800 text-white flex flex-col  justify-start py-5 space-y-5 m-2 '>
            {/* Logo hoặc tên ứng dụng */}
            <Logo />
            <Avatar />

            {/* Phần menu điều hướng */}
            <div className='felx flex-col  justify-start space-y-5 mx-5 mt-10'>
                {navItems.map(item => (
                <div key={item.id} className='cursor-pointer justify-center space-x-2 mt-5 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors duration-200'>
                    {item.icon} <span>{item.label}</span>
                </div>
                ))}
            </div>
            {/* Phần cài đặt hoặc thong tin ngay thang dùng ở cuối sidebar */}
            <div className='mt-auto mx-5 mb-2 cursor-pointer justify-center space-x-2 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors duration-200'>
                <span>Settings</span>
                <span className='ml-2'>⚙️</span>
            </div>
            <span >Thue  May 2,2026</span>
                
        </div>
    
    )

}

export default SidebarDesktop;