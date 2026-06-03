import Avatar from "./Avartar";
import Logo from "./Logo";
import { useState } from "react";




const SidebarDesktop = ({navItems}) => {

    const [sex,setSex] = useState('Nam');
    


    return (
        <div className='w-full h-full  text-white flex flex-col  justify-start py-5 space-y-2 relative '>
            {/* Logo hoặc tên ứng dụng */}
            <Logo />
            <Avatar />

            {/* Phần menu điều hướng */}
            <div className='felx flex-col  justify-start space-y-5 mx-5 mt-10'>
                {navItems.filter( item =>{
                    if(sex === 'Nam' && item.id==='Cycle') {
                        return false;
                    }
                    return true;
                })
                .map(item => (
                <div key={item.id} className='cursor-pointer justify-center space-x-2 mt-5 hover:bg-[#ad6b54] rounded-lg px-3 py-2 transition-colors duration-200'>
                    {item.icon} <span>{item.label}</span>
                </div>
                ))}
            </div>
            {/* Phần cài đặt hoặc thong tin ngay thang dùng ở cuối sidebar */}
            <div className='mt-auto mx-5 mb-2 cursor-pointer justify-center space-x-2 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors duration-200'>
                <span>Settings</span>
                <span className='ml-2'>⚙️</span>
            </div>
            <span className=' w-full absolute bottom-0 text-[14px] flex justify-center items-center'>Thue  May 2,2026</span>
                
        </div>
    
    )

}

export default SidebarDesktop;